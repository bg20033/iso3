import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const template = await readFile('dist/index.html', 'utf8')
const { render, renderSeoHead, routes } = await import(
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
    pathname === '/' ? 'dist/index.html' : join('dist', pathname, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, await inject(pathname), 'utf8')
}

await writeFile('dist/404.html', await inject('/nicht-gefunden'), 'utf8')

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(
    (pathname) =>
      `  <url><loc>${new URL(pathname, 'https://isomat.ch').toString()}</loc></url>`,
  ),
  '</urlset>',
  '',
].join('\n')

await writeFile('dist/sitemap.xml', sitemap, 'utf8')
await writeFile(
  'dist/robots.txt',
  ['User-agent: *', 'Allow: /', '', 'Sitemap: https://isomat.ch/sitemap.xml', ''].join(
    '\n',
  ),
  'utf8',
)
await rm('dist-ssr', { recursive: true, force: true })
