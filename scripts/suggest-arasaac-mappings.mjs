import { writeFile } from 'node:fs/promises'
import {
  __dirname,
  buildQueries,
  normalizeKeywords,
  path,
  readCategories,
  readCards,
  readFile,
  scoreCandidate,
} from './arasaac-utils.mjs'

const cachePath = path.join(__dirname, 'arasaac-catalog-cache.json')
const cardSuggestionsPath = path.join(__dirname, 'arasaac-card-suggestions.json')
const categorySuggestionsPath = path.join(
  __dirname,
  'arasaac-category-suggestions.json',
)

const cache = JSON.parse(await readFile(cachePath, 'utf8'))
const catalogItems = Array.isArray(cache.items) ? cache.items : []
const cards = await readCards()
const categories = await readCategories()

function buildCandidates(queries) {
  return catalogItems
    .map((item) => {
      const keywords = normalizeKeywords(item.keywords)
      const score = scoreCandidate(queries, keywords)

      return {
        arasaacId: item.arasaacId,
        keywords: keywords.slice(0, 8),
        score,
        downloads: item.downloads ?? null,
      }
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      const leftDownloads =
        typeof left.downloads === 'number' ? left.downloads : -1
      const rightDownloads =
        typeof right.downloads === 'number' ? right.downloads : -1

      return rightDownloads - leftDownloads
    })
    .slice(0, 3)
    .map(({ downloads: _downloads, ...candidate }) => candidate)
}

const cardSuggestions = cards.map((card) => {
  const query = buildQueries(card.label, card.searchTerms)

  return {
    cardId: card.id,
    label: card.label,
    category: card.category,
    query,
    candidates: buildCandidates(query),
  }
})

const categorySuggestions = categories.map((category) => {
  const query = buildQueries(category.label)

  return {
    categoryId: category.id,
    label: category.label,
    query,
    candidates: buildCandidates(query),
  }
})

await writeFile(cardSuggestionsPath, `${JSON.stringify(cardSuggestions, null, 2)}\n`)
await writeFile(
  categorySuggestionsPath,
  `${JSON.stringify(categorySuggestions, null, 2)}\n`,
)

console.log(`Kart önerileri yazıldı: ${cardSuggestionsPath}`)
console.log(`Kategori önerileri yazıldı: ${categorySuggestionsPath}`)
