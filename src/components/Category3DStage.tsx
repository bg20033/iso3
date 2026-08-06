import { lazy, Suspense, useRef, useState } from 'react'
import { Rotate3d } from 'lucide-react'
import { Link } from 'react-router-dom'
import { JacketDiagram } from './JacketDiagram'
import { useCompactLayout, useSceneVisuals } from './useInteractiveVisuals'
import { useVisibleRange } from '../hooks/useVisibleRange'
import { solutionQuickviewPath, type Solution } from '../data/site'
import type { CategoryKind } from './CategoryScene'

const CategoryScene = lazy(() => import('./CategoryScene'))

type Category3DStageProps = {
  solutions: Solution[]
}

/**
 * Eine einzige 3D-Bühne für alle sieben Bauteile. Ein Reiter wechselt das
 * Modell, der Schalter nimmt das Dämmkissen ab. Bewusst nur ein WebGL-Kontext:
 * so bleibt der Auftritt auch auf dem Telefon flüssig.
 */
export function Category3DStage({ solutions }: Category3DStageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const scenes = useSceneVisuals()
  const compact = useCompactLayout()
  const inRange = useVisibleRange(sectionRef, 300)
  const sceneEnabled = scenes && inRange
  const active = solutions[index]

  const toggle = () => {
    const next = !open
    setOpen(next)
    progressRef.current = next ? 1 : 0
  }

  return (
    <section className="section section--metal stage3d" ref={sectionRef}>
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 · Bauteile in 3D</span>
            <h2>Kissen ab, Bauteil sichtbar.</h2>
          </div>
          <p>
            Sieben typische Komponenten, jede mit ihrem massgefertigten
            Dämmkissen. Wählen Sie ein Bauteil und nehmen Sie die Isolierung ab.
          </p>
        </div>

        <div className="stage3d__layout">
          <div className="stage3d__viewport">
            {sceneEnabled ? (
              <Suspense fallback={<JacketDiagram />}>
                <CategoryScene
                  key={active.slug}
                  kind={active.slug as CategoryKind}
                  progressRef={progressRef}
                />
              </Suspense>
            ) : (
              <JacketDiagram />
            )}
            {sceneEnabled ? (
              <span className="stage3d__hint">
                <Rotate3d size={14} aria-hidden="true" />
                {compact ? 'Ziehen dreht' : 'Ziehen dreht das Bauteil'}
              </span>
            ) : null}
          </div>

          <div className="stage3d__panel">
            <ol className="stage3d__tabs">
              {solutions.map((solution, position) => (
                <li key={solution.slug}>
                  <button
                    className="stage3d__tab"
                    type="button"
                    aria-pressed={position === index}
                    onClick={() => setIndex(position)}
                  >
                    <span className="stage3d__tab-no">{solution.no}</span>
                    {solution.shortTitle}
                  </button>
                </li>
              ))}
            </ol>

            <div className="stage3d__detail">
              <h3>{active.title}</h3>
              <p>{active.summary}</p>

              <div className="stage3d__actions">
                <button
                  className="button button--compact"
                  type="button"
                  aria-pressed={open}
                  onClick={toggle}
                >
                  {open ? 'Kissen anlegen' : 'Kissen abnehmen'}
                </button>
                <Link className="text-link" to={solutionQuickviewPath(active)}>
                  Aufnahmen ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
