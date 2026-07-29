import { mkdir, writeFile } from 'node:fs/promises'

const worker = `
const indexRequest = (request) => {
  const url = new URL(request.url)
  url.pathname = "/index.html"
  return new Request(url, request)
}

const withAbsoluteMetadata = async (response, request) => {
  const type = response.headers.get("content-type") || ""
  if (!type.includes("text/html")) return response
  const origin = new URL(request.url).origin
  const html = (await response.text()).replaceAll("__SITE_ORIGIN__", origin)
  return new Response(html, { status: response.status, headers: response.headers })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    let response = await env.ASSETS.fetch(request)
    if (response.status === 404 && request.method === "GET" && !url.pathname.includes(".")) {
      response = await env.ASSETS.fetch(indexRequest(request))
    }
    return withAbsoluteMetadata(response, request)
  },
}
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', worker.trimStart(), 'utf8')
