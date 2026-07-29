import { lazy, Suspense } from 'react'
import { solutions } from '../data/site'
import { useInteractiveVisuals } from './useInteractiveVisuals'

const ScrollVelocity = lazy(() => import('./ScrollVelocity'))

const line = solutions
  .map((solution) => `${solution.no} ${solution.shortTitle}`)
  .join('  ·  ')

export function IndustrialVelocity() {
  const interactive = useInteractiveVisuals()

  return (
    <div className="industrial-velocity" aria-label="IsoMat Lösungsbereiche">
      {interactive ? (
        <Suspense fallback={<p>{line}</p>}>
          <ScrollVelocity
            texts={[line]}
            velocity={28}
            numCopies={4}
            className="industrial-velocity__line"
            parallaxClassName="industrial-velocity__track"
            scrollerClassName="industrial-velocity__scroller"
          />
        </Suspense>
      ) : (
        <p>{line}</p>
      )}
    </div>
  )
}
