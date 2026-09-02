import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { canonicalRoutes, renderSeoHead } from './seo'

export const routes = canonicalRoutes.map((route) => route.path)

export async function render(pathname: string) {
  const { prelude } = await prerender(
    <StaticRouter location={pathname}>
      <App />
    </StaticRouter>,
  )
  return new Response(prelude).text()
}

export { canonicalRoutes, renderSeoHead }
