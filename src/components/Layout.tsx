import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Dock } from './Dock'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const title =
      pathname === '/'
        ? 'IsoMat GmbH – Industrielle Isoliertechnik'
        : pathname.startsWith('/loesungen/')
          ? 'Massgefertigte Isolierung – IsoMat GmbH'
          : pathname === '/loesungen'
            ? 'Industrielle Dämmkissen – IsoMat GmbH'
            : pathname === '/ueber-uns'
              ? 'Über IsoMat – Individuelle Isoliertechnik'
              : pathname === '/kontakt'
                ? 'Kontakt & Projektanfrage – IsoMat GmbH'
                : 'IsoMat GmbH'
    document.title = title
  }, [pathname])

  return (
    <div className="site">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt">
        <Outlet />
      </main>
      <Footer />
      <Dock />
    </div>
  )
}
