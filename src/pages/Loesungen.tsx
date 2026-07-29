import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import GlareHover from '../components/GlareHover'
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
      <section className="section section--metal solutions-orbit">
        <div className="shell">
          <SolutionCircularGallery solutions={solutions} bend={3} />
        </div>
      </section>
      <section className="section section--light">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <SolutionSidebar solutions={solutions} />
          </aside>
          <div className="solution-card-grid">
            {solutions.map((solution) => (
              <article
                className="solution-card"
                id={solution.slug}
                key={solution.slug}
              >
                <GlareHover
                  width="100%"
                  height="100%"
                  background="#eceeef"
                  borderRadius="0"
                  borderColor="#d2d6d8"
                  glareColor="#ffffff"
                  glareOpacity={0.28}
                  glareAngle={-38}
                  glareSize={180}
                  transitionDuration={720}
                  className="solution-card__media"
                >
                  <Link
                    className="solution-card__image"
                    to={`/loesungen/${solution.slug}`}
                    aria-label={`${solution.title} öffnen`}
                  >
                    <ResponsiveImage image={solution.featuredImage} />
                  </Link>
                </GlareHover>
                <div className="solution-card__body">
                  <span className="eyebrow">
                    {solution.no} · {solution.eyebrow}
                  </span>
                  <h2>{solution.title}</h2>
                  <p>{solution.summary}</p>
                  <div className="solution-card__tags">
                    {solution.applications.slice(0, 3).map((application) => (
                      <span key={application}>{application}</span>
                    ))}
                  </div>
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
