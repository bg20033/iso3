import { ArrowUpRight, Check } from 'lucide-react'
import { BeforeAfterSlider } from './BeforeAfterSlider'
import { ResponsiveImage } from './ResponsiveImage'
import type { Solution } from '../data/site'

type CategoryFocusProps = {
  solution: Solution
  onSelect: (solution: Solution) => void
}

/** Vorher/Nachher-Paare liegen bisher nur für Ventile im Archiv. */
const beforeImage = {
  src: '/media/ventile/before-after/ventil-vorher-1280.webp',
  thumb: '/media/ventile/before-after/ventil-vorher-640.webp',
  alt: 'Ungedämmtes blaues Industrieventil vor der IsoMat-Ausführung',
}

const afterImage = {
  src: '/media/ventile/before-after/ventil-nachher-1280.webp',
  thumb: '/media/ventile/before-after/ventil-nachher-640.webp',
  alt: 'Dasselbe Industrieventil mit passgenauem IsoMat-Dämmkissen',
}

/** Die reale Aufnahme zum Modell – beim Ventil als Vorher/Nachher-Vergleich. */
export function CategoryFocus({ solution, onSelect }: CategoryFocusProps) {
  const comparison = solution.slug === 'ventile-armaturen'

  return (
    <div className="panel__focus">
      {comparison ? (
        <BeforeAfterSlider before={beforeImage} after={afterImage} />
      ) : (
        <figure className="focus-media">
          <ResponsiveImage image={solution.featuredImage} />
          <figcaption>Aus der Fertigung</figcaption>
        </figure>
      )}

      <div className="panel__focus-body">
        <ul className="panel__benefits">
          {solution.benefits.slice(0, 3).map((benefit) => (
            <li key={benefit}>
              <Check aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="panel__actions">
          <button
            className="button button--compact"
            type="button"
            aria-haspopup="dialog"
            aria-label={`Archiv öffnen: ${solution.title}`}
            onClick={() => onSelect(solution)}
          >
            Archiv öffnen
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          <span>{solution.gallery.length} Aufnahmen</span>
        </div>
      </div>
    </div>
  )
}
