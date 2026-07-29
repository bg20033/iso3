import { lazy, Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { productPath, type Solution } from '../data/site'
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
  const items = useMemo(
    () =>
      solutions.map((solution) => ({
        image: solution.featuredImage.thumb,
        text: solution.shortTitle,
      })),
    [solutions],
  )

  const staticGallery = (
    <div className="static-solution-gallery">
      {solutions.map((solution) => (
        <Link
          className="static-solution-card"
          to={productPath(solution)}
          key={solution.slug}
        >
          <ResponsiveImage image={solution.featuredImage} />
          <span>{solution.no}</span>
          <h3>{solution.shortTitle}</h3>
        </Link>
      ))}
    </div>
  )

  if (!interactive) {
    return staticGallery
  }

  return (
    <div className="reactbits-circular-block">
      <div className="reactbits-circular-shell">
        <Suspense fallback={staticGallery}>
          <CircularGallery
            items={items}
            bend={bend}
            textColor="#0e1112"
            borderRadius={0.035}
            font="700 30px Arial"
            scrollSpeed={1.7}
            scrollEase={0.055}
          />
        </Suspense>
      </div>
      <nav className="reactbits-gallery-links" aria-label="Lösungen auswählen">
        {solutions.map((solution) => (
          <Link to={productPath(solution)} key={solution.slug}>
            <span>{solution.no}</span>
            {solution.shortTitle}
          </Link>
        ))}
      </nav>
    </div>
  )
}
