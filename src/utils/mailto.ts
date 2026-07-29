export type ContactRequest = {
  name: string
  company?: string
  email: string
  phone?: string
  application: string
  priority?: string
  temperature?: string
  message: string
  attachments?: readonly File[]
}

export function createMailtoLink(
  request: ContactRequest,
  recipient = 'info@isomat.ch',
) {
  const subject = `Projektanfrage – ${request.application}`
  const body = [
    `Name: ${request.name}`,
    `Firma: ${request.company || '–'}`,
    `E-Mail: ${request.email}`,
    `Telefon: ${request.phone || '–'}`,
    `Anwendung: ${request.application}`,
    `Priorität: ${request.priority || '–'}`,
    `Betriebstemperatur: ${request.temperature || '–'}`,
    `Anhänge: ${
      request.attachments?.length
        ? `${request.attachments.map((file) => file.name).join(', ')} (bitte manuell anhängen)`
        : '–'
    }`,
    '',
    'Projektbeschreibung:',
    request.message,
  ].join('\n')

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
