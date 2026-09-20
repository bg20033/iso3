import { ArrowUpRight } from 'lucide-react'
import { company } from '../data/site'
import { useLanguage } from '../i18n'

const { lat, lng } = company.geo
const coordinates = `${lat},${lng}`

/**
 * Offizieller «Karte einbetten»-Link aus Google Maps (pb-Parameter).
 * Nur dieser Endpunkt lässt sich ohne API-Key zuverlässig einbetten –
 * `output=embed` leitet auf eine Seite mit X-Frame-Options um.
 */
const embedBase =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2698.891089700438!2d8.368736076383202!3d47.43356697117436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDfCsDI2JzAwLjgiTiA4wrAyMicxNi43IkU!5e0!3m2!1sen!2s!4v1789921062896!5m2!1sen!2s'

export const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`

export function LocationMap() {
  const { language, pick } = useLanguage()
  const embedUrl = embedBase.replaceAll('!1sen!2s', `!1s${language}!2s`)

  return (
    <figure className="location-map">
      <iframe
        className="location-map__frame"
        src={embedUrl}
        title={pick(
          `Standort von ${company.name}, ${company.street}, ${company.city} auf Google Maps`,
          `Location of ${company.name}, ${company.street}, ${company.city} on Google Maps`,
        )}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <figcaption className="location-map__caption">
        <span>
          {company.street} · {company.city}
        </span>
        <a href={mapDirectionsUrl} target="_blank" rel="noreferrer">
          {pick('Route planen', 'Get directions')}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  )
}
