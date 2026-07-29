import { useEffect, useState } from 'react'

let visualsActivated = false

export function useInteractiveVisuals() {
  const [enabled, setEnabled] = useState(false)
  const [activated, setActivated] = useState(visualsActivated)

  useEffect(() => {
    if (activated) return
    const activate = () => {
      visualsActivated = true
      setActivated(true)
    }
    addEventListener('pointerdown', activate, { once: true, passive: true })
    addEventListener('keydown', activate, { once: true })
    return () => {
      removeEventListener('pointerdown', activate)
      removeEventListener('keydown', activate)
    }
  }, [activated])

  useEffect(() => {
    if (!activated) {
      setEnabled(false)
      return
    }
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
  }, [activated])

  return enabled
}
