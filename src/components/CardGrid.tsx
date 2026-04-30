import type { VisualCard as VisualCardType } from '../types'
import VisualCard from './VisualCard'

type CardGridProps = {
  cards: VisualCardType[]
  onSelect: (card: VisualCardType) => void
}

function CardGrid({ cards, onSelect }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 py-10 text-center">
        <p className="max-w-sm text-base font-medium text-slate-600">
          Aradığınız kritere uygun kart bulunamadı.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => (
        <VisualCard key={card.id} card={card} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default CardGrid
