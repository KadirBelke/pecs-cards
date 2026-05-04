import { useEffect, useRef, useState } from 'react'
import CategoryTabs from './components/CategoryTabs'
import CardGrid from './components/CardGrid'
import SearchBox from './components/SearchBox'
import SentenceBar from './components/SentenceBar'
import { cards } from './data/cards'
import { categories } from './data/categories'
import {
  applyServiceWorkerUpdate,
  subscribeToServiceWorkerUpdate,
} from './pwa'
import type { VisualCard } from './types'

const DEFAULT_CATEGORY_ID = 'tumu'

function App() {
  const [selectedCards, setSelectedCards] = useState<VisualCard[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(DEFAULT_CATEGORY_ID)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [showBackToCategories, setShowBackToCategories] = useState(false)
  const categorySectionRef = useRef<HTMLElement | null>(null)
  const cardGridSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    return subscribeToServiceWorkerUpdate(() => {
      setIsUpdateAvailable(true)
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleScroll = () => {
      const categorySection = categorySectionRef.current
      const cardGridSection = cardGridSectionRef.current

      if (!categorySection || !cardGridSection) {
        setShowBackToCategories(false)
        return
      }

      const categoryBottom =
        categorySection.offsetTop + categorySection.offsetHeight - 80
      const cardGridTop = cardGridSection.offsetTop - 120
      const cardGridBottom =
        cardGridSection.offsetTop + cardGridSection.offsetHeight
      const passedCategorySection = window.scrollY > categoryBottom
      const nearCardGrid =
        window.scrollY >= cardGridTop && window.scrollY <= cardGridBottom

      setShowBackToCategories(passedCategorySection || nearCardGrid)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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

  const scrollToSection = (section: HTMLElement | null) => {
    if (!section) {
      return
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleBackToCategories = () => {
    scrollToSection(categorySectionRef.current)
  }

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)

    window.requestAnimationFrame(() => {
      scrollToSection(cardGridSectionRef.current)
    })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl min-w-0 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <main className="flex min-w-0 flex-1 flex-col pb-72 sm:pb-80 lg:pb-56">
          {isUpdateAvailable ? (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-3xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-slate-900 shadow-sm sm:px-5">
              <p className="font-medium">Yeni sürüm var.</p>
              <button
                type="button"
                className="min-h-11 rounded-2xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                onClick={applyServiceWorkerUpdate}
              >
                Yenile
              </button>
            </div>
          ) : null}

          <header className="rounded-3xl border border-stone-200 bg-white px-5 py-5 shadow-sm sm:px-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Görsel İletişim Kartları
            </h1>
          </header>

          <section
            ref={categorySectionRef}
            className="mt-6 rounded-3xl border border-stone-200 bg-white px-5 py-6 shadow-sm sm:px-6"
          >
            <h2 className="text-lg font-medium text-slate-900">
              Kategori Filtreleri
            </h2>
            <div className="mt-5 flex min-w-0 flex-col gap-5">
              <SearchBox value={searchQuery} onChange={setSearchQuery} />
              <CategoryTabs
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          </section>

          <section
            ref={cardGridSectionRef}
            className="mt-5 rounded-3xl border border-stone-200 bg-white px-5 py-6 shadow-sm sm:px-6"
          >
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

      {showBackToCategories ? (
        <button
          type="button"
          onClick={handleBackToCategories}
          className="fixed bottom-56 right-4 z-40 flex min-h-14 max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition hover:bg-slate-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 sm:bottom-36 sm:right-6"
          aria-label="Kategorilere dön"
        >
          <span className="text-lg leading-none" aria-hidden="true">
            ↑
          </span>
          <span className="sm:hidden">Kategoriler</span>
          <span className="hidden sm:inline">Kategorilere dön</span>
        </button>
      ) : null}
    </div>
  )
}

export default App
