import { useEffect, useState, type RefObject } from 'react'

/**
 * Aktiviert schwere Inhalte kurz bevor sie sichtbar werden. So konkurrieren
 * WebGL-Galerien unterhalb des Folds nicht mit dem ersten sichtbaren Bereich.
 */
export function useNearViewport<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = '800px 0px',
) {
  const [nearby, setNearby] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setNearby(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNearby(true)
        observer.disconnect()
      },
      { rootMargin, threshold: 0 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return nearby
}
