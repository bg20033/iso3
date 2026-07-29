import { describe, expect, it } from 'vitest'
import { createMailtoLink } from './mailto'

describe('createMailtoLink', () => {
  it('encodes the complete project request', () => {
    const result = createMailtoLink({
      name: 'Mara Muster',
      company: 'Muster AG',
      email: 'mara@example.ch',
      phone: '056 000 00 00',
      application: 'Turbinen',
      priority: 'Wartungszugang',
      temperature: '320 °C',
      message: 'Bitte prüfen & offerieren.',
    })

    expect(result).toMatch(/^mailto:info@isomat\.ch\?/)
    expect(decodeURIComponent(result)).toContain('Projektanfrage – Turbinen')
    expect(decodeURIComponent(result)).toContain('Priorität: Wartungszugang')
    expect(decodeURIComponent(result)).toContain('320 °C')
    expect(decodeURIComponent(result)).toContain('Bitte prüfen & offerieren.')
  })
})
