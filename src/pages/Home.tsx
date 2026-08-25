import { ArrowUpRight, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Category3DExplorer } from '../components/Category3DExplorer'
import { ReferenceDome } from '../components/ReferenceDome'
import { SolutionCircularGallery } from '../components/SolutionCircularGallery'
import { ComparisonMarquee } from '../components/ComparisonMarquee'
import { FaqAccordion } from '../components/FaqAccordion'
import {
  featuredReferences,
  heroImage,
} from '../data/site'
import { useLanguage, useLocalizedSite } from '../i18n'

export default function Home() {
  const { pick } = useLanguage()
  const { coreBenefits, generalFaqs, processSteps, solutions } = useLocalizedSite()
  return (
    <>
      <section className="landing-hero">
        {/*
          Breitendeskriptoren statt media-Quellen: Nur so wählt der Browser
          dasselbe Bild wie der Preload im <head> (siehe seo.ts) – sonst lädt
          er zwei Fassungen desselben Motivs.
        */}
        <picture className="landing-hero__media">
          <img
            src={heroImage.src}
            srcSet={heroImage.srcSet}
            sizes={heroImage.sizes}
            alt={pick('Industrieanlage mit Rohrleitungen, Armaturen und Metallkonstruktion', 'Industrial plant with pipework, valves and steel structures')}
            width={1451}
            height={1084}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <div className="shell landing-hero__inner">
          <div className="landing-hero__content">
            <span className="landing-hero__kicker">{pick('IsoMat · Isoliertechnik nach Mass', 'IsoMat · Made-to-measure insulation')}</span>
            <h1>{pick('Wärme im System. Zugang im Service.', 'Heat stays in. Access stays open.')}</h1>
            <p>
              {pick('Massgefertigte, abnehmbare Dämmkissen für industrielle Anlagen – konstruiert für Ihre Geometrie, Temperatur und Wartung.', 'Custom-made, removable insulation jackets for industrial plants – designed for your geometry, temperature and maintenance needs.')}
            </p>
            <div className="button-row">
              <a className="button button--signal" href="#modelle">
                {pick('Lösungen in 3D', 'Explore in 3D')} <ArrowUpRight aria-hidden="true" />
              </a>
              <Link className="button landing-hero__secondary" to="/kontakt">
                {pick('Projekt anfragen', 'Request a project')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <dl className="landing-proof" aria-label={pick('IsoMat auf einen Blick', 'IsoMat at a glance')}>
        <div><dt>{pick('Fertigung', 'Production')}</dt><dd>{pick('In Spreitenbach', 'In Spreitenbach')}</dd></div>
        <div><dt>{pick('Ausführung', 'Design')}</dt><dd>{pick('Jedes Teil ein Unikat', 'Every part is unique')}</dd></div>
        <div><dt>{pick('Wartung', 'Maintenance')}</dt><dd>{pick('Abnehmbar & wiederverwendbar', 'Removable & reusable')}</dd></div>
        <div><dt>{pick('Erfahrung', 'Experience')}</dt><dd>15+ {pick('Jahre', 'years')}</dd></div>
      </dl>

      <section className="section section--light">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">01 · {pick('Kategorien', 'Categories')}</span>
              <h2>{pick('Für jede Anlage die passende Form.', 'The right shape for every plant.')}</h2>
            </div>
            <p>
              {pick('Von einzelnen Ventilen bis zu kompletten Turbinen: ziehen Sie durch die Kategorien und öffnen Sie die Aufnahmen dazu.', 'From individual valves to complete turbines: drag through the categories and open the corresponding images.')}
            </p>
          </div>
          <SolutionCircularGallery solutions={solutions} bend={3} />
        </div>
      </section>

      <section className="section explorer-section" id="modelle">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">02 · {pick('Lösungen in 3D', 'Solutions in 3D')}</span>
              <h2>{pick('Sieben Bauteile. Eine klare Konstruktion.', 'Seven components. One clear design principle.')}</h2>
            </div>
            <p>
              {pick('Wählen Sie eine Kategorie, drehen Sie das Bauteil und nehmen Sie das Dämmkissen ab. Jede Form basiert auf einer typischen Anwendung.', 'Choose a category, rotate the component and remove the insulation jacket. Every shape is based on a typical application.')}
            </p>
          </div>
          <Category3DExplorer mode="hub" solutions={solutions} />
        </div>
      </section>

      {/* Five static comparisons, each shown once. */}
      <ComparisonMarquee />

      <section className="section section--metal">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">03 · {pick('Warum IsoMat', 'Why IsoMat')}</span>
              <h2>{pick('Für den Betrieb gebaut.', 'Built for operation.')}</h2>
            </div>
            <p>
              {pick('Eine technische Isolierung muss Energie sparen, Menschen schützen und bei der nächsten Revision wieder an ihren Platz passen.', 'Technical insulation must save energy, protect people and fit back into place after the next overhaul.')}
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
            <span className="eyebrow">04 · {pick('Prozess', 'Process')}</span>
            <h2>{pick('Vom Aufmass zum fertigen Dämmkissen.', 'From measurement to the finished jacket.')}</h2>
            <p>{pick('Fünf klare Schritte führen von der realen Anlage zur passgenauen Lösung.', 'Five clear steps lead from the real plant to a precision-fit solution.')}</p>
            <Link className="text-link" to="/ueber-uns">
              {pick('So arbeitet IsoMat', 'How IsoMat works')} <MoveRight aria-hidden="true" />
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
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">05 · {pick('Referenzen', 'References')}</span>
              <h2>{pick('Reale Anlagen. Reale Ausführungen.', 'Real plants. Real installations.')}</h2>
            </div>
            <p>{pick('Einblicke aus Energieanlagen, Heizungszentralen und Sonderbau.', 'Examples from energy plants, heating plants and custom projects.')}</p>
          </div>
          <ReferenceDome images={featuredReferences} />
        </div>
      </section>

      <section className="section section--light">
        <div className="shell faq-layout faq-layout--redesign">
          <div className="faq-intro">
            <span className="eyebrow">06 · {pick('Häufige Fragen', 'Frequently asked questions')}</span>
            <h2>{pick('Was Betreiber vor der Anfrage wissen wollen.', 'What operators want to know before enquiring.')}</h2>
            <p>{pick('Ein Anruf unter 056 245 16 28 klärt viele Fälle in wenigen Minuten.', 'A call to 056 245 16 28 resolves many questions in just a few minutes.')}</p>
          </div>
          <FaqAccordion entries={generalFaqs} />
        </div>
      </section>

      <section className="contact-band contact-band--redesign">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">{pick('Ihr Bauteil ist kein Standard?', 'Is your component anything but standard?')}</span>
          <h2>{pick('Dann sollte die Isolierung auch keine sein.', 'Then its insulation should be too.')}</h2>
          <Link className="button button--light" to="/kontakt">
            {pick('Projekt anfragen', 'Request a project')} <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
