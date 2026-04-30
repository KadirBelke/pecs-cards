import { writeFile } from 'node:fs/promises'
import {
  __dirname,
  buildQueries,
  fetchJson,
  path,
  readCategories,
  readCards,
} from './arasaac-utils.mjs'

const cachePath = path.join(__dirname, 'arasaac-catalog-cache.json')

const cards = await readCards()
const categories = await readCategories()

const queryPool = new Set()

for (const card of cards) {
  for (const query of buildQueries(card.label, card.searchTerms)) {
    queryPool.add(query)
  }
}

for (const category of categories) {
  for (const query of buildQueries(category.label)) {
    queryPool.add(query)
  }
}

const queries = [...queryPool].slice(0, 500)
const entriesById = new Map()
const failures = []

for (const query of queries) {
  const url = `https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(query)}`

  try {
    const results = await fetchJson(url)

    if (!Array.isArray(results)) {
      failures.push({ query, error: 'Beklenmeyen API yanıtı' })
      continue
    }

    for (const result of results) {
      const arasaacId = result?._id

      if (typeof arasaacId !== 'number') {
        continue
      }

      const keywords = (result.keywords ?? [])
        .map((keyword) =>
          typeof keyword === 'string' ? keyword : keyword?.keyword ?? '',
        )
        .filter(Boolean)

      const entry = entriesById.get(arasaacId) ?? {
        arasaacId,
        keywords: [],
        downloads: result.downloads ?? null,
        url: `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_500.png`,
        sourceQueries: [],
      }

      entry.keywords = [...new Set([...entry.keywords, ...keywords])]
      entry.sourceQueries = [...new Set([...entry.sourceQueries, query])]

      if (typeof result.downloads === 'number') {
        entry.downloads = result.downloads
      }

      entriesById.set(arasaacId, entry)
    }
  } catch (error) {
    failures.push({
      query,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

const cache = {
  fetchedAt: new Date().toISOString(),
  queryCount: queries.length,
  itemCount: entriesById.size,
  failures,
  items: [...entriesById.values()].sort((left, right) => {
    const leftDownloads = typeof left.downloads === 'number' ? left.downloads : -1
    const rightDownloads =
      typeof right.downloads === 'number' ? right.downloads : -1

    return rightDownloads - leftDownloads
  }),
}

await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`)

console.log(`ARASAAC katalog önbelleği yazıldı: ${cachePath}`)
console.log(`- Sorgu sayısı: ${cache.queryCount}`)
console.log(`- Toplam aday: ${cache.itemCount}`)
console.log(`- Hata sayısı: ${cache.failures.length}`)
