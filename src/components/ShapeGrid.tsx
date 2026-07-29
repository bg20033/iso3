import { useEffect, useRef } from 'react'
import './ShapeGrid.css'

type ShapeGridProps = {
  direction?: 'diagonal' | 'right' | 'left'
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  disabled?: boolean
}

const ShapeGrid = ({
  direction = 'diagonal',
  speed = 0.18,
  borderColor = 'rgba(35, 40, 42, 0.13)',
  squareSize = 58,
  hoverFillColor = 'rgba(214, 38, 34, 0.08)',
  disabled = false,
}: ShapeGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frame = 0
    let active = !document.hidden
    let offset = 0
    let pointer = { x: -1000, y: -1000 }
    const dpr = Math.min(devicePixelRatio || 1, 1.5)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)
      const shiftX = direction === 'left' ? offset : -offset
      const shiftY = direction === 'diagonal' ? -offset : 0

      for (let x = -squareSize; x < width + squareSize; x += squareSize) {
        for (let y = -squareSize; y < height + squareSize; y += squareSize) {
          const cellX = x + (shiftX % squareSize)
          const cellY = y + (shiftY % squareSize)
          const centreX = cellX + squareSize / 2
          const centreY = cellY + squareSize / 2
          const distance = Math.hypot(pointer.x - centreX, pointer.y - centreY)
          if (!disabled && distance < squareSize * 1.45) {
            const alpha = Math.max(0, 1 - distance / (squareSize * 1.45))
            context.globalAlpha = alpha
            context.fillStyle = hoverFillColor
            context.fillRect(cellX, cellY, squareSize, squareSize)
            context.globalAlpha = 1
          }
          context.strokeStyle = borderColor
          context.lineWidth = 1
          context.strokeRect(cellX + 0.5, cellY + 0.5, squareSize, squareSize)
        }
      }

      const fade = context.createRadialGradient(
        width * 0.62,
        height * 0.45,
        0,
        width * 0.62,
        height * 0.45,
        Math.max(width, height) * 0.72,
      )
      fade.addColorStop(0, 'rgba(255,255,255,0)')
      fade.addColorStop(1, 'rgba(255,255,255,0.9)')
      context.fillStyle = fade
      context.fillRect(0, 0, width, height)
    }

    const animate = () => {
      if (!disabled) offset += speed
      draw()
      frame = active ? requestAnimationFrame(animate) : 0
    }

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting && !document.hidden
      if (active && !frame) frame = requestAnimationFrame(animate)
      if (!active && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const handleVisibility = () => {
      active = !document.hidden
      if (active && !frame) frame = requestAnimationFrame(animate)
    }

    resize()
    draw()
    observer.observe(canvas)
    addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)
    canvas.addEventListener('pointermove', handlePointer)
    canvas.addEventListener('pointerleave', () => {
      pointer = { x: -1000, y: -1000 }
    })

    return () => {
      observer.disconnect()
      removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      canvas.removeEventListener('pointermove', handlePointer)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [
    borderColor,
    direction,
    disabled,
    hoverFillColor,
    speed,
    squareSize,
  ])

  return <canvas className="shape-grid" ref={canvasRef} aria-hidden="true" />
}

export default ShapeGrid
