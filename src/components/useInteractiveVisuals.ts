import { useEffect, useState } from 'react'

/**
 * Aufwendige Zusatzeffekte (Galerien, reflektierende Karten) nur dort, wo ein
 * Zeiger und genügend Breite vorhanden sind.
 */
export function useInteractiveVisuals() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const wideViewport = window.matchMedia('(min-width: 900px)')

    const update = () => {
      const hasWebGL2 = typeof window.WebGL2RenderingContext !== 'undefined'
      setEnabled(
        hasWebGL2 &&
          wideViewport.matches &&
          !reducedMotion.matches &&
          !coarsePointer.matches,
      )
    }

    update()
    reducedMotion.addEventListener('change', update)
    coarsePointer.addEventListener('change', update)
    wideViewport.addEventListener('change', update)

    return () => {
      reducedMotion.removeEventListener('change', update)
      coarsePointer.removeEventListener('change', update)
      wideViewport.removeEventListener('change', update)
    }
  }, [])

  return enabled
}

/**
 * Die 3D-Bauteile laufen auch auf dem Telefon: Sie ersetzen dort kein Bild,
 * sondern sind der Inhalt. Voraussetzung ist nur WebGL2 und der Wunsch nach
 * Bewegung.
 */
export function useSceneVisuals() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      setEnabled(
        typeof window.WebGL2RenderingContext !== 'undefined' &&
          !reducedMotion.matches,
      )
    }

    update()
    reducedMotion.addEventListener('change', update)
    return () => reducedMotion.removeEventListener('change', update)
  }, [])

  return enabled
}

/** True, solange die kompakte Darstellung gilt (Telefon, schmales Fenster). */
export function useCompactLayout(query = '(max-width: 900px)') {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return compact
}
