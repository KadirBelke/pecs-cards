import { cards } from '../data/cards'
import VisualCard from './VisualCard'

function CardGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => (
        <VisualCard key={card.id} card={card} />
      ))}
    </div>
  )
}

export default CardGrid
