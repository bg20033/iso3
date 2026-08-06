import { useEffect, useState, type RefObject } from 'react'

/**
 * Meldet, ob ein Bereich im oder nahe am Sichtfeld liegt – und schaltet wieder
 * ab, sobald er es verlässt. So bleibt immer nur die gerade sichtbare 3D-Bühne
 * im Speicher.
 *
 * Bewusst über getBoundingClientRect statt IntersectionObserver: dessen
 * Callbacks werden in inaktiven oder gedrosselten Tabs nicht zugestellt, und
 * dann bliebe die Bühne für immer leer.
 */
export function useVisibleRange<T extends HTMLElement>(
  ref: RefObject<T | null>,
  margin = 400,
) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    /*
     * Direkt messen statt über requestAnimationFrame zu drosseln: in
     * versteckten Tabs laufen keine Frames, und dann bliebe die Bühne auch
     * nach der Rückkehr leer. Ein getBoundingClientRect pro Scrollereignis
     * ist für eine Handvoll Elemente unkritisch.
     */
    const measure = () => {
      const rect = element.getBoundingClientRect()
      const next =
        rect.bottom > -margin && rect.top < window.innerHeight + margin
      setVisible((current) => (current === next ? current : next))
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
  }, [margin, ref])

  return visible
}
