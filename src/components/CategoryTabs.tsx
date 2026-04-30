type CategoryTabsProps = {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

const categoryIcons: Record<string, string> = {
  Tümü: '🧩',
  İstekler: '🙋',
  Yiyecek: '🍎',
  Duygular: '😊',
  Eylemler: '▶️',
  Kişiler: '👤',
  Yerler: '🏠',
}

function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-3 sm:gap-4"
      role="tablist"
      aria-label="Kategori filtreleri"
    >
      {categories.map((category) => {
        const isActive = category === selectedCategory
        const icon = categoryIcons[category] ?? '🧩'

        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category)}
            className={`flex min-h-24 min-w-24 flex-col items-center justify-center gap-2 rounded-[1.75rem] px-4 py-4 text-center text-sm font-semibold transition hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:ring-offset-2 sm:min-h-28 sm:min-w-28 sm:px-5 ${
              isActive
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200/70 ring-2 ring-teal-200'
                : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
            }`}
          >
            <span className="text-3xl leading-none sm:text-4xl" aria-hidden="true">
              {icon}
            </span>
            <span className="text-sm leading-tight sm:text-base">{category}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs
