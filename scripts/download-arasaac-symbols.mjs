import { mkdir, readFile, writeFile } from 'node:fs/promises'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const cardSymbolMapPath = path.join(__dirname, 'arasaac-card-symbol-map.json')
const categorySymbolMapPath = path.join(
  __dirname,
  'arasaac-category-symbol-map.json',
)
const cardOutputDirectory = path.join(
  projectRoot,
  'public',
  'symbols',
  'arasaac',
  'cards',
)
const categoryOutputDirectory = path.join(
  projectRoot,
  'public',
  'symbols',
  'arasaac',
  'categories',
)
const arasaacBaseUrl = 'https://static.arasaac.org/pictograms'

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

function parseMapFile(filePath, label) {
  return readFile(filePath, 'utf8').then((content) => {
    const parsed = JSON.parse(content)

    if (!Array.isArray(parsed)) {
      throw new Error(`${label} eşleme dosyası dizi formatında olmalı.`)
    }

    return parsed
  })
}

async function downloadMappedSymbols({
  entries,
  outputDirectory,
  entryKey,
  summaryLabel,
}) {
  await mkdir(outputDirectory, { recursive: true })

  const invalidEntries = []
  const failedDownloads = []
  let successCount = 0

  for (const entry of entries) {
    const entryId = entry?.[entryKey]
    const { arasaacId } = entry ?? {}

    if (typeof entryId !== 'string' || typeof arasaacId !== 'number') {
      invalidEntries.push(entry)
      continue
    }

    const imageUrl = `${arasaacBaseUrl}/${arasaacId}/${arasaacId}_500.png`
    const outputPath = path.join(outputDirectory, `${entryId}.png`)

    try {
      const imageBuffer = await downloadPictogram(imageUrl)
      await writeFile(outputPath, imageBuffer)
      console.log(`Indirildi (${summaryLabel}): ${entryId} <- ${arasaacId}`)
      successCount += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failedDownloads.push({ entryId, arasaacId, message })
    }
  }

  console.log(`\n${summaryLabel} özeti:`)
  console.log(`- Başarılı indirme: ${successCount}`)
  console.log(`- Hatalı eşleme: ${invalidEntries.length}`)
  console.log(`- Başarısız indirme: ${failedDownloads.length}`)

  if (invalidEntries.length > 0) {
    console.error(`\nHatalı ${summaryLabel.toLowerCase()} eşlemeleri:`)
    for (const entry of invalidEntries) {
      console.error(`- ${JSON.stringify(entry)}`)
    }
  }

  if (failedDownloads.length > 0) {
    console.error(`\nİndirilemeyen ${summaryLabel.toLowerCase()} sembolleri:`)
    for (const failure of failedDownloads) {
      console.error(
        `- ${failure.entryId} (ARASAAC ${failure.arasaacId}): ${failure.message}`,
      )
    }
    process.exitCode = 1
  }
}

const cardEntries = await parseMapFile(cardSymbolMapPath, 'Kart')
const categoryEntries = await parseMapFile(categorySymbolMapPath, 'Kategori')

await downloadMappedSymbols({
  entries: cardEntries,
  outputDirectory: cardOutputDirectory,
  entryKey: 'cardId',
  summaryLabel: 'Kart',
})

await downloadMappedSymbols({
  entries: categoryEntries,
  outputDirectory: categoryOutputDirectory,
  entryKey: 'categoryId',
  summaryLabel: 'Kategori',
})
