import { useEffect, useRef } from 'react'

export function MagicRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    let frame = 0
    let width = 0
    let height = 0
    let pointerX = 0
    let pointerY = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      const cx = width * 0.58 + pointerX * 12
      const cy = height * 0.45 + pointerY * 8
      const base = Math.min(width, height) * 0.17

      for (let index = 0; index < 6; index += 1) {
        const pulse = reduceMotion ? 0 : Math.sin(time * 0.00045 + index) * 7
        const radius = base + index * 34 + pulse
        const gradient = context.createLinearGradient(
          cx - radius,
          cy,
          cx + radius,
          cy,
        )
        gradient.addColorStop(0, 'rgba(115, 122, 128, 0)')
        gradient.addColorStop(0.35, 'rgba(190, 198, 204, .28)')
        gradient.addColorStop(0.68, 'rgba(214, 38, 34, .7)')
        gradient.addColorStop(1, 'rgba(214, 38, 34, 0)')
        context.beginPath()
        context.arc(cx, cy, radius, Math.PI * 0.72, Math.PI * 2.28)
        context.strokeStyle = gradient
        context.lineWidth = 1.2
        context.shadowBlur = 18
        context.shadowColor = 'rgba(214, 38, 34, .35)'
        context.stroke()
      }
      context.shadowBlur = 0
      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerX = (event.clientX - rect.left) / rect.width - 0.5
      pointerY = (event.clientY - rect.top) / rect.height - 0.5
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('pointermove', onPointerMove)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <canvas className="magic-rings" ref={canvasRef} aria-hidden="true" />
}
