import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile } from '../arasaac-utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const reviewDirectory = path.dirname(__filename)
const reviewJsonPath = path.join(reviewDirectory, 'cards-review.json')
const reviewHtmlPath = path.join(reviewDirectory, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const reviewItems = JSON.parse(await readFile(reviewJsonPath, 'utf8'))
const itemsByCategory = new Map()
const categories = [...new Set(reviewItems.map((item) => item.category))].sort((left, right) =>
  left.localeCompare(right, 'tr'),
)

for (const item of reviewItems) {
  const categoryItems = itemsByCategory.get(item.category) ?? []
  categoryItems.push(item)
  itemsByCategory.set(item.category, categoryItems)
}

const categorySections = [...itemsByCategory.entries()]
  .sort((left, right) => left[0].localeCompare(right[0], 'tr'))
  .map(([category, items]) => {
    const cardsMarkup = items
      .map((item) => {
        const candidatesMarkup =
          item.candidates.length > 0
            ? item.candidates
                .map(
                  (candidate) => `
          <button
            type="button"
            class="candidate"
            data-card-id="${escapeHtml(item.cardId)}"
            data-symbol-id="${escapeHtml(candidate.arasaacId)}"
          >
            <img src="${escapeHtml(candidate.reviewImagePath)}" alt="${escapeHtml(item.label)} aday sembolü ${candidate.arasaacId}">
            <span class="candidate-id">ARASAAC ${candidate.arasaacId}</span>
          </button>`,
                )
                .join('')
            : '<p class="empty">Aday bulunamadı.</p>'

        return `
        <article class="card" data-card-id="${escapeHtml(item.cardId)}" data-category="${escapeHtml(item.category)}">
          <header class="card-header">
            <div>
              <h3>${escapeHtml(item.label)}</h3>
              <p>${escapeHtml(item.category)}</p>
            </div>
            <div class="emoji" aria-hidden="true">${escapeHtml(item.emoji)}</div>
          </header>
          <p class="queries"><strong>Sorgular:</strong> ${escapeHtml(item.queryTerms.join(', '))}</p>
          <div class="selection-row">
            <button type="button" class="skip-button" data-card-id="${escapeHtml(item.cardId)}">Use emoji / skip</button>
            <span class="status" data-status-for="${escapeHtml(item.cardId)}">No selection yet</span>
          </div>
          <div class="candidates">
            ${candidatesMarkup}
          </div>
        </article>`
      })
      .join('')

    return `
      <section class="category-section">
        <h2>${escapeHtml(category)}</h2>
        <div class="card-list">
          ${cardsMarkup}
        </div>
      </section>`
  })
  .join('')

const html = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pictogram Review</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5efe5;
        --panel: #fffdfa;
        --ink: #1f2937;
        --muted: #6b7280;
        --line: #e5dccd;
        --accent: #0f766e;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Trebuchet MS", "Avenir Next", sans-serif;
        background: linear-gradient(180deg, #f9f4ec 0%, var(--bg) 100%);
        color: var(--ink);
      }
      main {
        width: min(1400px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 32px 0 64px;
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 3.2rem);
      }
      .intro {
        margin: 0 0 28px;
        color: var(--muted);
        max-width: 72ch;
        line-height: 1.6;
      }
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 20;
        display: grid;
        gap: 16px;
        margin-bottom: 28px;
        padding: 18px;
        background: rgba(255, 253, 250, 0.94);
        border: 1px solid var(--line);
        border-radius: 24px;
        backdrop-filter: blur(10px);
      }
      .toolbar-top {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .summary {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        color: var(--muted);
      }
      .summary strong {
        color: var(--ink);
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .filters label {
        display: grid;
        gap: 6px;
        font-size: 0.95rem;
        color: var(--muted);
      }
      .filters select {
        min-height: 44px;
        min-width: 180px;
        padding: 0 12px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: white;
        color: var(--ink);
      }
      .export-button {
        min-height: 48px;
        padding: 0 18px;
        border: 0;
        border-radius: 16px;
        background: var(--accent);
        color: white;
        font-weight: 700;
        cursor: pointer;
      }
      .instructions {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }
      .category-section + .category-section {
        margin-top: 36px;
      }
      .category-section h2 {
        margin: 0 0 16px;
        font-size: 1.6rem;
      }
      .card-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 24px;
        padding: 18px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }
      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }
      .card-header h3 {
        margin: 0;
        font-size: 1.3rem;
      }
      .card-header p {
        margin: 6px 0 0;
        color: var(--muted);
      }
      .emoji {
        min-width: 64px;
        min-height: 64px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: #f3f4f6;
        font-size: 2rem;
      }
      .queries {
        margin: 14px 0 0;
        color: var(--muted);
        line-height: 1.5;
      }
      .selection-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-top: 14px;
      }
      .skip-button {
        min-height: 42px;
        padding: 0 14px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: #f8fafc;
        color: var(--ink);
        font-weight: 700;
        cursor: pointer;
      }
      .skip-button.is-active {
        border-color: #b45309;
        background: #fff7ed;
        color: #9a3412;
      }
      .status {
        color: var(--muted);
        font-size: 0.95rem;
      }
      .candidates {
        margin-top: 16px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
      }
      .candidate {
        margin: 0;
        padding: 12px;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: white;
        text-align: left;
        cursor: pointer;
      }
      .candidate img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: contain;
        display: block;
        background: #faf7f2;
        border-radius: 12px;
      }
      .candidate-id {
        display: block;
        margin-top: 10px;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--accent);
        text-align: center;
      }
      .candidate.is-selected {
        border-color: var(--accent);
        box-shadow: inset 0 0 0 2px #14b8a6;
        background: #f0fdfa;
      }
      .empty {
        margin: 0;
        color: var(--muted);
      }
      .is-hidden {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Pictogram Review</h1>
      <p class="intro">
        Bu sayfa yalnızca manuel gözden geçirme içindir. Aday görseller uygulamada otomatik kullanılmaz; yalnızca onaylanan eşlemeler
        <code>scripts/verified-card-symbol-map.json</code> üzerinden uygulanmalıdır.
      </p>
      <section class="toolbar">
        <div class="toolbar-top">
          <div class="summary" id="summary"></div>
          <button type="button" class="export-button" id="export-button">Export verified mappings</button>
        </div>
        <div class="filters">
          <label>
            Durum
            <select id="status-filter">
              <option value="all">Show all</option>
              <option value="missing">Only missing selection</option>
              <option value="selected">Only selected</option>
              <option value="skipped">Only skipped</option>
            </select>
          </label>
          <label>
            Kategori
            <select id="category-filter">
              <option value="all">All categories</option>
              ${categories
                .map(
                  (category) =>
                    `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`,
                )
                .join('')}
            </select>
          </label>
        </div>
        <p class="instructions">
          Kullanım: Her kart için en uygun adayı tıklayın. Hiçbiri uygun değilse <strong>Use emoji / skip</strong> seçin.
          İşiniz bittiğinde <strong>Export verified mappings</strong> ile JSON indirin, dosyayı
          <code>scripts/verified-card-symbol-map.json</code> ile değiştirin ve ardından
          <code>npm run apply:verified-symbols</code> çalıştırın.
        </p>
      </section>
      ${categorySections}
    </main>
    <script>
      const STORAGE_KEY = 'pictogram-review-selections-v1'
      const reviewItems = ${JSON.stringify(reviewItems)}
      const cards = [...document.querySelectorAll('.card')]
      const summaryElement = document.getElementById('summary')
      const statusFilter = document.getElementById('status-filter')
      const categoryFilter = document.getElementById('category-filter')
      const exportButton = document.getElementById('export-button')

      function loadSelections() {
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY)
          return raw ? JSON.parse(raw) : {}
        } catch (_error) {
          return {}
        }
      }

      function saveSelections(selections) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
      }

      const selections = loadSelections()

      function getSelectionState(cardId) {
        const selection = selections[cardId]
        if (!selection) {
          return 'missing'
        }
        if (selection.type === 'skip') {
          return 'skipped'
        }
        return 'selected'
      }

      function updateCardUI(cardId) {
        const card = document.querySelector('.card[data-card-id="' + CSS.escape(cardId) + '"]')
        if (!card) {
          return
        }

        const selection = selections[cardId]
        const status = card.querySelector('[data-status-for="' + CSS.escape(cardId) + '"]')
        const skipButton = card.querySelector('.skip-button')
        const candidates = [...card.querySelectorAll('.candidate')]

        candidates.forEach((candidate) => {
          const isSelected =
            selection &&
            selection.type === 'candidate' &&
            String(selection.symbolId) === candidate.dataset.symbolId
          candidate.classList.toggle('is-selected', Boolean(isSelected))
        })

        const isSkipped = selection && selection.type === 'skip'
        skipButton.classList.toggle('is-active', Boolean(isSkipped))

        if (!selection) {
          status.textContent = 'No selection yet'
        } else if (selection.type === 'skip') {
          status.textContent = 'Emoji fallback selected'
        } else {
          status.textContent = 'Selected ARASAAC ' + selection.symbolId
        }
      }

      function updateAllCardsUI() {
        reviewItems.forEach((item) => updateCardUI(item.cardId))
      }

      function updateSummary() {
        const total = reviewItems.length
        let selected = 0
        let skipped = 0

        reviewItems.forEach((item) => {
          const state = getSelectionState(item.cardId)
          if (state === 'selected') {
            selected += 1
          } else if (state === 'skipped') {
            skipped += 1
          }
        })

        const remaining = total - selected - skipped
        summaryElement.innerHTML = [
          '<span><strong>Total cards:</strong> ' + total + '</span>',
          '<span><strong>Selected cards:</strong> ' + selected + '</span>',
          '<span><strong>Skipped cards:</strong> ' + skipped + '</span>',
          '<span><strong>Remaining cards:</strong> ' + remaining + '</span>',
        ].join('')
      }

      function applyFilters() {
        const statusValue = statusFilter.value
        const categoryValue = categoryFilter.value

        cards.forEach((card) => {
          const cardId = card.dataset.cardId
          const category = card.dataset.category
          const state = getSelectionState(cardId)

          const matchesStatus =
            statusValue === 'all' ||
            (statusValue === 'missing' && state === 'missing') ||
            (statusValue === 'selected' && state === 'selected') ||
            (statusValue === 'skipped' && state === 'skipped')

          const matchesCategory =
            categoryValue === 'all' || categoryValue === category

          card.classList.toggle('is-hidden', !(matchesStatus && matchesCategory))
        })

        document.querySelectorAll('.category-section').forEach((section) => {
          const visibleCards = section.querySelectorAll('.card:not(.is-hidden)')
          section.classList.toggle('is-hidden', visibleCards.length === 0)
        })
      }

      function syncUI() {
        updateAllCardsUI()
        updateSummary()
        applyFilters()
      }

      document.addEventListener('click', (event) => {
        const candidate = event.target.closest('.candidate')
        if (candidate) {
          const { cardId, symbolId } = candidate.dataset
          selections[cardId] = {
            type: 'candidate',
            symbolId: Number(symbolId),
          }
          saveSelections(selections)
          syncUI()
          return
        }

        const skipButton = event.target.closest('.skip-button')
        if (skipButton) {
          const { cardId } = skipButton.dataset
          const currentSelection = selections[cardId]
          if (currentSelection && currentSelection.type === 'skip') {
            delete selections[cardId]
          } else {
            selections[cardId] = { type: 'skip' }
          }
          saveSelections(selections)
          syncUI()
        }
      })

      statusFilter.addEventListener('change', applyFilters)
      categoryFilter.addEventListener('change', applyFilters)

      exportButton.addEventListener('click', () => {
        const exported = reviewItems
          .filter((item) => selections[item.cardId] && selections[item.cardId].type === 'candidate')
          .map((item) => ({
            cardId: item.cardId,
            source: 'arasaac',
            symbolId: selections[item.cardId].symbolId,
            image: '/symbols/arasaac/cards/' + item.cardId + '.png',
          }))

        const blob = new Blob([JSON.stringify(exported, null, 2) + '\\n'], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'verified-card-symbol-map.json'
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      })

      syncUI()
    </script>
  </body>
</html>
`

await mkdir(reviewDirectory, { recursive: true })
await writeFile(reviewHtmlPath, html)

console.log(`İnceleme sayfası yazıldı: ${reviewHtmlPath}`)
