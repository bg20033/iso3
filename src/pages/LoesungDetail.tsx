import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BlurText from '../components/BlurText'
import GlareHover from '../components/GlareHover'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { SolutionSidebar } from '../components/SolutionSidebar'
import SpotlightCard from '../components/SpotlightCard'
import { solutionBySlug, solutions } from '../data/site'

export default function LoesungDetail() {
  const { slug } = useParams()
  const solution = solutionBySlug(slug)

  if (!solution) return <Navigate to="/nicht-gefunden" replace />

  return (
    <>
      <section className="detail-hero">
        <div className="shell">
          <div className="detail-hero__content">
            <Link className="detail-back" to="/loesungen">
              <ArrowLeft size={17} aria-hidden="true" /> Alle Lösungen
            </Link>
            <span className="eyebrow">
              {solution.no} · {solution.eyebrow}
            </span>
            <BlurText as="h1" text={solution.title} />
            <p>{solution.summary}</p>
          </div>
          <div className="detail-hero__plate">
            <ResponsiveImage image={solution.featuredImage} eager />
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <SolutionSidebar
              solutions={solutions}
              activeSlug={solution.slug}
            />
          </aside>
          <div>
            <div className="detail-copy">
              <div>
                <span className="eyebrow">Anwendung</span>
                <BlurText text="Passend zur Anlage. Praktisch im Service." />
              </div>
              <div className="prose">
                {solution.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
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

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Massanfertigung anfragen</span>
          <h2>Zeigen Sie uns Ihre Komponente.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt beschreiben <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
