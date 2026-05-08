import { mkdir, writeFile } from 'node:fs/promises'
import https from 'node:https'
import {
  __dirname,
  buildQueries,
  normalizeKeywords,
  path,
  projectRoot,
  readCards,
  readFile,
  scoreCandidate,
} from './arasaac-utils.mjs'

const cachePath = path.join(__dirname, 'arasaac-catalog-cache.json')
const verifiedMapPath = path.join(__dirname, 'verified-card-symbol-map.json')
const improvedSearchTermsPaths = [
  path.join(__dirname, 'improved-card-search-terms.json'),
  path.join(
    __dirname,
    'improved-search-terms',
    'improved-card-search-terms.json',
  ),
]
const reviewDirectory = path.join(__dirname, 'pictogram-review')
const reviewJsonPath = path.join(reviewDirectory, 'cards-review.json')
const candidateRootDirectory = path.join(
  projectRoot,
  'public',
  'symbol-candidates',
  'cards',
)
const arasaacBaseUrl = 'https://static.arasaac.org/pictograms'
const maxCandidatesPerCard = 5
const lowConfidenceThreshold = 0.2

function downloadPictogram(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode ?? 'unknown'}`))
          response.resume()
          return
        }

        const chunks = []

        response.on('data', (chunk) => {
          chunks.push(chunk)
        })

        response.on('end', () => {
          resolve(Buffer.concat(chunks))
        })
      })
      .on('error', reject)
  })
}

function buildCandidates(catalogItems, queries) {
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
    .slice(0, maxCandidatesPerCard)
    .map(({ downloads: _downloads, ...candidate }) => candidate)
}

async function readImprovedSearchTerms() {
  for (const filePath of improvedSearchTermsPaths) {
    try {
      const content = await readFile(filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      if (error && typeof error === 'object' && error.code === 'ENOENT') {
        continue
      }
      throw error
    }
  }

  return []
}

async function readVerifiedCardIds() {
  const content = await readFile(verifiedMapPath, 'utf8')
  const verifiedItems = JSON.parse(content)
  return new Set(
    Array.isArray(verifiedItems)
      ? verifiedItems
          .map((item) => item?.cardId)
          .filter((cardId) => typeof cardId === 'string')
      : [],
  )
}

const cache = JSON.parse(await readFile(cachePath, 'utf8'))
const catalogItems = Array.isArray(cache.items) ? cache.items : []
const verifiedCardIds = await readVerifiedCardIds()
const cards = (await readCards()).filter((card) => !verifiedCardIds.has(card.id))
const improvedSearchTerms = await readImprovedSearchTerms()
const improvedSearchTermsByCardId = new Map(
  improvedSearchTerms.map((entry) => [entry.cardId, entry.searchTerms]),
)

await mkdir(candidateRootDirectory, { recursive: true })
await mkdir(reviewDirectory, { recursive: true })

const reviewItems = []
let downloadCount = 0
let noCandidatesCount = 0
let lowConfidenceCount = 0
const failedDownloads = []

for (const card of cards) {
  const improvedTerms = improvedSearchTermsByCardId.get(card.id)
  const queryTerms = Array.isArray(improvedTerms)
    ? buildQueries('', improvedTerms)
    : buildQueries(card.label, card.searchTerms)
  const candidates = buildCandidates(catalogItems, queryTerms)
  const topCandidateScore = candidates[0]?.score ?? 0
  const cardDirectory = path.join(candidateRootDirectory, card.id)

  await mkdir(cardDirectory, { recursive: true })

  const candidateRecords = []

  if (candidates.length === 0) {
    noCandidatesCount += 1
  } else if (topCandidateScore < lowConfidenceThreshold) {
    lowConfidenceCount += 1
  }

  for (const candidate of candidates) {
    const imageUrl = `${arasaacBaseUrl}/${candidate.arasaacId}/${candidate.arasaacId}_500.png`
    const outputPath = path.join(cardDirectory, `${candidate.arasaacId}.png`)
    const reviewImagePath = `../../public/symbol-candidates/cards/${card.id}/${candidate.arasaacId}.png`
    const publicImagePath = `/symbol-candidates/cards/${card.id}/${candidate.arasaacId}.png`

    try {
      const imageBuffer = await downloadPictogram(imageUrl)
      await writeFile(outputPath, imageBuffer)
      downloadCount += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failedDownloads.push({
        cardId: card.id,
        arasaacId: candidate.arasaacId,
        message,
      })
    }

    candidateRecords.push({
      arasaacId: candidate.arasaacId,
      imagePath: publicImagePath,
      reviewImagePath,
      keywords: candidate.keywords,
      score: candidate.score,
    })
  }

  reviewItems.push({
    cardId: card.id,
    label: card.label,
    category: card.category,
    emoji: card.emoji,
    queryTerms,
    usedImprovedSearchTerms: Array.isArray(improvedTerms),
    topCandidateScore,
    candidateImagePaths: candidateRecords.map((candidate) => candidate.imagePath),
    candidateArasaacIds: candidateRecords.map((candidate) => candidate.arasaacId),
    candidates: candidateRecords,
  })
}

await writeFile(reviewJsonPath, `${JSON.stringify(reviewItems, null, 2)}\n`)

console.log(`Aday görseller kaydedildi: ${candidateRootDirectory}`)
console.log(`İnceleme verisi yazıldı: ${reviewJsonPath}`)
console.log(`İndirilen aday görsel sayısı: ${downloadCount}`)
console.log(`Aday bulunamayan kart sayısı: ${noCandidatesCount}`)
console.log(`Düşük güvenli eşleşme sayısı: ${lowConfidenceCount}`)

if (failedDownloads.length > 0) {
  console.error('\nİndirilemeyen aday görseller:')
  for (const failure of failedDownloads) {
    console.error(
      `- ${failure.cardId} / ${failure.arasaacId}: ${failure.message}`,
    )
  }
  process.exitCode = 1
}
