import { Link } from 'react-router-dom'
import { ResponsiveImage } from './ResponsiveImage'
import {
  solutionQuickviewPath,
  type GalleryImage,
  type Solution,
} from '../data/site'

type ReferenceMarqueeProps = {
  solutions: Solution[]
  /** Aufnahmen je Kategorie, die in den Lauf aufgenommen werden. */
  perCategory?: number
}

/**
 * Endlos laufende Kartenreihe mit realen Aufnahmen. Der Streifen wird doppelt
 * gerendert und um genau die halbe Breite verschoben – dadurch trifft das Ende
 * der ersten Kopie exakt auf den Anfang der zweiten und der Lauf wirkt nahtlos.
 */
export function ReferenceMarquee({
  solutions,
  perCategory = 3,
}: ReferenceMarqueeProps) {
  /*
   * Reihum statt kategorienweise: sonst laufen drei Aufnahmen derselben
   * Kategorie hintereinander durchs Bild und der Streifen wirkt eintönig.
   */
  const cards = Array.from({ length: perCategory }, (_, round) =>
    solutions
      .map((solution) => {
        const image = solution.gallery[round]
        return image ? { image, solution } : null
      })
      .filter((card): card is { image: GalleryImage; solution: Solution } =>
        Boolean(card),
      ),
  ).flat()

  const track = [...cards, ...cards]

  return (
    <div className="ref-marquee">
      <div
        className="ref-marquee__track"
        style={{ '--count': cards.length } as React.CSSProperties}
      >
        {track.map(({ image, solution }, index) => (
          <Link
            className="ref-marquee__card"
            to={solutionQuickviewPath(solution)}
            key={`${image.src}-${index}`}
            aria-hidden={index >= cards.length}
            tabIndex={index >= cards.length ? -1 : undefined}
          >
            <span className="ref-marquee__media">
              <ResponsiveImage image={image} />
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
