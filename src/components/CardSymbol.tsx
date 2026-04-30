import { useState } from 'react'
import type { SymbolItem } from '../types'

type CardSymbolProps = {
  symbol: SymbolItem
  imageClassName: string
  emojiClassName: string
  decorative?: boolean
}

function CardSymbol({
  symbol,
  imageClassName,
  emojiClassName,
  decorative = false,
}: CardSymbolProps) {
  const [imageFailed, setImageFailed] = useState(false)

  if (symbol.image && !imageFailed) {
    return (
      <img
        src={symbol.image}
        alt={decorative ? '' : symbol.imageAlt ?? `${symbol.label} görseli`}
        className={imageClassName}
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <span className={emojiClassName} aria-hidden="true">
      {symbol.emoji}
    </span>
  )
}

export default CardSymbol
