import { Link } from 'react-router-dom'
import { BeforeAfterSlider } from './BeforeAfterSlider'
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
 * Laufende Reihe von Vorher/Nachher-Karten. Jede Karte trägt ihren eigenen
 * Regler: Die Trennlinie lässt sich ziehen und schiebt die Dämmung vom
 * Bauteil.
 *
 * Damit das bedienbar bleibt, hält der Lauf an, sobald jemand die Karte
 * berührt (Zeiger darüber oder Fokus im Streifen). Auf Tastgeräten läuft er
 * gar nicht erst von selbst – dort wird gewischt.
 *
 * Der Streifen wird doppelt gerendert und um genau die halbe Breite
 * verschoben, damit das Ende der ersten Kopie auf den Anfang der zweiten
 * trifft und der Lauf nahtlos wirkt. Die zweite Kopie ist inert, damit ihre
 * Regler nicht doppelt in die Bedienreihenfolge geraten.
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
        {track.map(({ comparison, solution }, index) => {
          const duplicate = index >= cards.length
          return (
            <div
              className="ref-marquee__card compare-card"
              key={`${comparison.slug}-${index}`}
              aria-hidden={duplicate}
              inert={duplicate}
            >
              <BeforeAfterSlider
                compact
                before={comparison.before}
                after={comparison.after}
                name={solution.shortTitle}
              />
              <Link
                className="ref-marquee__label"
                to={solutionQuickviewPath(solution)}
              >
                <b>{solution.no}</b>
                {solution.shortTitle}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
