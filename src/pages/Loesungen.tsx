import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { SolutionCircularGallery } from '../components/SolutionCircularGallery'
import { SolutionSidebar } from '../components/SolutionSidebar'
import { solutions } from '../data/site'

export default function Loesungen() {
  return (
    <>
      <PageHead
        index="01 · Lösungen"
        crumb="Lösungen"
        title="Dämmkonzepte für komplexe Industrieanlagen."
        lead="Jede Lösung wird auf Geometrie, Temperatur, Bewegung und Wartungszugang der jeweiligen Komponente abgestimmt."
      />
      <section className="section section--black solutions-orbit">
        <div className="shell">
          <SolutionCircularGallery solutions={solutions} bend={3} />
        </div>
      </section>
      <section className="section section--light">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <SolutionSidebar solutions={solutions} />
          </aside>
          <div className="solution-list">
            {solutions.map((solution) => (
              <article className="solution-row" id={solution.slug} key={solution.slug}>
                <Link
                  className="solution-row__image"
                  to={`/loesungen/${solution.slug}`}
                  aria-label={`${solution.title} öffnen`}
                >
                  <ResponsiveImage image={solution.featuredImage} />
                </Link>
                <div>
                  <span className="eyebrow">
                    {solution.no} · {solution.eyebrow}
                  </span>
                  <h2>{solution.title}</h2>
                  <p>{solution.summary}</p>
                  <Link className="text-link" to={`/loesungen/${solution.slug}`}>
                    Details & Referenzen <ArrowUpRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
