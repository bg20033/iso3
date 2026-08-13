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
import { company } from '../data/site'
import { useLanguage, useLocalizedSite } from '../i18n'
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
  const { language, pick } = useLanguage()
  const { solutions } = useLocalizedSite()
  const [searchParams] = useSearchParams()
  const prefill = getContactPrefill(searchParams)
  const requestedApplication = searchParams.get('application') ?? ''
  const applicationDefault = solutions.some((solution) => solution.title === requestedApplication)
    ? requestedApplication
    : prefill.application
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
      application: String(data.get('application') ?? pick('Allgemeine Anfrage', 'General enquiry')),
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

    setStatus({ kind: 'sending', message: pick('Anfrage wird sicher übermittelt …', 'Your enquiry is being sent securely …') })
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
            pick('Die Anfrage konnte momentan nicht übermittelt werden.', 'Your enquiry could not be sent at the moment.'),
        )
      }

      setStatus({
        kind: 'success',
        message:
          pick('Vielen Dank. Ihre Projektanfrage wurde an IsoMat übermittelt.', 'Thank you. Your project enquiry has been sent to IsoMat.'),
      })
      setFiles([])
      form.reset()
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : pick('Die Anfrage konnte momentan nicht übermittelt werden.', 'Your enquiry could not be sent at the moment.'),
      })
    }
  }

  return (
    <>
      <PageHead
        index={pick('03 · Kontakt', '03 · Contact')}
        crumb={pick('Kontakt', 'Contact')}
        title={pick('Ihre Anlage. Unsere nächste Massanfertigung.', 'Your plant. Our next custom solution.')}
        lead={pick('Beschreiben Sie die Komponente und senden Sie Fotos, Zeichnungen oder Projektdokumente direkt und sicher an IsoMat.', 'Describe the component and send photos, drawings or project documents directly and securely to IsoMat.')}
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
                <span>{pick('Firma', 'Company')}</span>
                <input name="company" autoComplete="organization" />
              </label>
              <label>
                <span>E-Mail *</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>{pick('Telefon', 'Phone')}</span>
                <input name="phone" type="tel" autoComplete="tel" />
              </label>
              <label>
                <span>{pick('Anwendung *', 'Application *')}</span>
                <select
                  name="application"
                  required
                  defaultValue={applicationDefault}
                >
                  <option value="" disabled>
                    {pick('Bitte auswählen', 'Please select')}
                  </option>
                  {solutions.map((solution) => (
                    <option value={solution.title} key={solution.slug}>
                      {solution.title}
                    </option>
                  ))}
                  <option value="Andere Anwendung">{pick('Andere Anwendung', 'Other application')}</option>
                </select>
              </label>
              <label>
                <span>{pick('Priorität', 'Priority')}</span>
                <select name="priority" defaultValue={prefill.priority}>
                  <option value="">{pick('Bitte auswählen', 'Please select')}</option>
                  {projectPriorities.map((priority) => (
                    <option value={priority} key={priority}>
                      {language === 'de' ? priority : ({
                        'Energieeffizienz': 'Energy efficiency',
                        'Berührungsschutz': 'Contact protection',
                        'Wartungszugang': 'Maintenance access',
                        'Sondergeometrie': 'Custom geometry',
                      } as Record<string, string>)[priority] ?? priority}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{pick('Betriebstemperatur', 'Operating temperature')}</span>
                <input
                  name="temperature"
                  defaultValue={prefill.temperature}
                  maxLength={40}
                  placeholder={pick('z. B. 280 °C', 'e.g. 280 °C')}
                />
              </label>
            </div>
            <label>
              <span>{pick('Projektbeschreibung *', 'Project description *')}</span>
              <textarea
                name="message"
                rows={7}
                placeholder={pick('Komponente, Abmessungen, Einbausituation, Wartungszugang …', 'Component, dimensions, installation situation, maintenance access …')}
                required
              />
            </label>
            <div className="file-upload">
              <label htmlFor="attachments">
                <FileUp size={22} aria-hidden="true" />
                <span>
                  <b>{pick('Fotos, PDF oder CAD hinzufügen', 'Add photos, PDF or CAD')}</b>
                  JPG, PNG, WebP, PDF, DWG {pick('oder', 'or')} DXF · max. 5 {pick('Dateien', 'files')} / 25 MB
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
                <ul className="file-list" aria-label={pick('Ausgewählte Dateien', 'Selected files')}>
                  {files.map((file) => (
                    <li key={`${file.name}-${file.size}`}>
                      <Paperclip size={15} aria-hidden="true" />
                      <span>{file.name}</span>
                      <small>{formatFileSize(file.size)}</small>
                      <button
                        type="button"
                        className="file-list__remove"
                        aria-label={`${pick('Datei entfernen', 'Remove file')}: ${file.name}`}
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
                {pick('Ich habe den', 'I have read the')}{' '}
                <Link to="/datenschutz">{pick('Datenschutzhinweis', 'privacy notice')}</Link>{' '}
                {pick('gelesen und stimme der Übermittlung meiner Anfrage und Anhänge zu.', 'and agree to the transmission of my enquiry and attachments.')}
              </span>
            </label>
            <button
              className="button button--signal"
              type="submit"
              disabled={status.kind === 'sending'}
            >
              {status.kind === 'sending' ? pick('Wird gesendet …', 'Sending …') : pick('Anfrage senden', 'Send enquiry')}
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
                    {pick('Stattdessen E-Mail im eigenen Programm öffnen', 'Open an email in your own mail app instead')}
                  </a>
                )}
              </div>
            )}
          </form>

          <aside className="contact-aside">
            <div className="contact-card">
              <span className="eyebrow eyebrow--light">{pick('Direktkontakt', 'Direct contact')}</span>
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
