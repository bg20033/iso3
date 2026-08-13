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

/*
 * Ab dieser Anzahl Paaren trägt ein durchlaufendes Band. Darunter wirkt der
 * Lauf leer oder – schlimmer – er wiederholt dieselbe Aufnahme mehrfach.
 * Dann steht stattdessen ein ruhiges Raster.
 */
const MARQUEE_THRESHOLD = 3

type Pair = { comparison: Comparison; solution: Solution }

function CompareCard({
  comparison,
  solution,
  duplicate = false,
}: Pair & { duplicate?: boolean }) {
  const { language } = useLanguage()
  const englishCaption: Record<string, string> = {
    'ventile-armaturen-ventil-blau': 'Shut-off valve with removable insulation jacket',
    'heizungszentralen-rohrknoten': 'Pipe junction with flanges and measuring point',
    'sonderbau-armaturengruppe': 'Valve assembly with combined insulation',
  }
  const caption = language === 'en'
    ? englishCaption[comparisonKey(comparison)] ?? solution.shortTitle
    : comparison.caption ?? solution.shortTitle
  return (
    <div
      className="ref-marquee__card compare-card"
      aria-hidden={duplicate}
      inert={duplicate}
    >
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

/**
 * Vorher/Nachher-Vergleiche. Jede Karte trägt ihren eigenen Regler: Die
 * Trennlinie lässt sich ziehen und schiebt die Dämmung vom Bauteil.
 *
 * Liegen genug Paare vor, laufen sie als Band. Der Streifen wird dafür genau
 * einmal dupliziert und um die halbe Breite verschoben, damit das Ende der
 * ersten Kopie auf den Anfang der zweiten trifft. Die zweite Kopie ist inert,
 * damit ihre Regler nicht doppelt in die Bedienreihenfolge geraten.
 *
 * Damit das bedienbar bleibt, hält der Lauf an, sobald jemand die Karte
 * berührt. Auf Tastgeräten läuft er gar nicht erst von selbst – dort wird
 * gewischt.
 */
export function ComparisonMarquee() {
  const { pick } = useLanguage()
  const { solutions } = useLocalizedSite()
  const pairs = comparisons.reduce<Pair[]>((acc, comparison) => {
    const solution = findLocalizedSolution(solutions, comparison.slug)
    if (solution) acc.push({ comparison, solution })
    return acc
  }, [])

  if (pairs.length === 0) return null

  /* Wenige Paare: Raster statt Lauf – keine Aufnahme wird wiederholt. */
  if (pairs.length < MARQUEE_THRESHOLD) {
    return (
      <div
        className="compare-grid"
        data-count={pairs.length}
        aria-label={pick('Vorher und nachher im Vergleich', 'Before and after comparison')}
      >
        {pairs.map((pair) => (
          <CompareCard key={comparisonKey(pair.comparison)} {...pair} />
        ))}
      </div>
    )
  }

  const track = [...pairs, ...pairs]

  return (
    <div
      className="ref-marquee ref-marquee--compare"
      aria-label={pick('Vorher und nachher im Vergleich', 'Before and after comparison')}
    >
      <div
        className="ref-marquee__track"
        style={{ '--count': pairs.length } as React.CSSProperties}
      >
        {track.map((pair, index) => (
          <CompareCard
            key={`${comparisonKey(pair.comparison)}-${index}`}
            duplicate={index >= pairs.length}
            {...pair}
          />
        ))}
      </div>
    </div>
  )
}
