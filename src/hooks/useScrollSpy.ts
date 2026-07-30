import { useEffect, useState } from 'react'

/**
 * Verfolgt, welcher Abschnitt gerade gelesen wird.
 * `ids` wird als String übergeben (mit `|` getrennt), damit der Effekt nicht
 * bei jedem Render neu aufgesetzt wird.
 */
export function useScrollSpy(idKey: string, enabled = true) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    enabled ? 0 : null,
  )

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return

    const targets = idKey
      .split('|')
      .map((id, index) => {
        const el = document.getElementById(id)
        return el ? { el, index } : null
      })
      .filter((entry): entry is { el: HTMLElement; index: number } => !!entry)

    if (!targets.length) return

    const visible = new Set<number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const match = targets.find((target) => target.el === entry.target)
          if (!match) continue
          if (entry.isIntersecting) visible.add(match.index)
          else visible.delete(match.index)
        }
        if (visible.size) setActiveIndex(Math.min(...visible))
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target.el))
    return () => observer.disconnect()
  }, [idKey, enabled])

  return activeIndex
}

/** Springt zu einem Abschnitt und respektiert reduzierte Bewegung. */
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'start',
  })
}
