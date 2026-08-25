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

/** Five static comparisons: three on the first desktop row, two below. */
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
      className="comparison-grid"
      aria-label={pick('Vorher und nachher im Vergleich', 'Before and after comparison')}
    >
      {pairs.map((pair) => (
        <CompareCard key={comparisonKey(pair.comparison)} {...pair} />
      ))}
    </div>
  )
}
