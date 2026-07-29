import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BlurText from '../components/BlurText'
import GlareHover from '../components/GlareHover'
import ReflectiveCard from '../components/ReflectiveCard'
import { ResponsiveImage } from '../components/ResponsiveImage'
import ScrollReveal from '../components/ScrollReveal'
import { SolutionSidebar } from '../components/SolutionSidebar'
import SpotlightCard from '../components/SpotlightCard'
import { useInteractiveVisuals } from '../components/useInteractiveVisuals'
import {
  productPath,
  solutionBySlug,
  solutions,
} from '../data/site'

export default function LoesungDetail() {
  const { slug } = useParams()
  const solution = solutionBySlug(slug)
  const interactive = useInteractiveVisuals()

  if (!solution) return <Navigate to="/nicht-gefunden" replace />
  const related = solution.relatedSlugs
    .map((relatedSlug) => solutionBySlug(relatedSlug))
    .filter((item) => item !== undefined)

  return (
    <>
      <section className="detail-hero">
        <div className="shell">
          <div className="detail-hero__content">
            <nav className="crumbs detail-crumbs" aria-label="Brotkrumen">
              <Link to="/">Start</Link>
              <span aria-hidden="true">/</span>
              <Link to="/loesungen">Lösungen</Link>
              <span aria-hidden="true">/</span>
              <span>{solution.shortTitle}</span>
            </nav>
            <span className="eyebrow">
              {solution.no} · {solution.eyebrow}
            </span>
            <BlurText as="h1" text={solution.title} />
            <p>{solution.summary}</p>
          </div>
          <div className="detail-hero__plate">
            <ResponsiveImage image={solution.featuredImage} eager />
            <div className="detail-hero__scan" aria-hidden="true" />
            <span className="detail-hero__code" aria-hidden="true">
              ISO · {solution.no} / MASSANFERTIGUNG
            </span>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <SolutionSidebar
              solutions={solutions}
              activeSlug={solution.slug}
              label="Lösungen"
            />
          </aside>
          <div>
            <div className="detail-copy">
              <div>
                <span className="eyebrow">Anwendung</span>
                <ScrollReveal>
                  Passend zur Anlage. Praktisch im Service.
                </ScrollReveal>
              </div>
              <div className="detail-story">
                <article className="detail-story__block">
                  <span>01 · Ausgangslage</span>
                  <p>{solution.problem}</p>
                </article>
                <article className="detail-story__block">
                  <span>02 · IsoMat Lösung</span>
                  <p>{solution.approach}</p>
                </article>
              </div>
            </div>

            <div className="detail-benefits">
              <span className="eyebrow">Vorteile</span>
              <div className="detail-benefit-grid">
                {solution.benefits.map((benefit, index) => (
                  <SpotlightCard
                    className="detail-benefit-card"
                    spotlightColor="rgba(214, 38, 34, 0.12)"
                    key={benefit}
                  >
                    <span>0{index + 1}</span>
                    <p>{benefit}</p>
                  </SpotlightCard>
                ))}
              </div>
            </div>

            <article className="detail-applications">
              <span className="eyebrow">Typische Komponenten</span>
              <div className="tag-list">
                {solution.applications.map((application) => (
                  <span key={application}>{application}</span>
                ))}
              </div>
            </article>

            <section className="detail-faq" aria-labelledby="faq-title">
              <div className="detail-faq__heading">
                <span className="eyebrow">Projektwissen</span>
                <h2 id="faq-title">Häufige Fragen</h2>
              </div>
              <div className="faq-list">
                {solution.faqs.map((faq, index) => (
                  <details key={faq.question}>
                    <summary>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {faq.question}
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="section section--black">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Referenzen</span>
              <BlurText text={`Einblicke: ${solution.title}`} />
            </div>
            <p>{solution.gallery.length} reale Aufnahmen aus dem IsoMat-Archiv.</p>
          </div>
          <div className="photo-grid">
            {solution.gallery.map((image, index) => (
              <GlareHover
                width="100%"
                height="100%"
                background="#eceeef"
                borderRadius="0"
                borderColor="#d2d6d8"
                glareColor="#ffffff"
                glareOpacity={0.24}
                glareAngle={-38}
                glareSize={180}
                transitionDuration={700}
                className={index % 7 === 0 ? 'photo-grid__wide' : undefined}
                key={image.src}
              >
                <a
                  href={image.src}
                  className="photo-card"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${image.alt} vergrössern`}
                >
                  <ResponsiveImage image={image} />
                  <span>Aufnahme öffnen ↗</span>
                </a>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--metal related-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Verwandte Lösungen</span>
              <h2>Weitere Komponenten im System.</h2>
            </div>
            <Link className="text-link" to="/loesungen">
              Alle Lösungen <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <ReflectiveCard
                className="related-card"
                disabled={!interactive}
                key={item.slug}
              >
                <Link to={productPath(item)}>
                  <ResponsiveImage image={item.featuredImage} />
                  <span>{item.no}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <b>Details öffnen ↗</b>
                </Link>
              </ReflectiveCard>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Massanfertigung anfragen</span>
          <h2>Zeigen Sie uns Ihre Komponente.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt beschreiben <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link className="detail-back detail-back--light" to="/loesungen">
            <ArrowLeft size={17} aria-hidden="true" /> Alle Lösungen
          </Link>
        </div>
      </section>
    </>
  )
}
