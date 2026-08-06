import * as THREE from 'three'

/**
 * Steppmuster der Dämmkissen als Canvas-Textur – Rautenraster mit Kreuzstichen.
 * Wird als Bump- und Roughness-Map auf die Aussenhülle gelegt.
 */
export function createQuiltTexture(repeatX = 4, repeatY = 2) {
  if (typeof document === 'undefined') return null

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#d8dcde'
  ctx.fillRect(0, 0, size, size)

  const step = 64
  ctx.lineWidth = 3
  ctx.strokeStyle = '#9aa2a6'
  ctx.beginPath()
  for (let i = -size; i < size * 2; i += step) {
    ctx.moveTo(i, 0)
    ctx.lineTo(i + size, size)
    ctx.moveTo(i, size)
    ctx.lineTo(i + size, 0)
  }
  ctx.stroke()

  // Kreuzstiche auf den Schnittpunkten
  ctx.strokeStyle = '#6d7477'
  ctx.lineWidth = 4
  for (let x = 0; x <= size; x += step) {
    for (let y = 0; y <= size; y += step) {
      const offset = ((x / step) % 2) * (step / 2)
      const cy = y + offset
      ctx.beginPath()
      ctx.moveTo(x - 7, cy)
      ctx.lineTo(x + 7, cy)
      ctx.moveTo(x, cy - 7)
      ctx.lineTo(x, cy + 7)
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeatX, repeatY)
  texture.anisotropy = 4
  return texture
}
