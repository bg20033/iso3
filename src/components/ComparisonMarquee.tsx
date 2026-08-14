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
 * Vorher/Nachher-Vergleiche als endlos laufendes Band.
 *
 * Der Streifen wird genau einmal dupliziert und um die halbe Breite
 * verschoben: Das Ende der ersten Kopie trifft dabei auf den Anfang der
 * zweiten, der Übergang bleibt unsichtbar. Die zweite Kopie ist inert, damit
 * ihre Regler nicht doppelt in die Bedienreihenfolge geraten.
 *
 * Damit sich die Regler ziehen lassen, hält der Lauf an, sobald der Zeiger
 * über dem Streifen liegt oder der Fokus darin sitzt. Auf Tastgeräten gibt es
 * kein Darüberfahren – dort wird von Hand gewischt statt gelaufen (siehe CSS).
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

  return (
    <div
      className="ref-marquee ref-marquee--compare"
      aria-label={pick('Vorher und nachher im Vergleich', 'Before and after comparison')}
    >
      <div
        className="ref-marquee__track"
        style={{ '--count': pairs.length } as React.CSSProperties}
      >
        {[...pairs, ...pairs].map((pair, index) => (
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
