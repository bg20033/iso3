import { lazy, Suspense, useRef, useState } from 'react'
import { Rotate3d } from 'lucide-react'
import { CategoryFocus } from './CategoryFocus'
import { JacketDiagram } from './JacketDiagram'
import { railAnchor } from './categoryAnchors'
import { useCompactLayout, useSceneVisuals } from './useInteractiveVisuals'
import { useVisibleRange } from '../hooks/useVisibleRange'
import type { Solution } from '../data/site'
import type { CategoryKind } from './CategoryScene'

const CategoryScene = lazy(() => import('./CategoryScene'))

type CategoryBuildupProps = {
  solution: Solution
  onSelect: (solution: Solution) => void
}

/**
 * Eine Kategorie auf einer Seite: das Bauteil in 3D, ein Schalter der das
 * Dämmkissen abnimmt, und die reale Aufnahme dazu.
 */
export function CategoryBuildup({ solution, onSelect }: CategoryBuildupProps) {
  const panelRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const [open, setOpen] = useState(false)
  const scenes = useSceneVisuals()
  const compact = useCompactLayout()
  // Nur sichtbare Bauteile halten eine 3D-Bühne, sonst laufen sieben
  // WebGL-Kontexte gleichzeitig.
  const inRange = useVisibleRange(panelRef, 300)
  const sceneEnabled = scenes && inRange

  const toggle = () => {
    const next = !open
    setOpen(next)
    progressRef.current = next ? 1 : 0
  }

  return (
    <article className="panel" id={railAnchor(solution)} ref={panelRef}>
      <header className="panel__head">
        <span className="eyebrow">
          {solution.no} · {solution.eyebrow}
        </span>
        <h2>{solution.title}</h2>
        <p>{solution.summary}</p>
      </header>

      <div className="panel__stage">
        {sceneEnabled ? (
          <Suspense fallback={<JacketDiagram />}>
            <CategoryScene
              kind={solution.slug as CategoryKind}
              progressRef={progressRef}
            />
          </Suspense>
        ) : (
          <JacketDiagram />
        )}

        {sceneEnabled ? (
          <span className="panel__hint">
            <Rotate3d size={13} aria-hidden="true" />
            {compact ? 'Ziehen dreht' : 'Ziehen dreht das Bauteil'}
          </span>
        ) : null}
      </div>

      <div className="panel__toggle">
        <button
          className="button button--compact"
          type="button"
          aria-pressed={open}
          onClick={toggle}
        >
          {open ? 'Kissen anlegen' : 'Kissen abnehmen'}
        </button>
      </div>

      <CategoryFocus solution={solution} onSelect={onSelect} />
    </article>
  )
}
