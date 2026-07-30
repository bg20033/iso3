import worker from '../worker/index.js'

declare const process: {
  env: Record<string, string | undefined>
}

const assets = {
  fetch: async () => new Response('Not found', { status: 404 }),
}

export default {
  fetch(request: Request) {
    return worker.fetch(request, {
      ASSETS: assets,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      CONTACT_FROM: process.env.CONTACT_FROM,
      CONTACT_TO: process.env.CONTACT_TO,
    })
  },
}
