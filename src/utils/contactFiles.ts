export const contactFileRules = {
  maxFiles: 5,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
  extensions: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'dwg', 'dxf'],
} as const

const acceptedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/acad',
  'application/x-acad',
  'application/autocad_dwg',
  'image/vnd.dwg',
  'application/dwg',
  'application/dxf',
  'image/vnd.dxf',
  'application/octet-stream',
  '',
])

export function validateContactFiles(files: readonly File[]) {
  if (files.length > contactFileRules.maxFiles) {
    return `Maximal ${contactFileRules.maxFiles} Dateien sind erlaubt.`
  }

  let total = 0
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!contactFileRules.extensions.includes(extension as never)) {
      return `${file.name}: Dieser Dateityp ist nicht erlaubt.`
    }
    if (!acceptedMimeTypes.has(file.type)) {
      return `${file.name}: Der Dateityp konnte nicht bestätigt werden.`
    }
    if (file.size > contactFileRules.maxFileBytes) {
      return `${file.name}: Eine Datei darf maximal 10 MB gross sein.`
    }
    total += file.size
  }

  if (total > contactFileRules.maxTotalBytes) {
    return 'Die Dateien dürfen zusammen maximal 25 MB gross sein.'
  }
  return null
}

export function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
