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
}

type BeforeAfterSliderProps = {
  before: ComparisonImage
  after: ComparisonImage
}

const STEP = 5

export function BeforeAfterSlider({
  before,
  after,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)

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
      className="before-after"
      style={{ '--comparison-position': `${position}%` } as CSSProperties}
    >
      <picture className="before-after__image before-after__image--before">
        <source srcSet={`${before.thumb} 640w, ${before.src} 1280w`} />
        <img
          src={before.src}
          alt={before.alt}
          width="1280"
          height="1714"
          loading="lazy"
          decoding="async"
        />
      </picture>

      <div className="before-after__after" aria-hidden="true">
        <picture className="before-after__image">
          <source srcSet={`${after.thumb} 640w, ${after.src} 1280w`} />
          <img
            src={after.src}
            alt=""
            width="1280"
            height="1714"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      <span className="before-after__label before-after__label--before">
        Vorher · ungedämmt
      </span>
      <span className="before-after__label before-after__label--after">
        Nachher · IsoMat-Dämmkissen
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
        aria-label="Vergleich zwischen Vorher und Nachher"
        aria-valuetext={`${position} Prozent Vorher, ${100 - position} Prozent Nachher`}
        onChange={(event) => setPosition(Number(event.currentTarget.value))}
        onKeyDown={handleKeyDown}
      />

      <figcaption>
        <MoveHorizontal aria-hidden="true" />
        Ziehen, um die Ausführung zu vergleichen
      </figcaption>
    </figure>
  )
}
