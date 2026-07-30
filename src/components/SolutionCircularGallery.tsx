import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { solutionQuickviewPath, type Solution } from '../data/site'
import { ResponsiveImage } from './ResponsiveImage'
import { useInteractiveVisuals } from './useInteractiveVisuals'

const CircularGallery = lazy(() => import('./CircularGallery'))

type SolutionCircularGalleryProps = {
  solutions: Solution[]
  bend?: number
}

export function SolutionCircularGallery({
  solutions,
  bend = 3,
}: SolutionCircularGalleryProps) {
  const interactive = useInteractiveVisuals()
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
          <h3>{solution.shortTitle}</h3>
        </Link>
      ))}
    </div>
  )

  return (
    <div className="reactbits-circular-block">
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
                  bend={bend}
                  textColor="#0e1112"
                  borderRadius={0.035}
                  font="700 30px Arial"
                  scrollSpeed={1.7}
                  scrollEase={0.055}
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
