import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { BeforeAfterSlider } from '../components/BeforeAfterSlider'
import { PageHead } from '../components/PageHead'
import ReflectiveCard from '../components/ReflectiveCard'
import { SolutionModal } from '../components/SolutionModal'
import { useInteractiveVisuals } from '../components/useInteractiveVisuals'
import {
  solutionBySlug,
  solutions,
  type Solution,
} from '../data/site'

// Temporary focus for the public Lösungen index. The other six solutions stay
// in site.ts and remain available through their direct modal URLs.
const visibleSolutions = solutions.filter(
  (solution) => solution.slug === 'ventile-armaturen',
)

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
        index="01 · Ventile & Armaturen"
        crumb="Lösungen"
        title="Dämmkissen für Ventile & Armaturen."
        lead="Passgenau gefertigt, für Wartung abnehmbar und exakt auf Geometrie, Temperatur und Zugänglichkeit der Komponente abgestimmt."
      />

      <section className="section section--light ventile-focus">
        <div className="shell">
          {visibleSolutions.map((solution) => (
            <article className="ventile-focus__article" key={solution.slug}>
              <div className="ventile-focus__heading">
                <div>
                  <span className="eyebrow">
                    {solution.no} · Vorher / Nachher
                  </span>
                  <h2>Wärme schützen. Zugang behalten.</h2>
                </div>
                <p>{solution.summary}</p>
              </div>

              <div className="ventile-focus__layout">
                <BeforeAfterSlider before={beforeImage} after={afterImage} />

                <ReflectiveCard
                  className="ventile-focus__content"
                  disabled={!interactive}
                >
                  <span className="eyebrow">{solution.eyebrow}</span>
                  <h3>{solution.title}</h3>
                  <p>{solution.paragraphs[1]}</p>

                  <ul className="ventile-focus__benefits">
                    {solution.benefits.map((benefit) => (
                      <li key={benefit}>
                        <Check aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="solution-card__tags">
                    {solution.applications.map((application) => (
                      <span key={application}>{application}</span>
                    ))}
                  </div>

                  <div className="ventile-focus__actions">
                    <button
                      className="button"
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`Mehr erfahren: ${solution.title}`}
                      onClick={() => openModal(solution)}
                    >
                      Mehr erfahren
                      <ArrowUpRight aria-hidden="true" />
                    </button>
                    <span>{solution.gallery.length} reale Aufnahmen</span>
                  </div>
                </ReflectiveCard>
              </div>

              <div
                className="ventile-focus__rail"
                aria-label="Technische Vorteile"
              >
                <div>
                  <span>01</span>
                  <strong>Passgenaue Form</strong>
                </div>
                <div>
                  <span>02</span>
                  <strong>Antrieb bleibt zugänglich</strong>
                </div>
                <div>
                  <span>03</span>
                  <strong>Für Wartung abnehmbar</strong>
                </div>
              </div>
            </article>
          ))}
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
