type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor="card-search"
        className="text-sm font-semibold text-slate-700 sm:text-base"
      >
        Kart ara
      </label>
      <p className="text-sm text-slate-500">
        Kart adını yazarak sonuçları hızla daraltın.
      </p>
      <div className="relative">
        <input
          id="card-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Kart ara..."
          className="min-h-14 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 pr-14 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-300"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 flex min-h-10 min-w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-stone-200 text-slate-700 transition hover:bg-stone-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
            aria-label="Aramayı temizle"
          >
            <span className="text-xl leading-none" aria-hidden="true">
              ×
            </span>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default SearchBox
