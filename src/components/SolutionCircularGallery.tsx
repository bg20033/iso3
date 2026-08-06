import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { solutionQuickviewPath, type Solution } from '../data/site'
import { ResponsiveImage } from './ResponsiveImage'
import { useNearViewport } from '../hooks/useNearViewport'
import {
  useCompactLayout,
  useReducedMotion,
  useWebGLSupport,
} from './useInteractiveVisuals'

/*
 * Auf dem Telefon ist der Bildausschnitt schmal, die Karten haben aber überall
 * dieselbe Weltgrösse. Ohne Korrektur füllt eine Karte dort fast die ganze
 * Breite und kippt am Rand doppelt so stark wie am Desktop.
 */
const COMPACT_CARD_SCALE = 0.62
// Grösserer Wert = engerer Bogen = stärkere Neigung am Rand.
// 1.6 ergibt rund 26 Grad – etwas mehr Rundung als am Desktop (22), weit weg
// von den 53 Grad, mit denen die Galerie vorher aus dem Bild kippte.
const COMPACT_BEND = 1.6

const CircularGallery = lazy(() => import('./CircularGallery'))

type SolutionCircularGalleryProps = {
  solutions: Solution[]
  bend?: number
}

export function SolutionCircularGallery({
  solutions,
  bend = 3,
}: SolutionCircularGalleryProps) {
  // Läuft jetzt auch auf Touchgeräten – die Galerie hört ihre Eingaben am
  // eigenen Container ab und stört das Scrollen der Seite nicht mehr.
  // Reduzierte Bewegung heisst «nichts bewegt sich von selbst», nicht «die
  // Galerie verschwindet». Sie läuft weiter, nur ohne Eigenleben: kein Wellen-
  // effekt und kein Nachlauf beim Ziehen.
  const blockRef = useRef<HTMLDivElement>(null)
  const webgl = useWebGLSupport()
  const reducedMotion = useReducedMotion()
  const compact = useCompactLayout()
  const nearby = useNearViewport(blockRef, 600)
  const interactive = webgl && nearby
  const [ready, setReady] = useState(false)
  const items = useMemo(
    () =>
      solutions.map((solution) => ({
        image: solution.featuredImage.thumb,
        text: solution.shortTitle,
      })),
    [solutions],
  )
  const markReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!interactive) setReady(false)
  }, [interactive])

  const staticGallery = (
    <div className="static-solution-gallery">
      {solutions.map((solution) => (
        <Link
          className="static-solution-card"
          to={solutionQuickviewPath(solution)}
          key={solution.slug}
        >
          <ResponsiveImage image={solution.featuredImage} />
          <span>{solution.no}</span>
          <strong>{solution.shortTitle}</strong>
        </Link>
      ))}
    </div>
  )

  return (
    <div className="reactbits-circular-block" ref={blockRef}>
      <div className="reactbits-circular-shell">
        <div className={`gallery-swap${ready ? ' is-ready' : ''}`}>
          <div
            className="gallery-swap__fallback"
            aria-hidden={ready}
            inert={ready}
          >
            {staticGallery}
          </div>
          {interactive && (
            <div
              className="gallery-swap__interactive"
              aria-hidden={!ready}
              inert={!ready}
            >
              <Suspense fallback={null}>
                <CircularGallery
                  items={items}
                  bend={compact ? COMPACT_BEND : bend}
                  cardScale={compact ? COMPACT_CARD_SCALE : 1}
                  textColor="#0e1112"
                  borderRadius={0.035}
                  font="700 30px Arial"
                  scrollSpeed={1.7}
                  scrollEase={0.055}
                  reducedMotion={reducedMotion}
                  onReady={markReady}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
      <nav className="reactbits-gallery-links" aria-label="Lösungen auswählen">
        {solutions.map((solution) => (
          <Link to={solutionQuickviewPath(solution)} key={solution.slug}>
            <span>{solution.no}</span>
            {solution.shortTitle}
          </Link>
        ))}
      </nav>
    </div>
  )
}
