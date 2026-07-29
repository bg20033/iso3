import { useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  Camera,
  Ruler,
  Thermometer,
  Wrench,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { solutions } from '../data/site'
import {
  buildContactPrefillPath,
  projectPriorities,
  type ProjectPriority,
} from '../utils/contactPrefill'

const priorityDescriptions: Record<ProjectPriority, string> = {
  Energieeffizienz: 'Wärmeverluste reduzieren',
  Wartungszugang: 'Demontage und Wiedermontage',
  Berührungsschutz: 'Oberflächentemperaturen reduzieren',
  Sondergeometrie: 'Komplexe Bauteile abbilden',
}

const checklist = [
  { label: 'Foto der Komponente', icon: Camera },
  { label: 'Abmessungen', icon: Ruler },
  { label: 'Betriebstemperatur', icon: Thermometer },
  { label: 'Wartungszugang', icon: Wrench },
]

export function ProjectQuickBrief() {
  const navigate = useNavigate()
  const [application, setApplication] = useState('')
  const [priority, setPriority] = useState<ProjectPriority | ''>('')
  const [temperature, setTemperature] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(
      buildContactPrefillPath({
        application,
        priority,
        temperature,
      }),
    )
  }

  return (
    <section className="section quick-brief" aria-labelledby="quick-brief-title">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">04 · Projekt Quick Brief</span>
            <h2 id="quick-brief-title">Drei Angaben für den ersten Schritt.</h2>
          </div>
          <p>
            Wählen Sie Anwendung und Priorität. Die Angaben werden ins
            Kontaktformular übernommen und können dort ergänzt werden.
          </p>
        </div>

        <form className="quick-brief__form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>
              <span>01</span> Anwendung
            </legend>
            <div className="brief-option-grid brief-option-grid--solutions">
              {solutions.map((solution) => (
                <label className="brief-option" key={solution.slug}>
                  <input
                    type="radio"
                    name="brief-application"
                    value={solution.title}
                    checked={application === solution.title}
                    onChange={() => setApplication(solution.title)}
                    required
                  />
                  <span>{solution.no}</span>
                  <strong>{solution.shortTitle}</strong>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <span>02</span> Priorität
            </legend>
            <div className="brief-option-grid brief-option-grid--priorities">
              {projectPriorities.map((item, index) => (
                <label className="brief-option" key={item}>
                  <input
                    type="radio"
                    name="brief-priority"
                    value={item}
                    checked={priority === item}
                    onChange={() => setPriority(item)}
                    required
                  />
                  <span>0{index + 1}</span>
                  <strong>{item}</strong>
                  <small>{priorityDescriptions[item]}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="quick-brief__finish">
            <label>
              <span>03 · Betriebstemperatur (optional)</span>
              <input
                value={temperature}
                onChange={(event) => setTemperature(event.target.value)}
                maxLength={40}
                placeholder="z. B. 280 °C"
              />
            </label>
            <button className="button button--signal" type="submit">
              Anfrage vorbereiten
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="quick-brief__checklist">
          <span>Für eine schnelle Einschätzung hilfreich:</span>
          <ul>
            {checklist.map(({ label, icon: Icon }) => (
              <li key={label}>
                <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
