import { useEffect, useState, type RefObject } from 'react'

/**
 * Aktiviert schwere Inhalte kurz bevor sie sichtbar werden und lässt sie dann
 * an – anders als useVisibleRange, das auch wieder abschaltet.
 *
 * Gemessen wird über die Position statt über IntersectionObserver: dessen
 * Callbacks werden in inaktiven Tabs nicht zugestellt, und dann bliebe die
 * Galerie auch nach der Rückkehr leer.
 */
export function useNearViewport<T extends HTMLElement>(
  ref: RefObject<T | null>,
  margin = 800,
) {
  const [nearby, setNearby] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || nearby) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      if (rect.bottom > -margin && rect.top < window.innerHeight + margin) {
        setNearby(true)
      }
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    document.addEventListener('visibilitychange', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', measure)
    }
  }, [margin, nearby, ref])

  return nearby
}
