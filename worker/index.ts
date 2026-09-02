import {
  cleanFormText,
  isValidEmail,
  sanitizeFilename,
  validateServerAttachments,
  type ServerAttachment,
} from '../src/utils/contactServer.js'

type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
  RESEND_API_KEY?: string
  CONTACT_FROM?: string
  CONTACT_TO?: string
}

const redirects: Record<string, string> = {
  '/produkte': '/loesungen',
  '/sonderbau': '/produkte/sonderbau',
  '/loesungen/ventile-armaturen': '/produkte/ventile',
  '/loesungen/heizungszentralen': '/produkte/heizungszentralen',
  '/loesungen/ascheaustragssysteme': '/produkte/ascheaustragssysteme',
  '/loesungen/revisionstueren': '/produkte/revisionstueren',
  '/loesungen/kompensatoren': '/produkte/kompensatoren',
  '/loesungen/turbinen': '/produkte/turbinen',
  '/loesungen/sonderbau': '/produkte/sonderbau',
}

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  })

const htmlEscape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = ''
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }
  return btoa(binary)
}

const isUploadedFile = (value: FormDataEntryValue): value is File =>
  typeof value !== 'string' &&
  'name' in value &&
  typeof value.arrayBuffer === 'function'

async function handleContact(request: Request, env: Env) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 27 * 1024 * 1024) {
    return json({ message: 'Die Anfrage ist grösser als 25 MB.' }, 413)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ message: 'Die Anfrage konnte nicht gelesen werden.' }, 400)
  }

  if (cleanFormText(form.get('website'), 200)) {
    return json({ ok: true })
  }

  const startedAt = Number(form.get('startedAt'))
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1500) {
    return json(
      { message: 'Bitte prüfen Sie die Angaben und senden Sie erneut.' },
      400,
    )
  }

  const fields = {
    name: cleanFormText(form.get('name'), 120),
    company: cleanFormText(form.get('company'), 160),
    email: cleanFormText(form.get('email'), 180),
    phone: cleanFormText(form.get('phone'), 80),
    application: cleanFormText(form.get('application'), 160),
    priority: cleanFormText(form.get('priority'), 120),
    temperature: cleanFormText(form.get('temperature'), 40),
    message: cleanFormText(form.get('message'), 6000),
    consent: cleanFormText(form.get('consent'), 20),
  }

  if (
    !fields.name ||
    !fields.application ||
    !fields.message ||
    !isValidEmail(fields.email) ||
    fields.consent !== 'accepted'
  ) {
    return json(
      { message: 'Bitte füllen Sie alle Pflichtfelder korrekt aus.' },
      400,
    )
  }

  const files = form
    .getAll('attachments')
    .filter((value): value is File => isUploadedFile(value) && value.size > 0)
  const attachments: ServerAttachment[] = await Promise.all(
    files.map(async (file) => ({
      name: sanitizeFilename(file.name),
      size: file.size,
      type: file.type,
      bytes: new Uint8Array(await file.arrayBuffer()),
    })),
  )
  const fileError = validateServerAttachments(attachments)
  if (fileError) return json({ message: fileError }, 400)

  if (!env.RESEND_API_KEY) {
    return json(
      {
        message:
          'Der direkte Versand ist noch nicht konfiguriert. Bitte verwenden Sie den E-Mail-Link.',
      },
      503,
    )
  }

  const lines = [
    ['Name', fields.name],
    ['Firma', fields.company || '–'],
    ['E-Mail', fields.email],
    ['Telefon', fields.phone || '–'],
    ['Anwendung', fields.application],
    ['Priorität', fields.priority || '–'],
    ['Betriebstemperatur', fields.temperature || '–'],
  ]
  const text = [
    ...lines.map(([label, value]) => `${label}: ${value}`),
    '',
    'Projektbeschreibung:',
    fields.message,
  ].join('\n')
  const html = [
    '<h1>Neue Projektanfrage</h1>',
    '<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">',
    ...lines.map(
      ([label, value]) =>
        `<tr><th align="left">${htmlEscape(label)}</th><td>${htmlEscape(value)}</td></tr>`,
    ),
    '</table>',
    '<h2>Projektbeschreibung</h2>',
    `<p style="white-space:pre-wrap">${htmlEscape(fields.message)}</p>`,
  ].join('')

  const resend = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from:
        env.CONTACT_FROM ||
        'IsoMat Anfragen <anfragen@send.isomat.ch>',
      to: [env.CONTACT_TO || 'info@isomat.ch'],
      reply_to: fields.email,
      subject: `Projektanfrage – ${fields.application}`,
      text,
      html,
      attachments: attachments.map((attachment) => ({
        filename: attachment.name,
        content: bytesToBase64(attachment.bytes),
      })),
    }),
  })

  if (!resend.ok) {
    const status = resend.status === 429 ? 429 : 502
    return json(
      {
        message:
          status === 429
            ? 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'
            : 'Der E-Mail-Dienst ist momentan nicht erreichbar. Bitte verwenden Sie den E-Mail-Link.',
      },
      status,
    )
  }

  const result = (await resend.json()) as { id?: string }
  return json({ ok: true, id: result.id })
}

const assetRequest = (request: Request, pathname: string) => {
  const url = new URL(request.url)
  url.pathname = pathname
  return new Request(url, request)
}

async function fetchAsset(
  request: Request,
  env: Env,
  pathname?: string,
) {
  const requestedPath = pathname || new URL(request.url).pathname
  let response = await env.ASSETS.fetch(
    pathname ? assetRequest(request, pathname) : request,
  )

  // Sites normally exposes assets from the archive's `dist` directory at
  // the URL root. Some deployment revisions retain the archive prefix in the
  // asset binding, so support both layouts without changing public URLs.
  if (response.status === 404 && !requestedPath.startsWith('/dist/')) {
    response = await env.ASSETS.fetch(
      assetRequest(request, `/dist${requestedPath}`),
    )
  }

  return response
}

const securityHeaders = (response: Response) => {
  const headers = new Headers(response.headers)
  headers.set('x-content-type-options', 'nosniff')
  headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  headers.set(
    'content-security-policy',
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://api.resend.com; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  )
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    const pathname =
      url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')

    if (pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ message: 'Methode nicht erlaubt.' }, 405)
      }
      return handleContact(request, env)
    }

    if ((request.method === 'GET' || request.method === 'HEAD') && redirects[pathname]) {
      return Response.redirect(new URL(redirects[pathname], url), 308)
    }

    let response = await fetchAsset(request, env)
    if (
      response.status === 404 &&
      (request.method === 'GET' || request.method === 'HEAD') &&
      !pathname.includes('.')
    ) {
      const routeFile =
        pathname === '/' ? '/index.html' : `${pathname}/index.html`
      response = await fetchAsset(request, env, routeFile)
      if (response.status === 404) {
        const fallback = await fetchAsset(request, env, '/404.html')
        response = new Response(fallback.body, {
          status: 404,
          headers: fallback.headers,
        })
      }
    }
    return securityHeaders(response)
  },
}
