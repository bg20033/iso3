import { describe, expect, it } from 'vitest'
import {
  hasAllowedSignature,
  isValidEmail,
  sanitizeFilename,
  validateServerAttachments,
} from './contactServer'

describe('contact upload validation', () => {
  it('accepts supported file signatures', () => {
    expect(
      hasAllowedSignature(
        'png',
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe(true)
    expect(
      hasAllowedSignature('pdf', new TextEncoder().encode('%PDF-1.7')),
    ).toBe(true)
    expect(
      hasAllowedSignature('dwg', new TextEncoder().encode('AC1032')),
    ).toBe(true)
  })

  it('rejects mismatched content and unsafe extensions', () => {
    expect(
      validateServerAttachments([
        {
          name: 'drawing.pdf',
          size: 4,
          type: 'application/pdf',
          bytes: new TextEncoder().encode('demo'),
        },
      ]),
    ).toContain('stimmen nicht überein')
    expect(
      validateServerAttachments([
        {
          name: 'archive.zip',
          size: 4,
          type: 'application/zip',
          bytes: new Uint8Array(4),
        },
      ]),
    ).toContain('nicht erlaubt')
  })

  it('sanitizes names and validates requester email addresses', () => {
    expect(sanitizeFilename('../anlage<script>.pdf')).toBe(
      '.._anlagescript.pdf',
    )
    expect(isValidEmail('projekt@example.ch')).toBe(true)
    expect(isValidEmail('invalid')).toBe(false)
  })
})
