import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import LineSidebar from '../components/LineSidebar'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { SolutionModal } from '../components/SolutionModal'
import { solutions, type Solution } from '../data/site'

export default function Loesungen() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [activeCategory, setActiveCategory] = useState(0)
  const openModal = useCallback((solution: Solution) => {
    setSelectedSolution(solution)
  }, [])
  const closeModal = useCallback(() => setSelectedSolution(null), [])

  useEffect(() => {
    let frame = 0
    const updateActiveCategory = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const guide = Math.min(window.innerHeight * 0.38, 320)
        let nextIndex = 0
        let closestDistance = Number.POSITIVE_INFINITY

        solutions.forEach((solution, index) => {
          const card = document.getElementById(`loesung-${solution.productSlug}`)
          if (!card) return
          const rect = card.getBoundingClientRect()
          const distance = rect.top <= guide && rect.bottom >= guide
            ? 0
            : Math.min(Math.abs(rect.top - guide), Math.abs(rect.bottom - guide))
          if (distance < closestDistance) {
            closestDistance = distance
            nextIndex = index
          }
        })

        setActiveCategory((current) => current === nextIndex ? current : nextIndex)
      })
    }

    updateActiveCategory()
    window.addEventListener('scroll', updateActiveCategory, { passive: true })
    window.addEventListener('resize', updateActiveCategory)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveCategory)
      window.removeEventListener('resize', updateActiveCategory)
    }
  }, [])

  return (
    <>
      <PageHead
        index="01 · Lösungen"
        crumb="Lösungen"
        title="Die passende Form für jede Anlage."
        lead="Sieben typische Kategorien, individuell konstruiert und für Wartung, Inspektion und Reparatur wieder abnehmbar."
      />

      <section className="section section--light solutions-overview">
        <div className="shell solutions-overview__layout">
          <aside className="solutions-line-sidebar">
            <span className="solutions-line-sidebar__label">Kategorien</span>
            <LineSidebar
              items={solutions.map((solution) => solution.shortTitle)}
              ariaLabel="Lösungskategorien"
              accentColor="#d62622"
              textColor="#5c6366"
              markerColor="#a9afb2"
              proximityRadius={88}
              maxShift={14}
              markerLength={42}
              markerGap={8}
              itemGap={18}
              fontSize={0.92}
              smoothing={130}
              activeIndex={activeCategory}
              defaultActive={0}
              onItemClick={(index) => {
                setActiveCategory(index)
                document
                  .getElementById(`loesung-${solutions[index].productSlug}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            />
          </aside>

          <div className="solutions-overview__content">
            <div className="solutions-overview__intro">
              <span className="eyebrow">Bauteile & Anwendungen</span>
              <p>
                Wählen Sie die Kategorie, die Ihrer Komponente am nächsten kommt.
                Ist keine passende Form dabei, entwickelt IsoMat eine Sonderlösung.
              </p>
            </div>

            <div className="solution-index">
              {solutions.map((solution) => (
                <article
                  className="solution-index__card"
                  id={`loesung-${solution.productSlug}`}
                  key={solution.slug}
                >
                  <button
                    className="solution-index__media"
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`${solution.title}: Details öffnen`}
                    onClick={() => openModal(solution)}
                  >
                    <ResponsiveImage image={solution.featuredImage} />
                    <span>{solution.no}</span>
                  </button>
                  <div className="solution-index__body">
                    <span className="eyebrow">{solution.eyebrow}</span>
                    <h2>{solution.title}</h2>
                    <p>{solution.summary}</p>
                    <ul className="solution-index__benefits">
                      {solution.benefits.slice(0, 2).map((benefit) => (
                        <li key={benefit}><Check aria-hidden="true" />{benefit}</li>
                      ))}
                    </ul>
                    <div className="solution-index__applications">
                      {solution.applications.slice(0, 3).map((application) => (
                        <span key={application}>{application}</span>
                      ))}
                    </div>
                    <button
                      className="text-link solution-index__open"
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => openModal(solution)}
                    >
                      Details ansehen <ArrowUpRight aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-band contact-band--redesign">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Keine Kategorie passt?</span>
          <h2>Zeigen Sie uns die Komponente.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt beschreiben <ArrowUpRight aria-hidden="true" />
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
