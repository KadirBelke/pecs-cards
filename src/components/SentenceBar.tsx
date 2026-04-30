import type { VisualCard } from '../types'
import CardSymbol from './CardSymbol'

type SentenceBarProps = {
  selectedCards: VisualCard[]
  onReadAloud: () => void
  onRemoveLast: () => void
  onClear: () => void
}

function SentenceBar({
  selectedCards,
  onReadAloud,
  onRemoveLast,
  onClear,
}: SentenceBarProps) {
  const isEmpty = selectedCards.length === 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200 bg-stone-100/95 px-3 pb-2 pt-2 backdrop-blur sm:px-4 sm:pb-4 sm:pt-3">
      <section className="mx-auto max-h-[38vh] w-full max-w-screen-md min-w-0 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white p-3 shadow-lg shadow-stone-200/60 sm:max-h-none sm:rounded-[2rem] sm:p-5 lg:max-w-5xl lg:p-4">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Cümle Çubuğu
              </h2>
            </div>
            <div className="grid w-full min-w-0 grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3 lg:min-w-[26rem] lg:flex-1">
              <button
                type="button"
                onClick={onReadAloud}
                disabled={isEmpty}
                className="min-h-11 min-w-0 rounded-2xl bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-teal-200 disabled:text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:ring-offset-2 sm:min-h-14 sm:px-4 sm:py-3 sm:text-base"
              >
                Oku
              </button>
              <button
                type="button"
                onClick={onRemoveLast}
                disabled={isEmpty}
                className="min-h-11 min-w-0 rounded-2xl bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-amber-200 disabled:text-amber-900/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:ring-offset-2 sm:min-h-14 sm:px-4 sm:py-3 sm:text-base"
              >
                <span>Sil</span>
              </button>
              <button
                type="button"
                onClick={onClear}
                disabled={isEmpty}
                className="min-h-11 min-w-0 rounded-2xl bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:min-h-14 sm:px-4 sm:py-3 sm:text-base"
              >
                Temizle
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-600 sm:mt-1 sm:text-sm">
              Seçtiğiniz kartlar burada sırayla görünür.
            </p>
          </div>

          <div className="min-h-20 w-full min-w-0 overflow-x-auto rounded-3xl bg-stone-50 p-2.5 sm:min-h-24 sm:p-4 lg:min-h-20">
            {isEmpty ? (
              <p className="text-sm font-medium text-slate-500 sm:text-base">
                Kartlara dokunarak cümle oluşturun.
              </p>
            ) : (
              <div className="flex min-w-max gap-2.5 sm:min-w-0 sm:flex-wrap sm:gap-3">
                {selectedCards.map((card, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="flex min-h-12 shrink-0 items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-stone-200 sm:min-h-14 sm:gap-3 sm:px-4 sm:py-3"
                  >
                    <CardSymbol
                      symbol={card}
                      imageClassName="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
                      emojiClassName="text-2xl leading-none sm:text-3xl"
                      decorative
                    />
                    <span className="text-sm font-medium text-slate-900 sm:text-base">
                      {card.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SentenceBar
