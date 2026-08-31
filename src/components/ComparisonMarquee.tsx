import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BeforeAfterSlider } from './BeforeAfterSlider'
import {
  comparisonKey,
  comparisons,
  solutionQuickviewPath,
  type Comparison,
  type Solution,
} from '../data/site'
import { findLocalizedSolution, useLanguage, useLocalizedSite } from '../i18n'

type Pair = { comparison: Comparison; solution: Solution }

function CompareCard({
  comparison,
  solution,
}: Pair) {
  const { language } = useLanguage()
  const englishCaption: Record<string, string> = {
    'ventile-armaturen-ventil-blau': 'Shut-off valve with removable insulation jacket',
    'heizungszentralen-rohrknoten': 'Pipe junction with flanges and measuring point',
    'sonderbau-armaturengruppe': 'Valve assembly with combined insulation',
    'ventile-armaturen-rohrleitungsgruppe': 'Pipe assembly with precision-fit insulation jackets',
    'turbinen-turbinengehaeuse': 'Turbine casing with multi-part insulation',
  }
  const caption = language === 'en'
    ? englishCaption[comparisonKey(comparison)] ?? solution.shortTitle
    : comparison.caption ?? solution.shortTitle
  return (
    <div className="ref-marquee__card compare-card">
      <BeforeAfterSlider
        compact
        before={comparison.before}
        after={comparison.after}
        name={solution.shortTitle}
      />
      <Link className="ref-marquee__label" to={solutionQuickviewPath(solution)}>
        <b>{solution.no}</b>
        {caption}
      </Link>
    </div>
  )
}

/** Manual outer carousel; every card keeps its own before/after slider. */
export function ComparisonMarquee() {
  const { pick } = useLanguage()
  const { solutions } = useLocalizedSite()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [canPrevious, setCanPrevious] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const pairs = comparisons.reduce<Pair[]>((acc, comparison) => {
    const solution = findLocalizedSolution(solutions, comparison.slug)
    if (solution) acc.push({ comparison, solution })
    return acc
  }, [])

  const syncNavigation = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const cards = [
      ...viewport.querySelectorAll<HTMLElement>('.compare-card'),
    ]
    const nearest = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(card.offsetLeft - viewport.scrollLeft)
        return distance < best.distance ? { index, distance } : best
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    )

    setCurrent(nearest.index)
    setCanPrevious(viewport.scrollLeft > 2)
    setCanNext(
      viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 2,
    )
  }, [])

  useEffect(() => {
    syncNavigation()
    window.addEventListener('resize', syncNavigation)
    return () => window.removeEventListener('resize', syncNavigation)
  }, [syncNavigation])

  const move = (direction: -1 | 1) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const cards = [
      ...viewport.querySelectorAll<HTMLElement>('.compare-card'),
    ]
    const targetIndex = Math.min(
      cards.length - 1,
      Math.max(0, current + direction),
    )
    const target = cards[targetIndex]
    if (!target) return

    viewport.scrollTo({
      left: target.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  if (pairs.length === 0) return null

  return (
    <section
      className="comparison-carousel"
      aria-label={pick('Vorher und nachher im Vergleich', 'Before and after comparison')}
    >
      <div className="comparison-carousel__toolbar">
        <span>{pick('Vorher / Nachher', 'Before / After')}</span>
        <div className="comparison-carousel__controls">
          <output aria-live="polite">
            {String(current + 1).padStart(2, '0')} / {String(pairs.length).padStart(2, '0')}
          </output>
          <button
            type="button"
            aria-label={pick('Vorherige Vergleichskarte', 'Previous comparison card')}
            aria-controls="comparison-carousel-track"
            disabled={!canPrevious}
            onClick={() => move(-1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={pick('Nächste Vergleichskarte', 'Next comparison card')}
            aria-controls="comparison-carousel-track"
            disabled={!canNext}
            onClick={() => move(1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className="comparison-carousel__viewport"
        ref={viewportRef}
        onScroll={syncNavigation}
      >
        <div className="comparison-carousel__track" id="comparison-carousel-track">
          {pairs.map((pair) => (
            <CompareCard key={comparisonKey(pair.comparison)} {...pair} />
          ))}
        </div>
      </div>
    </section>
  )
}
