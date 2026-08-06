import { ArrowUpRight, Check, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BeforeAfterSlider } from '../components/BeforeAfterSlider'
import { Category3DExplorer } from '../components/Category3DExplorer'
import { FaqAccordion } from '../components/FaqAccordion'
import { ResponsiveImage } from '../components/ResponsiveImage'
import {
  coreBenefits,
  featuredReferences,
  generalFaqs,
  processSteps,
  solutions,
} from '../data/site'

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

export default function Home() {
  return (
    <>
      <section className="landing-hero">
        <picture className="landing-hero__media">
          <source media="(max-width: 640px)" srcSet="/hero-industrial-640.webp" />
          <source media="(max-width: 900px)" srcSet="/hero-industrial-800.webp" />
          <source media="(max-width: 1440px)" srcSet="/hero-industrial-1200.webp" />
          <img
            src="/hero-industrial.webp"
            alt="Industrieanlage mit Rohrleitungen, Armaturen und Metallkonstruktion"
            width="1452"
            height="1088"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <div className="shell landing-hero__inner">
          <div className="landing-hero__content">
            <span className="landing-hero__kicker">IsoMat · Isoliertechnik nach Mass</span>
            <h1>Wärme im System. Zugang im Service.</h1>
            <p>
              Massgefertigte, abnehmbare Dämmkissen für industrielle Anlagen –
              konstruiert für Ihre Geometrie, Temperatur und Wartung.
            </p>
            <div className="button-row">
              <a className="button button--signal" href="#modelle">
                Lösungen in 3D <ArrowUpRight aria-hidden="true" />
              </a>
              <Link className="button landing-hero__secondary" to="/kontakt">
                Projekt anfragen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <dl className="landing-proof" aria-label="IsoMat auf einen Blick">
        <div><dt>Fertigung</dt><dd>In Spreitenbach</dd></div>
        <div><dt>Ausführung</dt><dd>Jedes Teil ein Unikat</dd></div>
        <div><dt>Wartung</dt><dd>Abnehmbar & wiederverwendbar</dd></div>
        <div><dt>Erfahrung</dt><dd>15+ Jahre</dd></div>
      </dl>

      <section className="section explorer-section" id="modelle">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">01 · Lösungen in 3D</span>
              <h2>Sieben Bauteile. Eine klare Konstruktion.</h2>
            </div>
            <p>
              Wählen Sie eine Kategorie, drehen Sie das Bauteil und nehmen Sie
              das Dämmkissen ab. Jede Form basiert auf einer typischen Anwendung.
            </p>
          </div>
          <Category3DExplorer mode="hub" solutions={solutions} />
        </div>
      </section>

      <section className="section section--light comparison-section">
        <div className="shell comparison-section__grid">
          <div className="comparison-section__copy">
            <span className="eyebrow">02 · Vorher / Nachher</span>
            <h2>Weniger Verlust. Derselbe Zugang.</h2>
            <p>
              Die Isolierung folgt dem Bauteil – nicht umgekehrt. Aussparungen,
              Teilungen und Verschlüsse bleiben dort, wo sie im Service erreichbar sind.
            </p>
            <ul>
              {solutions[0].benefits.slice(0, 3).map((benefit) => (
                <li key={benefit}><Check aria-hidden="true" />{benefit}</li>
              ))}
            </ul>
            <Link className="text-link" to="/produkte/ventile">
              Ventile & Armaturen <MoveRight aria-hidden="true" />
            </Link>
          </div>
          <BeforeAfterSlider before={beforeImage} after={afterImage} />
        </div>
      </section>

      <section className="section section--metal">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">03 · Warum IsoMat</span>
              <h2>Für den Betrieb gebaut.</h2>
            </div>
            <p>
              Eine technische Isolierung muss Energie sparen, Menschen schützen
              und bei der nächsten Revision wieder an ihren Platz passen.
            </p>
          </div>
          <div className="home-benefits">
            {coreBenefits.map((benefit, index) => (
              <article key={benefit.title}>
                <span>0{index + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell process-section__grid">
          <div className="process-section__intro">
            <span className="eyebrow">04 · Prozess</span>
            <h2>Vom Aufmass zum fertigen Dämmkissen.</h2>
            <p>Fünf klare Schritte führen von der realen Anlage zur passgenauen Lösung.</p>
            <Link className="text-link" to="/ueber-uns">
              So arbeitet IsoMat <MoveRight aria-hidden="true" />
            </Link>
          </div>
          <ol className="process-steps">
            {processSteps.map(([no, title, text]) => (
              <li key={no}>
                <span>{no}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--black references-section">
        <div className="shell">
          <div className="section-heading section-heading--redesign section-heading--dark">
            <div>
              <span className="eyebrow">05 · Referenzen</span>
              <h2>Reale Anlagen. Reale Ausführungen.</h2>
            </div>
            <p>Einblicke aus Energieanlagen, Heizungszentralen und Sonderbau.</p>
          </div>
          <div className="reference-grid-redesign">
            {featuredReferences.slice(0, 6).map((image, index) => (
              <a href={image.src} target="_blank" rel="noreferrer" key={image.src}>
                <ResponsiveImage image={image} />
                <span>{String(index + 1).padStart(2, '0')} · Aufnahme öffnen</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="shell faq-layout faq-layout--redesign">
          <div className="faq-intro">
            <span className="eyebrow">06 · Häufige Fragen</span>
            <h2>Was Betreiber vor der Anfrage wissen wollen.</h2>
            <p>Ein Anruf unter 056 245 16 28 klärt viele Fälle in wenigen Minuten.</p>
          </div>
          <FaqAccordion entries={generalFaqs} />
        </div>
      </section>

      <section className="contact-band contact-band--redesign">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Ihr Bauteil ist kein Standard?</span>
          <h2>Dann sollte die Isolierung auch keine sein.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt anfragen <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
