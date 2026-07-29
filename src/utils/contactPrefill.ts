import { solutions } from '../data/site'

export const projectPriorities = [
  'Energieeffizienz',
  'Wartungszugang',
  'Berührungsschutz',
  'Sondergeometrie',
] as const

export type ProjectPriority = (typeof projectPriorities)[number]

export type ContactPrefill = {
  application: string
  priority: ProjectPriority | ''
  temperature: string
}

const applicationTitles = new Set(solutions.map((solution) => solution.title))
const priorityTitles = new Set<string>(projectPriorities)

const cleanTemperature = (value: string | null) =>
  (value ?? '').trim().slice(0, 40)

export function getContactPrefill(
  params: URLSearchParams,
): ContactPrefill {
  const application = params.get('application') ?? ''
  const priority = params.get('priority') ?? ''

  return {
    application: applicationTitles.has(application) ? application : '',
    priority: priorityTitles.has(priority)
      ? (priority as ProjectPriority)
      : '',
    temperature: cleanTemperature(params.get('temperature')),
  }
}

export function buildContactPrefillPath({
  application,
  priority,
  temperature,
}: ContactPrefill) {
  const params = new URLSearchParams()

  if (applicationTitles.has(application)) {
    params.set('application', application)
  }
  if (priorityTitles.has(priority)) {
    params.set('priority', priority)
  }

  const cleanedTemperature = cleanTemperature(temperature)
  if (cleanedTemperature) {
    params.set('temperature', cleanedTemperature)
  }

  const query = params.toString()
  return query ? `/kontakt?${query}` : '/kontakt'
}
