import { useEffect, useRef, useState, type RefObject } from 'react'
import { jacketLayers } from '../data/site'

/**
 * Steuert, wie weit die Schnittansicht geöffnet ist.
 *
 * Am Desktop klebt die Bühne im Abschnitt und der Scrollfortschritt öffnet das
 * Kissen Lage für Lage. Auf dem Telefon gibt es dafür keinen Weg – dort öffnet
 * sich die Ansicht, sobald der Abschnitt im Bild steht.
 */
export function useJacketProgress<T extends HTMLElement>(
  sectionRef: RefObject<T | null>,
  compact: boolean,
) {
  const progressRef = useRef(0)
  const [activeLayer, setActiveLayer] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || compact) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const value = travel > 0 ? -rect.top / travel : 0
      const clamped = Math.min(Math.max(value, 0), 1)
      progressRef.current = clamped
      const index = Math.min(
        jacketLayers.length - 1,
        Math.floor(clamped * jacketLayers.length * 1.15),
      )
      setActiveLayer((current) => (current === index ? current : index))
    }

    // Kein requestAnimationFrame-Throttle: in versteckten Tabs laufen keine
    // Frames, und der Fortschritt bliebe auf dem letzten Stand stehen.
    const onScroll = () => {
      if (frame) return
      frame = document.hidden ? 0 : requestAnimationFrame(update)
      if (!frame) update()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [compact, sectionRef])

  useEffect(() => {
    const section = sectionRef.current
    if (!compact || !section || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        progressRef.current = entry.isIntersecting ? 1 : 0
      },
      { rootMargin: '-25% 0px -25% 0px', threshold: 0 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [compact, sectionRef])

  return { progressRef, activeLayer }
}
