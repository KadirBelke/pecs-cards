import type { VisualCard as VisualCardType } from '../types'
import { cards } from '../data/cards'
import VisualCard from './VisualCard'

type CardGridProps = {
  onSelect: (card: VisualCardType) => void
}

function CardGrid({ onSelect }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => (
        <VisualCard key={card.id} card={card} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default CardGrid
