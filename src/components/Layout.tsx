import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { SeoHead } from './SeoHead'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="site">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <SeoHead />
      <Header />
      <main id="inhalt">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="route-stage"
            key={pathname}
            initial={{ opacity: 0, y: 10, clipPath: 'inset(0 0 8% 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
