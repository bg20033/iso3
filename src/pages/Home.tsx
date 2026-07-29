import { ArrowUpRight, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlurText } from '../components/BlurText'
import { CircularGallery } from '../components/CircularGallery'
import { DomeGallery } from '../components/DomeGallery'
import { MagicRings } from '../components/MagicRings'
import { Reveal } from '../components/Reveal'
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
        <MagicRings />
        <div className="hero__image" aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />
        <div className="shell hero__content">
          <span className="eyebrow eyebrow--light">Industrielle Isoliertechnik · Spreitenbach</span>
          <BlurText
            as="h1"
            className="hero__title"
            text="Wärme schützen. Zugang behalten."
          />
          <p className="hero__lead">
            Massgefertigte Dämmkissen für komplexe Industrieanlagen – abnehmbar,
            wiederverwendbar und exakt auf Ihre Komponenten abgestimmt.
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
        <div className="hero__index" aria-hidden="true">
          ISO / MAT <span>01</span>
        </div>
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
          <CircularGallery solutions={solutions} bend={3} />
        </div>
      </section>

      <section className="section section--graphite">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <div>
              <span className="eyebrow eyebrow--light">02 · Warum IsoMat</span>
              <BlurText text="Dämmung, die im Betrieb mitdenkt." />
            </div>
            <p>
              Die Isolierung bleibt nicht nur dauerhaft an der Anlage – sie
              berücksichtigt auch den nächsten Serviceeinsatz.
            </p>
          </div>
          <div className="benefit-grid">
            {coreBenefits.map((benefit, index) => (
              <Reveal delay={index * 60} key={benefit.title}>
                <article className="benefit-card">
                  <span>0{index + 1}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--metal">
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
          <ol className="process-list">
            {processSteps.map(([no, title, text]) => (
              <li key={no}>
                <span>{no}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--black">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <div>
              <span className="eyebrow eyebrow--light">04 · Referenzen</span>
              <BlurText text="In Anlagen. Im Einsatz. Für Wartung bereit." />
            </div>
            <p>
              Reale Anwendungen aus Heizungszentralen, Energieanlagen und
              industriellem Sonderbau.
            </p>
          </div>
          <DomeGallery images={featuredReferences} />
        </div>
      </section>

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Ihr Bauteil ist kein Standard?</span>
          <h2>Dann sollte die Isolierung auch keiner sein.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt anfragen <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
