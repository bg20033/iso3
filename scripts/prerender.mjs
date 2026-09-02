import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const clientDirectory = 'dist/client'
const template = await readFile(join(clientDirectory, 'index.html'), 'utf8')
const { canonicalRoutes, render, renderSeoHead, routes } = await import(
  '../dist-ssr/entry-server.js'
)

const inject = async (pathname) => {
  const markup = await render(pathname)
  return template
    .replace('<!--seo-head-->', renderSeoHead(pathname))
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
}

for (const pathname of routes) {
  const file =
    pathname === '/'
      ? join(clientDirectory, 'index.html')
      : join(clientDirectory, pathname, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, await inject(pathname), 'utf8')
}

await writeFile(
  join(clientDirectory, '404.html'),
  await inject('/nicht-gefunden'),
  'utf8',
)

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...canonicalRoutes.map((route) => {
    const url = new URL(route.path, 'https://isomat.ch').toString()
    const image = new URL(route.image, 'https://isomat.ch').toString()
    return [
      '  <url>',
      `    <loc>${url}</loc>`,
      '    <image:image>',
      `      <image:loc>${image}</image:loc>`,
      '    </image:image>',
      '  </url>',
    ].join('\n')
  }),
  '</urlset>',
  '',
].join('\n')

await writeFile(join(clientDirectory, 'sitemap.xml'), sitemap, 'utf8')
await writeFile(
  join(clientDirectory, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    'Sitemap: https://isomat.ch/sitemap.xml',
    '',
  ].join('\n'),
  'utf8',
)
await rm('dist-ssr', { recursive: true, force: true })
