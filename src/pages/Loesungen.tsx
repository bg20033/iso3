import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import GlareHover from '../components/GlareHover'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import ReflectiveCard from '../components/ReflectiveCard'
import { SolutionCircularGallery } from '../components/SolutionCircularGallery'
import { SolutionSidebar } from '../components/SolutionSidebar'
import { SolutionModal } from '../components/SolutionModal'
import { useInteractiveVisuals } from '../components/useInteractiveVisuals'
import {
  solutionBySlug,
  solutions,
  type Solution,
} from '../data/site'

const referenceCount = solutions.reduce(
  (total, solution) => total + solution.gallery.length,
  0,
)

export default function Loesungen() {
  const interactive = useInteractiveVisuals()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(
    () => solutionBySlug(searchParams.get('solution') || undefined) ?? null,
  )
  const selectedSlug = searchParams.get('solution')

  useEffect(() => {
    setSelectedSolution(solutionBySlug(selectedSlug || undefined) ?? null)
  }, [selectedSlug])

  const openModal = useCallback(
    (solution: Solution) => {
      setSelectedSolution(solution)
      setSearchParams({ solution: solution.productSlug }, { replace: true })
    },
    [setSearchParams],
  )

  const closeModal = useCallback(() => {
    setSelectedSolution(null)
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

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
          <p className="gallery-hint">
            <span>Ziehen oder scrollen zum Blättern</span>
            <span>
              {solutions.length} Kategorien · {referenceCount} Referenzaufnahmen
            </span>
          </p>
        </div>
      </section>

      <section className="section section--light">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <SolutionSidebar
              solutions={solutions}
              mode="index"
              label="Index"
            />
          </aside>

          <div className="solution-card-grid">
            {solutions.map((solution) => (
              <article
                className="solution-card-anchor"
                id={solution.slug}
                key={solution.slug}
              >
                <ReflectiveCard
                  className="solution-card"
                  disabled={!interactive}
                >
                  <GlareHover
                    width="100%"
                    height="100%"
                    background="#eceeef"
                    borderRadius="0"
                    borderColor="#d2d6d8"
                    glareColor="#ffffff"
                    glareOpacity={0.22}
                    glareAngle={-38}
                    glareSize={180}
                    transitionDuration={720}
                    className="solution-card__media"
                  >
                    <button
                      className="solution-card__image"
                      type="button"
                      onClick={() => openModal(solution)}
                      aria-haspopup="dialog"
                      aria-label={`${solution.title} öffnen`}
                    >
                      <ResponsiveImage image={solution.featuredImage} />
                    </button>
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
                    <div className="solution-card__foot">
                      <button
                        className="text-link solution-card__more"
                        type="button"
                        aria-haspopup="dialog"
                        aria-label={`Mehr erfahren: ${solution.title}`}
                        onClick={() => openModal(solution)}
                      >
                        Mehr erfahren{' '}
                        <ArrowUpRight aria-hidden="true" />
                      </button>
                      <span className="solution-card__count">
                        {solution.gallery.length} Aufnahmen
                      </span>
                    </div>
                  </div>
                </ReflectiveCard>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">
            Kategorie gefunden, Bauteil unklar?
          </span>
          <h2>Schicken Sie uns ein Foto der Komponente.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt beschreiben <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <SolutionModal
        solution={selectedSolution}
        onClose={closeModal}
        onSelectSolution={openModal}
      />
    </>
  )
}
