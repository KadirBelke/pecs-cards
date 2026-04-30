import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const cardsFilePath = path.join(projectRoot, 'src', 'data', 'cards.ts')
const cardMapPath = path.join(__dirname, 'arasaac-card-symbol-map.json')

function extractCards(source) {
  const cardPattern =
    /\{\s*id: '([^']+)',\s*label: '([^']+)',\s*category: '([^']+)',\s*emoji: '([^']+)',\s*textToSpeak: '([^']+)'(?:,\s*searchTerms: \[([^\]]*)\])?\s*\}/g
  const searchTermPattern = /'([^']+)'/g
  const cards = []

  for (const match of source.matchAll(cardPattern)) {
    const [, id, label, category, , , rawSearchTerms] = match
    const searchTerms = []

    if (rawSearchTerms) {
      for (const termMatch of rawSearchTerms.matchAll(searchTermPattern)) {
        searchTerms.push(termMatch[1])
      }
    }

    cards.push({
      id,
      label,
      category,
      searchTerms,
    })
  }

  return cards
}

const [cardsSource, cardMapSource] = await Promise.all([
  readFile(cardsFilePath, 'utf8'),
  readFile(cardMapPath, 'utf8'),
])

const cards = extractCards(cardsSource)
const verifiedMappings = new Set(
  JSON.parse(cardMapSource).map((entry) => entry.cardId),
)

const missingCards = cards.filter((card) => !verifiedMappings.has(card.id))

console.log(`Toplam kart: ${cards.length}`)
console.log(`Doğrulanmış görsel eşleşmesi olan kart: ${verifiedMappings.size}`)
console.log(`Eksik görsel eşleşmesi olan kart: ${missingCards.length}\n`)

for (const card of missingCards) {
  console.log(`id: ${card.id}`)
  console.log(`label: ${card.label}`)
  console.log(`category: ${card.category}`)
  console.log(
    `searchTerms: ${card.searchTerms.length > 0 ? card.searchTerms.join(', ') : '-'}`,
  )
  console.log('')
}
