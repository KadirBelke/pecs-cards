function App() {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-stone-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Görsel İletişim Kartları
          </h1>
        </header>

        <main className="mt-6 flex flex-1 flex-col gap-4">
          <section className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="text-lg font-medium text-slate-900">
              Kategori Filtreleri
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Kategori filtreleri bu alanda yer alacak.
            </p>
          </section>

          <section className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="text-lg font-medium text-slate-900">Kart Alanı</h2>
            <div className="mt-3 grid min-h-64 place-items-center rounded-2xl bg-stone-50 p-6 text-center text-sm text-slate-600">
              Kart ızgarası bu alanda görünecek.
            </div>
          </section>

          <section className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="text-lg font-medium text-slate-900">Cümle Çubuğu</h2>
            <p className="mt-2 text-sm text-slate-600">
              Seçilen kartlardan oluşturulan cümle çubuğu bu alanda yer alacak.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
