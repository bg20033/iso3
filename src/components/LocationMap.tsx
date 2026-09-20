import { ArrowUpRight, MapPin } from 'lucide-react'
import { company } from '../data/site'
import { useLanguage } from '../i18n'

const { lat, lng } = company.geo
const coordinates = `${lat},${lng}`

export const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`

export function LocationMap() {
  const { language, pick } = useLanguage()
  const embedUrl = `https://www.google.com/maps?q=${coordinates}&hl=${language}&z=16&output=embed`

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
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <figcaption className="location-map__caption">
        <span>
          <MapPin size={16} aria-hidden="true" />
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
