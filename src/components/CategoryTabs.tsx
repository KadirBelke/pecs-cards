import type { VisualCategory } from '../types'
import CardSymbol from './CardSymbol'

type CategoryTabsProps = {
  categories: VisualCategory[]
  selectedCategoryId: string
  onSelectCategory: (categoryId: string) => void
}

function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-3 sm:gap-4"
      role="tablist"
      aria-label="Kategori filtreleri"
    >
      {categories.map((category) => {
        const isActive = category.id === selectedCategoryId

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category.id)}
            className={`flex min-h-24 min-w-24 flex-col items-center justify-center gap-2 rounded-[1.75rem] px-4 py-4 text-center text-sm font-semibold transition hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:ring-offset-2 sm:min-h-28 sm:min-w-28 sm:px-5 ${
              isActive
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200/70 ring-2 ring-teal-200'
                : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
            }`}
          >
            <CardSymbol
              symbol={category}
              imageClassName="h-12 w-12 object-contain sm:h-14 sm:w-14"
              emojiClassName="text-3xl leading-none sm:text-4xl"
              decorative
            />
            <span className="text-sm leading-tight sm:text-base">
              {category.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs
