import { lazy, Suspense } from 'react'
import { useInteractiveVisuals } from './useInteractiveVisuals'

const MagicRings = lazy(() => import('./MagicRings'))

export function HeroRings() {
  const interactive = useInteractiveVisuals()

  if (!interactive) {
    return <div className="magic-rings-fallback" aria-hidden="true" />
  }

  return (
    <div className="hero-rings" aria-hidden="true">
      <Suspense fallback={null}>
        <MagicRings
          color="#d62622"
          colorTwo="#8f9698"
          speed={0.42}
          ringCount={6}
          attenuation={12}
          lineThickness={1.35}
          baseRadius={0.28}
          radiusStep={0.085}
          scaleRate={0.08}
          opacity={0.64}
          noiseAmount={0.025}
          rotation={-12}
          ringGap={1.45}
          followMouse
          mouseInfluence={0.045}
          hoverScale={1.04}
          parallax={0.018}
          clickBurst={false}
        />
      </Suspense>
    </div>
  )
}
