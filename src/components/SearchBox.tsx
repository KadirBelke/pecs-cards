type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <label className="block">
      <span className="sr-only">Kart ara</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Kart ara..."
        className="min-h-14 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-300"
      />
    </label>
  )
}

export default SearchBox
