import { writeFile } from 'node:fs/promises'
import { __dirname, path, readFile } from './arasaac-utils.mjs'

const force = process.argv.includes('--force')

const cardSuggestionsPath = path.join(__dirname, 'arasaac-card-suggestions.json')
const categorySuggestionsPath = path.join(
  __dirname,
  'arasaac-category-suggestions.json',
)
const cardMapPath = path.join(__dirname, 'arasaac-card-symbol-map.json')
const categoryMapPath = path.join(__dirname, 'arasaac-category-symbol-map.json')

function mergeMappings(existingMappings, suggestions, idKey) {
  const mappingById = new Map(
    existingMappings.map((entry) => [entry[idKey], entry]),
  )

  for (const suggestion of suggestions) {
    const itemId = suggestion[idKey]
    const firstCandidate = suggestion.candidates?.[0]

    if (!itemId || !firstCandidate || typeof firstCandidate.arasaacId !== 'number') {
      continue
    }

    if (!force && mappingById.has(itemId)) {
      continue
    }

    mappingById.set(itemId, {
      [idKey]: itemId,
      arasaacId: firstCandidate.arasaacId,
    })
  }

  return [...mappingById.values()].sort((left, right) =>
    String(left[idKey]).localeCompare(String(right[idKey]), 'tr'),
  )
}

const [
  cardSuggestions,
  categorySuggestions,
  existingCardMap,
  existingCategoryMap,
] = await Promise.all([
  readFile(cardSuggestionsPath, 'utf8').then(JSON.parse),
  readFile(categorySuggestionsPath, 'utf8').then(JSON.parse),
  readFile(cardMapPath, 'utf8').then(JSON.parse),
  readFile(categoryMapPath, 'utf8').then(JSON.parse),
])

const nextCardMap = mergeMappings(existingCardMap, cardSuggestions, 'cardId')
const nextCategoryMap = mergeMappings(
  existingCategoryMap,
  categorySuggestions,
  'categoryId',
)

await writeFile(cardMapPath, `${JSON.stringify(nextCardMap, null, 2)}\n`)
await writeFile(categoryMapPath, `${JSON.stringify(nextCategoryMap, null, 2)}\n`)

console.log(`Kart eşlemeleri güncellendi: ${cardMapPath}`)
console.log(`Kategori eşlemeleri güncellendi: ${categoryMapPath}`)
console.log(`--force: ${force ? 'açık' : 'kapalı'}`)
