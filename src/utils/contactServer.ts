import { contactFileRules } from './contactFiles'

export type ServerAttachment = {
  name: string
  size: number
  type: string
  bytes: Uint8Array
}

const safeName = /^[\p{L}\p{N}_.()\- ]+$/u

export function sanitizeFilename(name: string) {
  const normalized = name.normalize('NFKC').replaceAll(/[\\/]/g, '_').trim()
  const cleaned = [...normalized]
    .filter((character) => safeName.test(character))
    .join('')
    .slice(0, 120)
  return cleaned || 'attachment'
}

const beginsWith = (bytes: Uint8Array, signature: number[]) =>
  signature.every((value, index) => bytes[index] === value)

export function hasAllowedSignature(
  extension: string,
  bytes: Uint8Array,
) {
  if (extension === 'jpg' || extension === 'jpeg') {
    return beginsWith(bytes, [0xff, 0xd8, 0xff])
  }
  if (extension === 'png') {
    return beginsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  }
  if (extension === 'webp') {
    return (
      new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' &&
      new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
    )
  }
  if (extension === 'pdf') {
    return new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-'
  }
  if (extension === 'dwg') {
    return new TextDecoder().decode(bytes.slice(0, 4)) === 'AC10'
  }
  if (extension === 'dxf') {
    const header = new TextDecoder()
      .decode(bytes.slice(0, 512))
      .replaceAll('\r', '')
      .toUpperCase()
    return header.includes('SECTION') || header.includes('HEADER')
  }
  return false
}

export function validateServerAttachments(files: ServerAttachment[]) {
  if (files.length > contactFileRules.maxFiles) {
    return `Maximal ${contactFileRules.maxFiles} Dateien sind erlaubt.`
  }

  let total = 0
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!contactFileRules.extensions.includes(extension as never)) {
      return `${file.name}: Dieser Dateityp ist nicht erlaubt.`
    }
    if (file.size > contactFileRules.maxFileBytes) {
      return `${file.name}: Eine Datei darf maximal 10 MB gross sein.`
    }
    total += file.size
    if (!hasAllowedSignature(extension, file.bytes)) {
      return `${file.name}: Dateiinhalt und Dateiendung stimmen nicht überein.`
    }
  }

  if (total > contactFileRules.maxTotalBytes) {
    return 'Die Dateien dürfen zusammen maximal 25 MB gross sein.'
  }
  return null
}

export function cleanFormText(value: FormDataEntryValue | null, max: number) {
  return [...String(value ?? '')]
    .filter((character) => {
      const point = character.codePointAt(0) ?? 0
      return (
        character === '\n' ||
        character === '\r' ||
        character === '\t' ||
        (point >= 32 && point !== 127)
      )
    })
    .join('')
    .trim()
    .slice(0, max)
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value)
}
