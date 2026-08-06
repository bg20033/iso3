import { Link } from 'react-router-dom'
import { ResponsiveImage } from './ResponsiveImage'
import {
  comparisons,
  solutionBySlug,
  solutionQuickviewPath,
  type Comparison,
  type Solution,
} from '../data/site'

/*
 * Damit der Streifen die Bildschirmbreite füllt, braucht er genug Karten.
 * Solange erst wenige Vorher/Nachher-Paare vorliegen, werden sie wiederholt;
 * mit jedem zusätzlichen Paar wird die Wiederholung seltener.
 */
const MIN_CARDS = 6

type Pair = { comparison: Comparison; solution: Solution }

/**
 * Endlos laufende Reihe von Vorher/Nachher-Karten. Jede Karte zeigt beide
 * Zustände nebeneinander – ein fester Schnitt statt eines Reglers, weil in
 * einem laufenden Streifen niemand ziehen kann und 40 Regler nebeneinander
 * weder zu bedienen noch zu rendern wären.
 *
 * Der Streifen wird doppelt gerendert und um genau die halbe Breite
 * verschoben, damit das Ende der ersten Kopie auf den Anfang der zweiten
 * trifft und der Lauf nahtlos wirkt.
 */
export function ComparisonMarquee() {
  const pairs = comparisons.reduce<Pair[]>((acc, comparison) => {
    const solution = solutionBySlug(comparison.slug)
    if (solution) acc.push({ comparison, solution })
    return acc
  }, [])

  if (pairs.length === 0) return null

  const repeats = Math.ceil(MIN_CARDS / pairs.length)
  const cards = Array.from({ length: repeats }, () => pairs).flat()
  const track = [...cards, ...cards]

  return (
    <div
      className="ref-marquee ref-marquee--compare"
      aria-label="Vorher und nachher im Vergleich"
    >
      <div
        className="ref-marquee__track"
        style={{ '--count': cards.length } as React.CSSProperties}
      >
        {track.map(({ comparison, solution }, index) => (
          <Link
            className="ref-marquee__card compare-card"
            to={solutionQuickviewPath(solution)}
            key={`${comparison.slug}-${index}`}
            aria-hidden={index >= cards.length}
            tabIndex={index >= cards.length ? -1 : undefined}
          >
            <span className="compare-card__pair">
              <span className="compare-card__half">
                <ResponsiveImage image={comparison.before} />
                <b>Vorher</b>
              </span>
              <span className="compare-card__half">
                <ResponsiveImage image={comparison.after} />
                <b>Nachher</b>
              </span>
            </span>
            <span className="ref-marquee__label">
              <b>{solution.no}</b>
              {solution.shortTitle}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
