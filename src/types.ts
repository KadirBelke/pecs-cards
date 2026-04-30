export type SymbolItem = {
  label: string
  emoji: string
  image?: string
  imageAlt?: string
  attribution?: string
}

export type VisualCard = SymbolItem & {
  id: string
  category: string
  textToSpeak: string
  arasaacId?: number
  searchTerms?: string[]
}

export type VisualCategory = SymbolItem & {
  id: string
  arasaacId?: number
}
