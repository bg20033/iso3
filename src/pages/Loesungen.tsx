import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import LineSidebar from '../components/LineSidebar'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { SolutionModal } from '../components/SolutionModal'
import { type Solution } from '../data/site'
import { findLocalizedSolution, useLanguage, useLocalizedSite } from '../i18n'

export default function Loesungen() {
  const { pick } = useLanguage()
  const { solutions } = useLocalizedSite()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [activeCategory, setActiveCategory] = useState(0)
  const openModal = useCallback((solution: Solution) => {
    setSelectedSolution(solution)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('solution', solution.productSlug)
      return next
    }, { replace: true })
  }, [setSearchParams])
  const closeModal = useCallback(() => {
    setSelectedSolution(null)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.delete('solution')
      return next
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    const requested = searchParams.get('solution')
    if (!requested) return
    const match = findLocalizedSolution(solutions, requested)
    if (match) setSelectedSolution(match)
  }, [searchParams, solutions])

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
  }, [solutions])

  return (
    <>
      <PageHead
        index={pick('01 · Lösungen', '01 · Solutions')}
        crumb={pick('Lösungen', 'Solutions')}
        title={pick('Die passende Form für jede Anlage.', 'The right shape for every plant.')}
        lead={pick('Sieben typische Kategorien, individuell konstruiert und für Wartung, Inspektion und Reparatur wieder abnehmbar.', 'Seven typical categories, individually designed and removable for maintenance, inspection and repair.')}
      />

      <section className="section section--light solutions-overview">
        <div className="shell solutions-overview__layout">
          <aside className="solutions-line-sidebar">
            <span className="solutions-line-sidebar__label">{pick('Kategorien', 'Categories')}</span>
            <LineSidebar
              items={solutions.map((solution) => solution.shortTitle)}
              ariaLabel={pick('Lösungskategorien', 'Solution categories')}
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
              <span className="eyebrow">{pick('Bauteile & Anwendungen', 'Components & applications')}</span>
              <p>
                {pick('Wählen Sie die Kategorie, die Ihrer Komponente am nächsten kommt. Ist keine passende Form dabei, entwickelt IsoMat eine Sonderlösung.', 'Choose the category closest to your component. If none matches, IsoMat will develop a custom solution.')}
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
                    aria-label={`${solution.title}: ${pick('Details öffnen', 'open details')}`}
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
                      {pick('Details ansehen', 'View details')} <ArrowUpRight aria-hidden="true" />
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
          <span className="eyebrow eyebrow--light">{pick('Keine Kategorie passt?', 'No category fits?')}</span>
          <h2>{pick('Zeigen Sie uns die Komponente.', 'Show us the component.')}</h2>
          <Link className="button button--light" to="/kontakt">
            {pick('Projekt beschreiben', 'Describe your project')} <ArrowUpRight aria-hidden="true" />
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
