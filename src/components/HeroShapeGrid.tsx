import { lazy, Suspense } from 'react'
import { useInteractiveVisuals } from './useInteractiveVisuals'

const ShapeGrid = lazy(() => import('./ShapeGrid'))

export function HeroShapeGrid() {
  const interactive = useInteractiveVisuals()

  return (
    <div className="hero-shape-grid" aria-hidden="true">
      {interactive && (
        <Suspense fallback={null}>
          <ShapeGrid
            direction="diagonal"
            speed={0.14}
            squareSize={62}
            borderColor="rgba(35, 40, 42, 0.11)"
            hoverFillColor="rgba(214, 38, 34, 0.1)"
          />
        </Suspense>
      )}
    </div>
  )
}
