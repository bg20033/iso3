import {
  useCallback,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { MoveHorizontal } from 'lucide-react'

type ComparisonImage = {
  src: string
  thumb: string
  alt: string
  width?: number
  height?: number
}

type BeforeAfterSliderProps = {
  before: ComparisonImage
  after: ComparisonImage
  /** Karten-Variante fürs Vergleichsband: kurze Marken, keine Fusszeile. */
  compact?: boolean
  /** Nur der Vergleich über dem Falz soll bevorzugt geladen werden. */
  priority?: boolean
  /** Ergänzt die Vorlesebezeichnung, wenn mehrere Vergleiche nebeneinander stehen. */
  name?: string
  sizes?: string
}

const STEP = 5

export function BeforeAfterSlider({
  before,
  after,
  compact = false,
  priority = !compact,
  name,
  sizes,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const imageSizes =
    sizes ?? (compact ? '(max-width: 620px) 84vw, 34vw' : '(max-width: 900px) calc(100vw - 2rem), 52vw')
  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority = priority ? 'high' : 'auto'
  const sliderLabel = name
    ? `Vergleich zwischen Vorher und Nachher – ${name}`
    : 'Vergleich zwischen Vorher und Nachher'

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    let nextPosition: number | undefined

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        nextPosition = Math.max(0, Number(event.currentTarget.value) - STEP)
        break
      case 'ArrowRight':
      case 'ArrowUp':
        nextPosition = Math.min(100, Number(event.currentTarget.value) + STEP)
        break
      case 'Home':
        nextPosition = 0
        break
      case 'End':
        nextPosition = 100
        break
      default:
        return
    }

    event.preventDefault()
    setPosition(nextPosition)
  }, [])

  return (
    <figure
      className={`before-after${compact ? ' before-after--compact' : ''}`}
      style={{ '--comparison-position': `${position}%` } as CSSProperties}
    >
      <picture className="before-after__image before-after__image--before">
        <source
          srcSet={`${before.thumb} 640w, ${before.src} 1280w`}
          sizes={imageSizes}
        />
        <img
          src={before.thumb}
          alt={before.alt}
          width={before.width ?? 1280}
          height={before.height ?? 1714}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
        />
      </picture>

      <div className="before-after__after" aria-hidden="true">
        <picture className="before-after__image">
          <source
            srcSet={`${after.thumb} 640w, ${after.src} 1280w`}
            sizes={imageSizes}
          />
          <img
            src={after.thumb}
            alt=""
            width={after.width ?? 1280}
            height={after.height ?? 1714}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
          />
        </picture>
      </div>

      <span className="before-after__label before-after__label--before">
        {compact ? 'Vorher' : 'Vorher · ungedämmt'}
      </span>
      <span className="before-after__label before-after__label--after">
        {compact ? 'Nachher' : 'Nachher · IsoMat-Dämmkissen'}
      </span>

      <span className="before-after__divider" aria-hidden="true">
        <span className="before-after__handle">
          <MoveHorizontal />
        </span>
      </span>

      <input
        className="before-after__range"
        type="range"
        min="0"
        max="100"
        step="1"
        value={position}
        aria-label={sliderLabel}
        aria-valuetext={`${position} Prozent Vorher, ${100 - position} Prozent Nachher`}
        onChange={(event) => setPosition(Number(event.currentTarget.value))}
        onKeyDown={handleKeyDown}
      />

      {!compact && (
        <figcaption>
          <MoveHorizontal aria-hidden="true" />
          Ziehen, um die Ausführung zu vergleichen
        </figcaption>
      )}
    </figure>
  )
}
