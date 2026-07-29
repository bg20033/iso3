import type { FormEvent } from 'react'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { company, solutions } from '../data/site'
import {
  getContactPrefill,
  projectPriorities,
} from '../utils/contactPrefill'
import { createMailtoLink } from '../utils/mailto'

export default function Kontakt() {
  const [searchParams] = useSearchParams()
  const prefill = getContactPrefill(searchParams)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const link = createMailtoLink({
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      application: String(data.get('application') ?? 'Allgemeine Anfrage'),
      priority: String(data.get('priority') ?? ''),
      temperature: String(data.get('temperature') ?? ''),
      message: String(data.get('message') ?? ''),
    })
    window.location.assign(link)
  }

  return (
    <>
      <PageHead
        index="03 · Kontakt"
        crumb="Kontakt"
        title="Ihre Anlage. Unsere nächste Massanfertigung."
        lead="Beschreiben Sie die Komponente und die Betriebsbedingungen. Das Formular öffnet eine vorbereitete E-Mail an IsoMat."
      />

      <section className="section section--light">
        <div className="shell contact-layout">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Name *</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                <span>Firma</span>
                <input name="company" autoComplete="organization" />
              </label>
              <label>
                <span>E-Mail *</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>Telefon</span>
                <input name="phone" type="tel" autoComplete="tel" />
              </label>
              <label>
                <span>Anwendung *</span>
                <select
                  name="application"
                  required
                  defaultValue={prefill.application}
                >
                  <option value="" disabled>
                    Bitte auswählen
                  </option>
                  {solutions.map((solution) => (
                    <option value={solution.title} key={solution.slug}>
                      {solution.title}
                    </option>
                  ))}
                  <option value="Andere Anwendung">Andere Anwendung</option>
                </select>
              </label>
              <label>
                <span>Priorität</span>
                <select name="priority" defaultValue={prefill.priority}>
                  <option value="">Bitte auswählen</option>
                  {projectPriorities.map((priority) => (
                    <option value={priority} key={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Betriebstemperatur</span>
                <input
                  name="temperature"
                  defaultValue={prefill.temperature}
                  maxLength={40}
                  placeholder="z. B. 280 °C"
                />
              </label>
            </div>
            <label>
              <span>Projektbeschreibung *</span>
              <textarea
                name="message"
                rows={7}
                placeholder="Komponente, Abmessungen, Einbausituation, Wartungszugang …"
                required
              />
            </label>
            <label className="consent">
              <input type="checkbox" required />
              <span>
                Ich habe den Hinweis zum E-Mail-Versand gelesen. Die Website
                speichert die Eingaben nicht.
              </span>
            </label>
            <button className="button button--signal" type="submit">
              E-Mail vorbereiten <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </form>

          <aside className="contact-aside">
            <div className="contact-card">
              <span className="eyebrow eyebrow--light">Direktkontakt</span>
              <h2>IsoMat GmbH</h2>
              <a href={`tel:${company.phoneHref}`}>
                <Phone size={19} aria-hidden="true" />
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`}>
                <Mail size={19} aria-hidden="true" />
                {company.email}
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kesselstrasse+11%2C+8957+Spreitenbach"
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={19} aria-hidden="true" />
                <span>
                  {company.street}
                  <br />
                  {company.city}
                </span>
              </a>
            </div>
            <ResponsiveImage image={solutions[1].featuredImage} />
          </aside>
        </div>
      </section>
    </>
  )
}
