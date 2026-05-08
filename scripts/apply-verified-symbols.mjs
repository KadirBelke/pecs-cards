import { mkdir, copyFile } from 'node:fs/promises'
import { __dirname, path, projectRoot, readFile } from './arasaac-utils.mjs'

const verifiedMapPath = path.join(__dirname, 'verified-card-symbol-map.json')
const outputDirectory = path.join(
  projectRoot,
  'public',
  'symbols',
  'arasaac',
  'cards',
)

const verifiedItems = JSON.parse(await readFile(verifiedMapPath, 'utf8'))

await mkdir(outputDirectory, { recursive: true })

let appliedCount = 0

for (const item of verifiedItems) {
  if (
    !item ||
    typeof item.cardId !== 'string' ||
    item.source !== 'arasaac' ||
    typeof item.symbolId !== 'number' ||
    typeof item.image !== 'string'
  ) {
    console.error(`Geçersiz doğrulanmış eşleme: ${JSON.stringify(item)}`)
    process.exitCode = 1
    continue
  }

  const sourcePath = path.join(
    projectRoot,
    'public',
    'symbol-candidates',
    'cards',
    item.cardId,
    `${item.symbolId}.png`,
  )
  const destinationPath = path.join(outputDirectory, `${item.cardId}.png`)

  try {
    await copyFile(sourcePath, destinationPath)
    appliedCount += 1
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`${item.cardId} kopyalanamadı: ${message}`)
    process.exitCode = 1
  }
}

console.log(`Uygulanan doğrulanmış sembol sayısı: ${appliedCount}`)
