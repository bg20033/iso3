import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productPath, type Solution } from '../data/site'
import LineSidebar from './LineSidebar'

type SolutionSidebarProps = {
  solutions: Solution[]
  /**
   * `detail` – markiert die geöffnete Lösung, Klick wechselt die Seite.
   * `index` – folgt dem Scrollstand der Karten, Klick springt zur Karte.
   */
  mode?: 'detail' | 'index'
  activeSlug?: string
  label?: string
}

/** Beobachtet die Lösungskarten und meldet die oberste sichtbare zurück. */
function useScrollSpy(slugKey: string, enabled: boolean) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    enabled ? 0 : null,
  )

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return

    const targets = slugKey
      .split('|')
      .map((slug, index) => {
        const el = document.getElementById(slug)
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
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target.el))
    return () => observer.disconnect()
  }, [slugKey, enabled])

  return activeIndex
}

export function SolutionSidebar({
  solutions,
  mode = 'detail',
  activeSlug,
  label,
}: SolutionSidebarProps) {
  const navigate = useNavigate()
  const slugKey = solutions.map((solution) => solution.slug).join('|')
  const spyIndex = useScrollSpy(slugKey, mode === 'index')

  const detailIndex = activeSlug
    ? solutions.findIndex((solution) => solution.slug === activeSlug)
    : -1
  const activeIndex =
    mode === 'index' ? spyIndex : detailIndex === -1 ? null : detailIndex

  const handleClick = (index: number) => {
    if (mode === 'detail') {
      navigate(productPath(solutions[index]))
      return
    }
    document.getElementById(solutions[index].slug)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="solutions-nav">
      {label && (
        <span className="solutions-nav__label">
          {label}
          <b>{String(solutions.length).padStart(2, '0')}</b>
        </span>
      )}
      <LineSidebar
        key={`${mode}-${activeIndex ?? 'none'}`}
        className="reactbits-line-sidebar"
        items={solutions.map((solution) => solution.shortTitle)}
        accentColor="#d62622"
        textColor="#454c4f"
        markerColor="#a9afb2"
        proximityRadius={110}
        maxShift={14}
        markerLength={44}
        markerGap={10}
        tickScale={0.55}
        itemGap={16}
        fontSize={0.95}
        smoothing={90}
        defaultActive={activeIndex}
        onItemClick={handleClick}
      />
    </div>
  )
}
