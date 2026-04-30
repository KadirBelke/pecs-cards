import { useState } from 'react'
import CardGrid from './components/CardGrid'
import SentenceBar from './components/SentenceBar'
import type { VisualCard } from './types'

function App() {
  const [selectedCards, setSelectedCards] = useState<VisualCard[]>([])

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
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-stone-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Görsel İletişim Kartları
          </h1>
        </header>

        <main className="mt-6 flex flex-1 flex-col gap-4 pb-64 sm:pb-72 lg:pb-52">
          <section className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="text-lg font-medium text-slate-900">
              Kategori Filtreleri
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Kategori filtreleri bu alanda yer alacak.
            </p>
          </section>

          <section className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="text-lg font-medium text-slate-900">Kart Alanı</h2>
            <div className="mt-3 rounded-2xl bg-stone-50 p-3 sm:p-4">
              <CardGrid onSelect={handleSelectCard} />
            </div>
          </section>
        </main>

        <SentenceBar
          selectedCards={selectedCards}
          onReadAloud={handleReadAloud}
          onRemoveLast={handleRemoveLastCard}
          onClear={handleClearCards}
        />
      </div>
    </div>
  )
}

export default App
