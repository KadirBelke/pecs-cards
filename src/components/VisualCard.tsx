import type { VisualCard as VisualCardType } from '../types'

type VisualCardProps = {
  card: VisualCardType
  onSelect: (card: VisualCardType) => void
}

function VisualCard({ card, onSelect }: VisualCardProps) {
  return (
    <button
      type="button"
      className="flex min-h-44 w-full flex-col items-center justify-center rounded-[2rem] border border-stone-200 bg-white px-4 py-5 text-center shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 sm:min-h-48"
      aria-label={card.textToSpeak}
      onClick={() => onSelect(card)}
    >
      <span className="text-5xl leading-none sm:text-6xl" aria-hidden="true">
        {card.emoji}
      </span>
      <span className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
        {card.label}
      </span>
    </button>
  )
}

export default VisualCard
