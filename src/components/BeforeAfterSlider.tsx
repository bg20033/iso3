import {
  useCallback,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { MoveHorizontal } from 'lucide-react'
import { useLanguage } from '../i18n'

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
  const { pick } = useLanguage()
  const [position, setPosition] = useState(50)
  const imageSizes =
    sizes ?? (compact ? '(max-width: 620px) 84vw, 34vw' : '(max-width: 900px) calc(100vw - 2rem), 52vw')
  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority = priority ? 'high' : 'auto'
  const sliderLabel = name
    ? `${pick('Vergleich zwischen Vorher und Nachher', 'Before and after comparison')} – ${name}`
    : pick('Vergleich zwischen Vorher und Nachher', 'Before and after comparison')

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (
      ![
        'ArrowLeft',
        'ArrowDown',
        'ArrowRight',
        'ArrowUp',
        'Home',
        'End',
      ].includes(event.key)
    ) {
      return
    }

    event.preventDefault()
    setPosition((current) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          return Math.max(0, current - STEP)
        case 'ArrowRight':
        case 'ArrowUp':
          return Math.min(100, current + STEP)
        case 'Home':
          return 0
        case 'End':
          return 100
        default:
          return current
      }
    })
  }, [])

  const updateFromPointer = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width <= 0) return
    const nextPosition = ((event.clientX - bounds.left) / bounds.width) * 100
    setPosition(Math.round(Math.min(100, Math.max(0, nextPosition))))
  }, [])

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.focus()
      event.currentTarget.setPointerCapture(event.pointerId)
      updateFromPointer(event)
    },
    [updateFromPointer],
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        updateFromPointer(event)
      }
    },
    [updateFromPointer],
  )

  const handlePointerEnd = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      updateFromPointer(event)
      event.currentTarget.releasePointerCapture(event.pointerId)
    },
    [updateFromPointer],
  )

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    [],
  )

  /*
   * Hoch- und Querformate liegen gemischt im Archiv. Ohne das eigene
   * Seitenverhältnis schneidet ein fixer Kartenrahmen das Bauteil weg.
   */
  const aspect =
    before.width && before.height ? `${before.width} / ${before.height}` : undefined

  return (
    <figure
      className={`before-after${compact ? ' before-after--compact' : ''}`}
      style={
        {
          '--comparison-position': `${position}%`,
          ...(aspect ? { '--comparison-aspect': aspect } : {}),
        } as CSSProperties
      }
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
        {compact ? pick('Vorher', 'Before') : pick('Vorher · ungedämmt', 'Before · uninsulated')}
      </span>
      <span className="before-after__label before-after__label--after">
        {compact ? pick('Nachher', 'After') : pick('Nachher · IsoMat-Dämmkissen', 'After · IsoMat jacket')}
      </span>

      <span className="before-after__divider" aria-hidden="true">
        <span className="before-after__handle">
          <MoveHorizontal />
        </span>
      </span>

      {/*
       * Kein natives <input type="range">: Edge blendet darüber den
       * systemeigenen Tooltip „Neue Verknüpfung“ ein. Die semantische
       * Slider-Rolle und die vollständige Tastaturbedienung bleiben erhalten.
       */}
      <div
        className="before-after__range"
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={position}
        aria-label={sliderLabel}
        aria-valuetext={`${position} ${pick('Prozent Vorher', 'percent before')}, ${100 - position} ${pick('Prozent Nachher', 'percent after')}`}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerCancel}
      />

      {!compact && (
        <figcaption>
          <MoveHorizontal aria-hidden="true" />
          {pick('Ziehen, um die Ausführung zu vergleichen', 'Drag to compare the installation')}
        </figcaption>
      )}
    </figure>
  )
}
