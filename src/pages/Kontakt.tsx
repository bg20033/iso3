import { useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  FileUp,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  X,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { company, solutions } from '../data/site'
import {
  getContactPrefill,
  projectPriorities,
} from '../utils/contactPrefill'
import {
  formatFileSize,
  validateContactFiles,
} from '../utils/contactFiles'
import { createMailtoLink } from '../utils/mailto'

export default function Kontakt() {
  const [searchParams] = useSearchParams()
  const prefill = getContactPrefill(searchParams)
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<
    { kind: 'idle' | 'sending' | 'success' | 'error'; message?: string }
  >({ kind: 'idle' })
  const [fallbackLink, setFallbackLink] = useState('')
  const [startedAt] = useState(() => Date.now())

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const fileError = validateContactFiles(files)
    const request = {
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      application: String(data.get('application') ?? 'Allgemeine Anfrage'),
      priority: String(data.get('priority') ?? ''),
      temperature: String(data.get('temperature') ?? ''),
      message: String(data.get('message') ?? ''),
      attachments: files,
    }
    const link = createMailtoLink(request)
    setFallbackLink(link)

    if (fileError) {
      setStatus({ kind: 'error', message: fileError })
      return
    }

    setStatus({ kind: 'sending', message: 'Anfrage wird sicher übermittelt …' })
    try {
      data.set('startedAt', String(startedAt))
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      })
      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null

      if (!response.ok) {
        throw new Error(
          result?.message ||
            'Die Anfrage konnte momentan nicht übermittelt werden.',
        )
      }

      setStatus({
        kind: 'success',
        message:
          'Vielen Dank. Ihre Projektanfrage wurde an IsoMat übermittelt.',
      })
      setFiles([])
      form.reset()
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Die Anfrage konnte momentan nicht übermittelt werden.',
      })
    }
  }

  return (
    <>
      <PageHead
        index="03 · Kontakt"
        crumb="Kontakt"
        title="Ihre Anlage. Unsere nächste Massanfertigung."
        lead="Beschreiben Sie die Komponente und senden Sie Fotos, Zeichnungen oder Projektdokumente direkt und sicher an IsoMat."
      />

      <section className="section section--light">
        <div className="shell contact-layout">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="form-honeypot" aria-hidden="true">
              Website
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
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
            <div className="file-upload">
              <label htmlFor="attachments">
                <FileUp size={22} aria-hidden="true" />
                <span>
                  <b>Fotos, PDF oder CAD hinzufügen</b>
                  JPG, PNG, WebP, PDF, DWG oder DXF · max. 5 Dateien / 25 MB
                </span>
              </label>
              <input
                id="attachments"
                name="attachments"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf,.dwg,.dxf"
                multiple
                onChange={(event) => {
                  const selected = Array.from(event.currentTarget.files ?? [])
                  const error = validateContactFiles(selected)
                  setFiles(selected)
                  setStatus(
                    error
                      ? { kind: 'error', message: error }
                      : { kind: 'idle' },
                  )
                }}
              />
              {files.length > 0 && (
                <ul className="file-list" aria-label="Ausgewählte Dateien">
                  {files.map((file) => (
                    <li key={`${file.name}-${file.size}`}>
                      <Paperclip size={15} aria-hidden="true" />
                      <span>{file.name}</span>
                      <small>{formatFileSize(file.size)}</small>
                      <button
                        type="button"
                        className="file-list__remove"
                        aria-label={`Datei entfernen: ${file.name}`}
                        onClick={() => {
                          setFiles(
                            files.filter(
                              (entry) =>
                                entry.name !== file.name ||
                                entry.size !== file.size,
                            ),
                          )
                          setStatus({ kind: 'idle' })
                        }}
                      >
                        <X size={15} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label className="consent">
              <input name="consent" type="checkbox" value="accepted" required />
              <span>
                Ich habe den{' '}
                <Link to="/datenschutz">Datenschutzhinweis</Link> gelesen und
                stimme der Übermittlung meiner Anfrage und Anhänge zu.
              </span>
            </label>
            <button
              className="button button--signal"
              type="submit"
              disabled={status.kind === 'sending'}
            >
              {status.kind === 'sending' ? 'Wird gesendet …' : 'Anfrage senden'}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
            {status.kind !== 'idle' && (
              <div
                className={`form-status form-status--${status.kind}`}
                role={status.kind === 'error' ? 'alert' : 'status'}
              >
                <p>{status.message}</p>
                {status.kind === 'error' && fallbackLink && (
                  <a href={fallbackLink}>
                    Stattdessen E-Mail im eigenen Programm öffnen
                  </a>
                )}
              </div>
            )}
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
