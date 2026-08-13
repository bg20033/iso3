import { lazy, Suspense, useRef, useState } from 'react'
import { ArrowUpRight, Layers, RotateCcw, RotateCw, Undo2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productPath, type Solution } from '../data/site'
import { useVisibleRange } from '../hooks/useVisibleRange'
import { ResponsiveImage } from './ResponsiveImage'
import { useSceneVisuals } from './useInteractiveVisuals'
import type {
  CategoryKind,
  CategorySceneControl,
} from './CategoryScene'
import { useLanguage } from '../i18n'

const CategoryScene = lazy(() => import('./CategoryScene'))

type Category3DExplorerProps = {
  mode: 'hub' | 'single'
  solutions: Solution[]
  initialSolution?: Solution
  label?: string
  onCategoryChange?: (solution: Solution) => void
}

export function Category3DExplorer({
  mode,
  solutions,
  initialSolution,
  label,
  onCategoryChange,
}: Category3DExplorerProps) {
  const { pick } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const controlRef = useRef<CategorySceneControl['current']>({
    turn: 0,
    reset: 0,
  })
  const [activeSlug, setActiveSlug] = useState(
    initialSolution?.slug ?? solutions[0]?.slug,
  )
  const [open, setOpen] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const sceneStatusRef = useRef<(ready: boolean) => void>((ready) => {
    setSceneReady(ready)
  })
  const scenes = useSceneVisuals()
  const inRange = useVisibleRange(sectionRef, 320)
  const active =
    solutions.find((solution) => solution.slug === activeSlug) ?? solutions[0]

  if (!active) return null

  const select = (solution: Solution) => {
    setActiveSlug(solution.slug)
    setOpen(false)
    setSceneReady(false)
    progressRef.current = 0
    controlRef.current = { turn: 0, reset: controlRef.current.reset + 1 }
    onCategoryChange?.(solution)
  }

  const toggleOpen = () => {
    const next = !open
    setOpen(next)
    progressRef.current = next ? 1 : 0
  }

  const rotate = (direction: -1 | 1) => {
    controlRef.current.turn += direction * (Math.PI / 5)
  }

  const reset = () => {
    controlRef.current = { turn: 0, reset: controlRef.current.reset + 1 }
  }

  const sceneEnabled = scenes && inRange

  return (
    <div
      className={`model-explorer model-explorer--${mode}`}
      ref={sectionRef}
      aria-label={label ?? pick('Interaktiver 3D-Explorer der IsoMat-Lösungen', 'Interactive 3D explorer for IsoMat solutions')}
    >
      {mode === 'hub' ? (
        <div className="model-explorer__selector" role="tablist" aria-label={pick('Bauteilkategorie wählen', 'Choose a component category')}>
          {solutions.map((solution) => (
            <button
              key={solution.slug}
              type="button"
              role="tab"
              aria-selected={solution.slug === active.slug}
              className="model-explorer__tab"
              onClick={() => select(solution)}
            >
              <span>{solution.no}</span>
              <strong>{solution.shortTitle}</strong>
            </button>
          ))}
        </div>
      ) : null}

      <div className="model-explorer__body">
        <div className="model-explorer__viewport">
          <ResponsiveImage
            image={active.featuredImage}
            className={`model-explorer__fallback${sceneReady ? ' is-hidden' : ''}`}
          />
          {sceneEnabled ? (
            <Suspense fallback={null}>
              <CategoryScene
                key={active.slug}
                kind={active.slug as CategoryKind}
                progressRef={progressRef}
                controlRef={controlRef}
                statusRef={sceneStatusRef}
              />
            </Suspense>
          ) : null}

          <div className="model-explorer__status" aria-live="polite">
            <span>{active.no}</span>
            {open ? pick('Dämmkissen abgenommen', 'Insulation removed') : pick('Dämmkissen angelegt', 'Insulation fitted')}
          </div>

          <div className="model-explorer__controls" aria-label={pick('3D-Modell steuern', 'Control 3D model')}>
            <button
              className="model-explorer__toggle"
              type="button"
              aria-pressed={open}
              onClick={toggleOpen}
            >
              <Layers aria-hidden="true" />
              {open ? pick('Kissen anlegen', 'Fit jacket') : pick('Kissen abnehmen', 'Remove jacket')}
            </button>
            <button type="button" onClick={() => rotate(-1)} aria-label={pick('Modell nach links drehen', 'Rotate model left')}>
              <Undo2 aria-hidden="true" />
            </button>
            <button type="button" onClick={reset} aria-label={pick('Ansicht zurücksetzen', 'Reset view')}>
              <RotateCcw aria-hidden="true" />
            </button>
            <button type="button" onClick={() => rotate(1)} aria-label={pick('Modell nach rechts drehen', 'Rotate model right')}>
              <RotateCw aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="model-explorer__content">
          <span className="eyebrow">{active.no} · {active.eyebrow}</span>
          <h3>{active.title}</h3>
          <p>{active.summary}</p>

          <ul className="model-explorer__applications" aria-label={pick('Typische Anwendungen', 'Typical applications')}>
            {active.applications.slice(0, 4).map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>

          <div className="model-explorer__actions">
            {mode === 'hub' ? (
              <Link className="text-link" to={productPath(active)}>
                {pick('Details & Referenzen', 'Details & references')} <ArrowUpRight aria-hidden="true" />
              </Link>
            ) : (
              <Link
                className="text-link"
                to={`/kontakt?application=${encodeURIComponent(active.title)}`}
              >
                {pick('Projekt anfragen', 'Request a project')} <ArrowUpRight aria-hidden="true" />
              </Link>
            )}
          </div>

          <p className="model-explorer__note">
            {pick('Technische Visualisierung · Ziehen dreht das Modell · Kissen abnehmen zeigt das Bauteil darunter', 'Technical visualisation · Drag to rotate · Remove the jacket to reveal the component')}
          </p>
        </div>
      </div>
    </div>
  )
}
