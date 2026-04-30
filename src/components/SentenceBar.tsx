import type { VisualCard } from '../types'

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
    <div className="sticky bottom-0 z-20 mt-6 border-t border-stone-200 bg-stone-100/95 pb-4 pt-3 backdrop-blur lg:pb-4">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg shadow-stone-200/60 sm:p-5 lg:p-4">
        <div className="flex flex-col gap-4 lg:gap-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Cümle Çubuğu
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[26rem] lg:flex-1">
              <button
                type="button"
                onClick={onReadAloud}
                disabled={isEmpty}
                className="min-h-14 rounded-2xl bg-teal-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-teal-200 disabled:text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:ring-offset-2"
              >
                Oku
              </button>
              <button
                type="button"
                onClick={onRemoveLast}
                disabled={isEmpty}
                className="min-h-14 rounded-2xl bg-amber-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-amber-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-amber-200 disabled:text-amber-900/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
              >
                Son Kartı Sil
              </button>
              <button
                type="button"
                onClick={onClear}
                disabled={isEmpty}
                className="min-h-14 rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              >
                Temizle
              </button>
            </div>
          </div>

          <div>
            <p className="mt-1 text-sm text-slate-600">
              Seçtiğiniz kartlar burada sırayla görünür.
            </p>
          </div>

          <div className="min-h-24 rounded-3xl bg-stone-50 p-3.5 sm:p-4 lg:min-h-20">
            {isEmpty ? (
              <p className="text-sm font-medium text-slate-500 sm:text-base">
                Kartlara dokunarak cümle oluşturun.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {selectedCards.map((card, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="flex min-h-14 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-stone-200"
                  >
                    <span className="text-3xl leading-none" aria-hidden="true">
                      {card.emoji}
                    </span>
                    <span className="text-base font-medium text-slate-900">
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
