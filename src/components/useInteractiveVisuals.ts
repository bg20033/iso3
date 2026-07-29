import { useEffect, useState } from 'react'

export function useInteractiveVisuals() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')

    const update = () => {
      const hasWebGL2 = typeof window.WebGL2RenderingContext !== 'undefined'
      setEnabled(
        hasWebGL2 && !reducedMotion.matches && !coarsePointer.matches,
      )
    }

    update()
    reducedMotion.addEventListener('change', update)
    coarsePointer.addEventListener('change', update)

    return () => {
      reducedMotion.removeEventListener('change', update)
      coarsePointer.removeEventListener('change', update)
    }
  }, [])

  return enabled
}
