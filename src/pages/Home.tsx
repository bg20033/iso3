import { ArrowUpRight, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BenefitGrid } from '../components/BenefitGrid'
import BlurText from '../components/BlurText'
import { HeroRings } from '../components/HeroRings'
import { ProcessTimeline } from '../components/ProcessTimeline'
import { ProjectQuickBrief } from '../components/ProjectQuickBrief'
import { ReferenceDome } from '../components/ReferenceDome'
import { SolutionCircularGallery } from '../components/SolutionCircularGallery'
import {
  coreBenefits,
  featuredReferences,
  processSteps,
  solutions,
} from '../data/site'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__grid" aria-hidden="true" />
        <HeroRings />

        <div className="shell hero__inner">
          <div className="hero__content">
            <span className="eyebrow">
              Industrielle Isoliertechnik · Spreitenbach
            </span>
            <BlurText
              as="h1"
              className="hero__title"
              text="Wärme schützen. Zugang behalten."
            />
            <p className="hero__lead">
              Massgefertigte Dämmkissen für komplexe Industrieanlagen –
              abnehmbar, wiederverwendbar und exakt auf Ihre Komponenten
              abgestimmt.
            </p>
            <div className="button-row">
              <Link className="button button--signal" to="/loesungen">
                Lösungen entdecken <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="button button--outline-light" to="/kontakt">
                Projekt besprechen
              </Link>
            </div>
            <ul className="hero__proof" aria-label="Produktvorteile">
              <li>Passgenau</li>
              <li>Abnehmbar</li>
              <li>Wiederverwendbar</li>
              <li>Wartungsfreundlich</li>
            </ul>
          </div>

          <figure className="hero__plate">
            <div className="hero__plate-image">
              <img
                src="/hero-industrial.webp"
                alt="Isolierte Rohrleitungen und Armaturen in einer Heizzentrale"
                width="1600"
                height="900"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <figcaption>
              <span>
                <b>Heizzentrale</b> · Dampf- und Kondensatführung
              </span>
              <span>Aufnahme aus dem IsoMat-Archiv</span>
            </figcaption>
          </figure>
        </div>

        <nav className="hero__register" aria-label="Lösungsbereiche">
          {solutions.map((solution) => (
            <Link to={`/loesungen/${solution.slug}`} key={solution.slug}>
              <span>{solution.no}</span>
              {solution.shortTitle}
            </Link>
          ))}
        </nav>
      </section>

      <section className="section section--light">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 · Lösungen</span>
              <BlurText text="Für jede Anlage die passende Form." />
            </div>
            <p>
              Von einzelnen Ventilen bis zu kompletten Turbinen: Konstruktion,
              Material und Befestigung richten sich nach Ihrer Anwendung.
            </p>
          </div>
          <SolutionCircularGallery solutions={solutions} bend={3} />
        </div>
      </section>

      <section className="section section--metal">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 · Warum IsoMat</span>
              <BlurText text="Dämmung, die im Betrieb mitdenkt." />
            </div>
            <p>
              Die Isolierung bleibt nicht nur dauerhaft an der Anlage – sie
              berücksichtigt auch den nächsten Serviceeinsatz.
            </p>
          </div>
          <BenefitGrid benefits={coreBenefits} />
        </div>
      </section>

      <section className="section section--graphite">
        <div className="shell process-layout">
          <div className="process-intro">
            <span className="eyebrow">03 · Prozess</span>
            <BlurText text="Vom Bauteil zum passgenauen Dämmkissen." />
            <p>
              Jede Lösung entsteht aus den realen Betriebsbedingungen und der
              Geometrie Ihrer Anlage.
            </p>
            <Link className="text-link" to="/ueber-uns">
              So arbeitet IsoMat <MoveRight aria-hidden="true" />
            </Link>
          </div>
          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      <ProjectQuickBrief />

      <section className="section section--black">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">05 · Referenzen</span>
              <BlurText text="In Anlagen. Im Einsatz. Für Wartung bereit." />
            </div>
            <p>
              Reale Anwendungen aus Heizungszentralen, Energieanlagen und
              industriellem Sonderbau.
            </p>
          </div>
          <ReferenceDome images={featuredReferences} />
        </div>
      </section>

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">
            Ihr Bauteil ist kein Standard?
          </span>
          <h2>Dann sollte die Isolierung auch keiner sein.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt anfragen <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
