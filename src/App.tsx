import { useState } from 'react'
import CategoryTabs from './components/CategoryTabs'
import CardGrid from './components/CardGrid'
import SearchBox from './components/SearchBox'
import SentenceBar from './components/SentenceBar'
import { cards } from './data/cards'
import { categories } from './data/categories'
import type { VisualCard } from './types'

const DEFAULT_CATEGORY_ID = 'tumu'

function App() {
  const [selectedCards, setSelectedCards] = useState<VisualCard[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(DEFAULT_CATEGORY_ID)
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase('tr-TR')
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  )

  const filteredCards = cards.filter((card) => {
    const matchesCategory =
      selectedCategoryId === DEFAULT_CATEGORY_ID ||
      card.category === selectedCategory?.label
    const searchableText = [
      card.label,
      card.textToSpeak,
      ...(card.searchTerms ?? []),
    ]
      .join(' ')
      .toLocaleLowerCase('tr-TR')
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      searchableText.includes(normalizedSearchQuery)

    return matchesCategory && matchesSearch
  })

  const handleSelectCard = (card: VisualCard) => {
    setSelectedCards((currentCards) => [...currentCards, card])
  }

  const handleRemoveLastCard = () => {
    setSelectedCards((currentCards) => currentCards.slice(0, -1))
  }

  const handleClearCards = () => {
    setSelectedCards([])
  }

  const handleReadAloud = () => {
    if (typeof window === 'undefined' || selectedCards.length === 0) {
      return
    }

    const spokenText = selectedCards.map((card) => card.textToSpeak).join(' ')
    const utterance = new SpeechSynthesisUtterance(spokenText)
    utterance.lang = 'tr-TR'

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl min-w-0 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <main className="flex min-w-0 flex-1 flex-col pb-72 sm:pb-80 lg:pb-56">
          <header className="rounded-3xl border border-stone-200 bg-white px-5 py-5 shadow-sm sm:px-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Görsel İletişim Kartları
            </h1>
          </header>

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="text-lg font-medium text-slate-900">
              Kategori Filtreleri
            </h2>
            <div className="mt-5 flex min-w-0 flex-col gap-5">
              <SearchBox value={searchQuery} onChange={setSearchQuery} />
              <CategoryTabs
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-stone-200 bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="text-lg font-medium text-slate-900">Kart Alanı</h2>
            <div className="mt-4 min-w-0 rounded-2xl bg-stone-50 p-3 sm:p-4">
              <CardGrid cards={filteredCards} onSelect={handleSelectCard} />
            </div>
          </section>
        </main>
      </div>

      <SentenceBar
        selectedCards={selectedCards}
        onReadAloud={handleReadAloud}
        onRemoveLast={handleRemoveLastCard}
        onClear={handleClearCards}
      />
    </div>
  )
}

export default App
