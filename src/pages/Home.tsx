import { ArrowUpRight, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BenefitGrid } from '../components/BenefitGrid'
import BlurText from '../components/BlurText'
import { IndustrialVelocity } from '../components/IndustrialVelocity'
import { ProcessStory } from '../components/ProcessStory'
import { ProjectQuickBrief } from '../components/ProjectQuickBrief'
import { ReferenceDome } from '../components/ReferenceDome'
import ScrollReveal from '../components/ScrollReveal'
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
        <picture className="hero__backdrop">
          <source
            media="(max-width: 800px)"
            srcSet="/hero-valve-industrial-768.webp"
          />
          <source
            media="(max-width: 1280px)"
            srcSet="/hero-valve-industrial-1280.webp"
          />
          <img
            src="/hero-valve-industrial.webp"
            alt="Industrieventil mit silbernem IsoMat-Dämmkissen"
            width="1672"
            height="941"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <div className="shell hero__inner">
          <div className="hero__content">
            <BlurText
              as="h1"
              className="hero__brand-title"
              text="IsoMat"
              animateBy="letters"
              delay={85}
            />
          </div>
        </div>
      </section>

      <IndustrialVelocity />

      <section className="section section--light">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 · Lösungen</span>
              <ScrollReveal>
                Für jede Anlage die passende Form.
              </ScrollReveal>
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
          <ProcessStory steps={processSteps} />
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
