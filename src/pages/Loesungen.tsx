import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { BeforeAfterSlider } from '../components/BeforeAfterSlider'
import { FaqAccordion } from '../components/FaqAccordion'
import { PageHead } from '../components/PageHead'
import { PageIndex, type PageIndexItem } from '../components/PageIndex'
import ReflectiveCard from '../components/ReflectiveCard'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { SolutionModal } from '../components/SolutionModal'
import { useInteractiveVisuals } from '../components/useInteractiveVisuals'
import { solutionBySlug, solutions, type Solution } from '../data/site'

const lead = solutions.find((item) => item.slug === 'ventile-armaturen')!
const others = solutions.filter((item) => item.slug !== lead.slug)

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

const indexItems: PageIndexItem[] = [
  { id: 'vergleich', label: 'Vergleich' },
  { id: 'aufbau', label: 'Aufbau' },
  { id: 'vorteile', label: 'Vorteile' },
  { id: 'komponenten', label: 'Komponenten' },
  { id: 'fragen', label: 'Fragen' },
  { id: 'weitere', label: 'Weitere Bauteile' },
]

/** Wie ein Kissen für ein Ventil entsteht – drei Schritte, drei Entscheidungen. */
const buildSteps = [
  {
    no: '01',
    title: 'Aufmass am eingebauten Bauteil',
    text: 'Gemessen wird dort, wo das Ventil steht: Körper, Antrieb, Anschlüsse und der Platz, der für die Bedienung frei bleiben muss. Aus dieser Aufnahme entsteht der Schnitt.',
  },
  {
    no: '02',
    title: 'Segmentierung nach Wartungszugang',
    text: 'Die Teilung folgt nicht der Geometrie, sondern dem Serviceablauf. Wer den Antrieb prüfen muss, soll nur das Segment lösen, das im Weg ist – nicht die ganze Isolierung.',
  },
  {
    no: '03',
    title: 'Verschlüsse und Kennzeichnung',
    text: 'Spannverschlüsse sitzen dort, wo man im eingebauten Zustand hinkommt. Jedes Element wird beschriftet, damit es nach der Revision wieder an seinen Platz findet.',
  },
]

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

      <div className="spec-strip">
        <dl className="shell spec-strip__inner">
          <div>
            <dt>Aufnahmen im Archiv</dt>
            <dd>{lead.gallery.length}</dd>
          </div>
          <div>
            <dt>Typische Komponenten</dt>
            <dd>{lead.applications.length}</dd>
          </div>
          <div>
            <dt>Fertigung</dt>
            <dd>Einzelstück</dd>
          </div>
          <div>
            <dt>Nach der Wartung</dt>
            <dd>Wiederverwendbar</dd>
          </div>
        </dl>
      </div>

      <section className="section section--light solutions-page">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <PageIndex items={indexItems} label="Auf dieser Seite" />
          </aside>

          <div className="solutions-page__body">
            {/* --- Vergleich ------------------------------------------- */}
            <article className="page-block" id="vergleich">
              <header className="page-block__head">
                <span className="eyebrow">01 · Vorher / Nachher</span>
                <h2>Wärme schützen. Zugang behalten.</h2>
                <p>{lead.summary}</p>
              </header>

              <div className="ventile-focus__layout">
                <BeforeAfterSlider before={beforeImage} after={afterImage} />

                <ReflectiveCard
                  className="ventile-focus__content"
                  disabled={!interactive}
                >
                  <span className="eyebrow">{lead.eyebrow}</span>
                  <h3>{lead.title}</h3>
                  <p>{lead.paragraphs[1]}</p>

                  <ul className="ventile-focus__benefits">
                    {lead.benefits.map((benefit) => (
                      <li key={benefit}>
                        <Check aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="ventile-focus__actions">
                    <button
                      className="button"
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`Alle Aufnahmen: ${lead.title}`}
                      onClick={() => openModal(lead)}
                    >
                      Alle Aufnahmen
                      <ArrowUpRight aria-hidden="true" />
                    </button>
                    <span>{lead.gallery.length} reale Aufnahmen</span>
                  </div>
                </ReflectiveCard>
              </div>
            </article>

            {/* --- Aufbau ---------------------------------------------- */}
            <article className="page-block" id="aufbau">
              <header className="page-block__head">
                <span className="eyebrow">02 · Aufbau</span>
                <h2>Drei Entscheidungen pro Ventil.</h2>
                <p>
                  Ein Dämmkissen für eine Armatur wird nicht zugeschnitten,
                  sondern konstruiert. Drei Festlegungen bestimmen, ob es im
                  Betrieb taugt.
                </p>
              </header>

              <ol className="build-steps">
                {buildSteps.map((step) => (
                  <li key={step.no}>
                    <span className="build-steps__no">{step.no}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>

            {/* --- Vorteile -------------------------------------------- */}
            <article className="page-block" id="vorteile">
              <header className="page-block__head">
                <span className="eyebrow">03 · Vorteile</span>
                <h2>Was sich im Betrieb ändert.</h2>
              </header>

              <div className="value-grid">
                {lead.benefits.map((benefit, index) => (
                  <div className="value-grid__item" key={benefit}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* --- Komponenten ----------------------------------------- */}
            <article className="page-block" id="komponenten">
              <header className="page-block__head">
                <span className="eyebrow">04 · Komponenten</span>
                <h2>Typische Bauteile in dieser Kategorie.</h2>
                <p>
                  Steht Ihr Bauteil nicht in der Liste, ist das kein
                  Ausschlusskriterium – es bedeutet nur, dass wir es noch nicht
                  fotografiert haben.
                </p>
              </header>

              <ul className="component-list">
                {lead.applications.map((application, index) => (
                  <li key={application}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {application}
                  </li>
                ))}
              </ul>
            </article>

            {/* --- Fragen ---------------------------------------------- */}
            <article className="page-block" id="fragen">
              <header className="page-block__head">
                <span className="eyebrow">05 · Fragen</span>
                <h2>Zu dieser Kategorie.</h2>
              </header>
              <FaqAccordion entries={lead.faqs} />
            </article>

            {/* --- Weitere Bauteile ------------------------------------ */}
            <article className="page-block" id="weitere">
              <header className="page-block__head">
                <span className="eyebrow">06 · Weitere Bauteile</span>
                <h2>Sechs weitere Kategorien.</h2>
                <p>
                  Derselbe Ansatz, andere Geometrie. Jede Kategorie öffnet die
                  Aufnahmen aus dem Archiv.
                </p>
              </header>

              <div className="category-rows">
                {others.map((solution) => (
                  <button
                    className="category-row"
                    type="button"
                    key={solution.slug}
                    aria-haspopup="dialog"
                    aria-label={`${solution.title} öffnen`}
                    onClick={() => openModal(solution)}
                  >
                    <span className="category-row__no">{solution.no}</span>
                    <span className="category-row__media">
                      <ResponsiveImage image={solution.featuredImage} />
                    </span>
                    <span className="category-row__body">
                      <strong>{solution.title}</strong>
                      <small>{solution.eyebrow}</small>
                    </span>
                    <span className="category-row__count">
                      {solution.gallery.length} Aufnahmen
                    </span>
                    <ArrowUpRight
                      className="category-row__arrow"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>

              <p className="page-block__note">
                Keine der sieben Kategorien passt? Dann ist Ihr Bauteil ein
                Fall für den Sonderbau –{' '}
                <Link to="/kontakt">senden Sie uns ein Foto</Link>.
              </p>
            </article>
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
