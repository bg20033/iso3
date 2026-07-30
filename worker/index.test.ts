import { afterEach, describe, expect, it, vi } from 'vitest'
import worker from './index'

const assets = {
  fetch: vi.fn(async () => new Response('asset', { status: 404 })),
}

const validForm = () => {
  const form = new FormData()
  form.set('name', 'Mara Muster')
  form.set('email', 'mara@example.ch')
  form.set('application', 'Turbinen')
  form.set('message', 'Bitte prüfen und offerieren.')
  form.set('consent', 'accepted')
  form.set('startedAt', String(Date.now() - 2500))
  return form
}

describe('contact Worker endpoint', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns an explicit fallback when Resend is not configured', async () => {
    const response = await worker.fetch(
      new Request('https://example.test/api/contact', {
        method: 'POST',
        body: validForm(),
      }),
      { ASSETS: assets },
    )
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({
      message: expect.stringContaining('E-Mail-Link'),
    })
  })

  it('rejects an invalid attachment before email delivery', async () => {
    const form = validForm()
    form.append(
      'attachments',
      new Blob(['not a pdf'], { type: 'application/pdf' }),
      'anlage.pdf',
    )
    const response = await worker.fetch(
      new Request('https://example.test/api/contact', {
        method: 'POST',
        body: form,
      }),
      { ASSETS: assets },
    )
    expect(response.status).toBe(400)
    expect((await response.json()) as { message: string }).toHaveProperty(
      'message',
    )
  })

  it('sends a validated request to Resend', async () => {
    const resend = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        Response.json({ id: 'email_123' }, { status: 200 }),
      )
    const response = await worker.fetch(
      new Request('https://example.test/api/contact', {
        method: 'POST',
        body: validForm(),
      }),
      { ASSETS: assets, RESEND_API_KEY: 'test-key' },
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true, id: 'email_123' })
    expect(resend).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('uses permanent redirects for legacy routes', async () => {
    const response = await worker.fetch(
      new Request('https://example.test/loesungen/turbinen'),
      { ASSETS: assets },
    )
    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe(
      'https://example.test/loesungen?solution=turbinen',
    )
  })

  it('redirects old product detail pages into the full modal', async () => {
    const response = await worker.fetch(
      new Request('https://example.test/produkte/kompensatoren'),
      { ASSETS: assets },
    )
    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe(
      'https://example.test/loesungen?solution=kompensatoren',
    )
  })

  it('serves prerendered HTML when the asset binding retains the dist prefix', async () => {
    const prefixedAssets = {
      fetch: vi.fn(async (request: Request) => {
        const pathname = new URL(request.url).pathname
        return pathname === '/dist/index.html'
          ? new Response('<!doctype html><h1>IsoMat</h1>', {
              headers: { 'content-type': 'text/html' },
            })
          : new Response('missing', { status: 404 })
      }),
    }

    const response = await worker.fetch(
      new Request('https://example.test/'),
      { ASSETS: prefixedAssets },
    )

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('<h1>IsoMat</h1>')
    expect(prefixedAssets.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://example.test/dist/index.html',
      }),
    )
  })
})
