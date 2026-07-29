import { describe, expect, it } from 'vitest'
import {
  buildContactPrefillPath,
  getContactPrefill,
} from './contactPrefill'

describe('project quick brief parameters', () => {
  it('builds an encoded contact URL from supported values', () => {
    const path = buildContactPrefillPath({
      application: 'Ventile & Armaturen',
      priority: 'Energieeffizienz',
      temperature: ' 280 °C ',
    })

    expect(path).toBe(
      '/kontakt?application=Ventile+%26+Armaturen&priority=Energieeffizienz&temperature=280+%C2%B0C',
    )
  })

  it('reads valid values for the contact prefill', () => {
    const result = getContactPrefill(
      new URLSearchParams(
        'application=Turbinen&priority=Wartungszugang&temperature=320+%C2%B0C',
      ),
    )

    expect(result).toEqual({
      application: 'Turbinen',
      priority: 'Wartungszugang',
      temperature: '320 °C',
    })
  })

  it('rejects unsupported selections and bounds free text', () => {
    const result = getContactPrefill(
      new URLSearchParams({
        application: 'Demo Produkt',
        priority: 'Billig',
        temperature: ` ${'1'.repeat(50)} `,
      }),
    )

    expect(result.application).toBe('')
    expect(result.priority).toBe('')
    expect(result.temperature).toHaveLength(40)
  })
})
