import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Solution } from '../data/site'
import { ResponsiveImage } from './ResponsiveImage'

export function CircularGallery({
  solutions,
  bend = 3,
}: {
  solutions: Solution[]
  bend?: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const onWheel = (event: React.WheelEvent) => {
    if (!trackRef.current || Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
      return
    }
    trackRef.current.scrollLeft += event.deltaY
  }

  const midpoint = (solutions.length - 1) / 2

  return (
    <div className="circular-gallery" onWheel={onWheel}>
      <div className="circular-gallery__track" ref={trackRef}>
        {solutions.map((solution, index) => {
          const distance = index - midpoint
          return (
            <Link
              className="circular-card"
              to={`/loesungen/${solution.slug}`}
              style={
                {
                  '--card-rotate': `${distance * bend}deg`,
                  '--card-lift': `${Math.abs(distance) * 12}px`,
                } as React.CSSProperties
              }
              key={solution.slug}
            >
              <ResponsiveImage image={solution.featuredImage} />
              <span className="circular-card__meta">{solution.no}</span>
              <h3>{solution.shortTitle}</h3>
              <span className="circular-card__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
