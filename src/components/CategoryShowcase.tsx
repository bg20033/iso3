import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { ArrowUpRight } from 'lucide-react'
import { ResponsiveImage } from './ResponsiveImage'
import { useInteractiveVisuals } from './useInteractiveVisuals'
import type { Solution } from '../data/site'

type CategoryShowcaseProps = {
  solutions: Solution[]
  onSelect: (solution: Solution) => void
}

type CategoryCardProps = {
  solution: Solution
  tilt: boolean
  onSelect: (solution: Solution) => void
}

/** Wie weit die Karte unter dem Zeiger kippt – in Grad. */
const TILT = 6

function CategoryCard({ solution, tilt, onSelect }: CategoryCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null)

  const setTilt = useCallback((x: number, y: number) => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--tilt-x', `${x.toFixed(2)}deg`)
    card.style.setProperty('--tilt-y', `${y.toFixed(2)}deg`)
  }, [])

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!tilt) return
      const rect = event.currentTarget.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      setTilt(-py * TILT * 2, px * TILT * 2)
    },
    [setTilt, tilt],
  )

  const handleLeave = useCallback(() => setTilt(0, 0), [setTilt])

  return (
    <button
      className="category-card"
      type="button"
      ref={cardRef}
      aria-haspopup="dialog"
      aria-label={`${solution.title} öffnen`}
      onClick={() => onSelect(solution)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handleLeave}
      onBlur={handleLeave}
    >
      <span className="category-card__stage">
        <ResponsiveImage
          image={solution.featuredImage}
          className="category-card__photo"
        />
        <span className="category-card__no">{solution.no}</span>
      </span>

      <span className="category-card__body">
        <span className="category-card__title">{solution.title}</span>
        <span className="category-card__eyebrow">{solution.eyebrow}</span>
        <span className="category-card__meta">
          <span>{solution.gallery.length} Aufnahmen</span>
          <ArrowUpRight className="category-card__arrow" aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}

/**
 * Alle sieben Kategorien als Bildkacheln. Ein Klick öffnet die Aufnahmen der
 * jeweiligen Kategorie; die 3D-Ansichten stehen weiter unten auf der Seite.
 */
export function CategoryShowcase({
  solutions,
  onSelect,
}: CategoryShowcaseProps) {
  const tilt = useInteractiveVisuals()

  return (
    <div className="category-grid">
      {solutions.map((solution) => (
        <CategoryCard
          key={solution.slug}
          solution={solution}
          tilt={tilt}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
