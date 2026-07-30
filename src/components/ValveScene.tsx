import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { JacketLayer } from '../data/site'

type ValveSceneProps = {
  layers: JacketLayer[]
  /** 0 = Isolierung geschlossen, 1 = Schnittansicht vollständig geöffnet. */
  progressRef: { current: number }
}

/** Steppmuster der Dämmkissen als Textur – Rautenraster mit Kreuzstichen. */
function createQuiltTexture() {
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
  texture.repeat.set(4, 2)
  texture.anisotropy = 4
  return texture
}

/** Radiusprofil des Ventilkörpers, von unten nach oben. */
const bodyProfile: [number, number][] = [
  [0.0, -0.34],
  [0.19, -0.34],
  [0.21, -0.3],
  [0.22, -0.22],
  [0.3, -0.08],
  [0.32, 0.0],
  [0.3, 0.09],
  [0.23, 0.19],
  [0.21, 0.24],
  [0.21, 0.29],
]

/** Erzeugt eine Halbschale mit gleichmässigem Abstand zum Körperprofil. */
function shellGeometry(offset: number, phiStart: number) {
  const points = [
    // Unterkante zieht sich unter dem Körper zusammen
    new THREE.Vector2(0.09 + offset * 0.5, -0.42),
    new THREE.Vector2(0.16 + offset * 0.8, -0.4),
    ...bodyProfile
      .filter(([radius]) => radius > 0.02)
      .map(([radius, y]) => new THREE.Vector2(radius + offset, y)),
    // Oberkante schliesst um die Haube
    new THREE.Vector2(0.2 + offset, 0.36),
    new THREE.Vector2(0.17 + offset * 0.6, 0.4),
  ]
  return new THREE.LatheGeometry(points, 56, phiStart, Math.PI)
}

export default function ValveScene({ layers, progressRef }: ValveSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const disposables: { dispose: () => void }[] = []
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item)
      return item
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40)
    camera.position.set(2.15, 0.95, 3.1)
    camera.lookAt(0, 0.02, 0)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture
    scene.environment = environment
    disposables.push(environment, pmrem)

    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(2.5, 3.2, 2.4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xd8e2e8, 0.8)
    rim.position.set(-3, 1.2, -2)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))

    const quilt = createQuiltTexture()
    if (quilt) disposables.push(quilt)

    // --- Materialien ------------------------------------------------------
    const steel = track(
      new THREE.MeshStandardMaterial({
        color: 0x40484c,
        metalness: 0.92,
        roughness: 0.42,
      }),
    )
    const darkSteel = track(
      new THREE.MeshStandardMaterial({
        color: 0x22282b,
        metalness: 0.8,
        roughness: 0.5,
      }),
    )
    const foil = track(
      new THREE.MeshStandardMaterial({
        color: 0xc7ced1,
        metalness: 0.9,
        roughness: 0.3,
        side: THREE.DoubleSide,
        bumpMap: quilt ?? undefined,
        bumpScale: 1.6,
        roughnessMap: quilt ?? undefined,
      }),
    )
    const liner = track(
      new THREE.MeshStandardMaterial({
        color: 0xa8b0b4,
        metalness: 0.75,
        roughness: 0.5,
        side: THREE.DoubleSide,
      }),
    )
    const wool = track(
      new THREE.MeshStandardMaterial({
        color: 0xdbcfb4,
        metalness: 0,
        roughness: 0.98,
        side: THREE.DoubleSide,
      }),
    )
    const strapMaterial = track(
      new THREE.MeshStandardMaterial({
        color: 0x1c2124,
        metalness: 0.4,
        roughness: 0.6,
        transparent: true,
        opacity: 1,
      }),
    )

    const root = new THREE.Group()
    scene.add(root)

    // --- Ventil -----------------------------------------------------------
    const valve = new THREE.Group()
    root.add(valve)

    const bodyGeometry = track(
      new THREE.LatheGeometry(
        bodyProfile.map(([radius, y]) => new THREE.Vector2(radius, y)),
        48,
      ),
    )
    valve.add(new THREE.Mesh(bodyGeometry, steel))

    const stubGeometry = track(new THREE.CylinderGeometry(0.13, 0.13, 0.52, 32))
    const flangeGeometry = track(
      new THREE.CylinderGeometry(0.235, 0.235, 0.055, 40),
    )
    const boltGeometry = track(new THREE.CylinderGeometry(0.022, 0.022, 0.09, 12))

    for (const direction of [1, -1]) {
      const stub = new THREE.Mesh(stubGeometry, steel)
      stub.rotation.z = Math.PI / 2
      stub.position.x = direction * 0.46
      valve.add(stub)

      const flange = new THREE.Mesh(flangeGeometry, darkSteel)
      flange.rotation.z = Math.PI / 2
      flange.position.x = direction * 0.71
      valve.add(flange)

      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2
        const bolt = new THREE.Mesh(boltGeometry, darkSteel)
        bolt.rotation.z = Math.PI / 2
        bolt.position.set(
          direction * 0.71,
          Math.cos(angle) * 0.175,
          Math.sin(angle) * 0.175,
        )
        valve.add(bolt)
      }
    }

    const bonnetGeometry = track(new THREE.CylinderGeometry(0.15, 0.19, 0.3, 32))
    const bonnet = new THREE.Mesh(bonnetGeometry, steel)
    bonnet.position.y = 0.44
    valve.add(bonnet)

    const bonnetFlangeGeometry = track(
      new THREE.CylinderGeometry(0.21, 0.21, 0.05, 32),
    )
    const bonnetFlange = new THREE.Mesh(bonnetFlangeGeometry, darkSteel)
    bonnetFlange.position.y = 0.32
    valve.add(bonnetFlange)

    const stemGeometry = track(new THREE.CylinderGeometry(0.032, 0.032, 0.42, 16))
    const stem = new THREE.Mesh(stemGeometry, darkSteel)
    stem.position.y = 0.76
    valve.add(stem)

    const wheelGeometry = track(new THREE.TorusGeometry(0.2, 0.026, 12, 40))
    const wheel = new THREE.Mesh(wheelGeometry, darkSteel)
    wheel.position.y = 0.95
    wheel.rotation.x = Math.PI / 2
    valve.add(wheel)

    const spokeGeometry = track(new THREE.CylinderGeometry(0.017, 0.017, 0.4, 10))
    for (let i = 0; i < 3; i += 1) {
      const spoke = new THREE.Mesh(spokeGeometry, darkSteel)
      spoke.position.y = 0.95
      spoke.rotation.x = Math.PI / 2
      spoke.rotation.y = (i / 3) * Math.PI
      valve.add(spoke)
    }

    // --- Dämmkissen: zwei Halbschalen mit drei Lagen ----------------------
    const halves: THREE.Group[] = []
    const anchors: Record<string, THREE.Object3D> = {}

    for (const side of [1, -1]) {
      const half = new THREE.Group()
      const phiStart = side === 1 ? 0 : Math.PI

      const outerGeometry = track(shellGeometry(0.105, phiStart))
      const coreGeometry = track(shellGeometry(0.068, phiStart))
      const linerGeometry = track(shellGeometry(0.032, phiStart))

      half.add(new THREE.Mesh(outerGeometry, foil))
      half.add(new THREE.Mesh(coreGeometry, wool))
      half.add(new THREE.Mesh(linerGeometry, liner))

      root.add(half)
      halves.push(half)

      if (side === 1) {
        const shellAnchor = new THREE.Object3D()
        shellAnchor.position.set(0.36, 0.28, 0.2)
        half.add(shellAnchor)
        anchors.shell = shellAnchor

        const coreAnchor = new THREE.Object3D()
        coreAnchor.position.set(0.3, -0.04, 0.24)
        half.add(coreAnchor)
        anchors.core = coreAnchor

        const linerAnchor = new THREE.Object3D()
        linerAnchor.position.set(-0.1, -0.34, 0.22)
        half.add(linerAnchor)
        anchors.liner = linerAnchor
      }
    }

    // --- Spannverschlüsse -------------------------------------------------
    const straps = new THREE.Group()
    const strapGeometry = track(new THREE.TorusGeometry(0.4, 0.011, 8, 48))
    const buckleGeometry = track(new THREE.BoxGeometry(0.075, 0.055, 0.03))

    for (const y of [-0.16, 0.14]) {
      const strap = new THREE.Mesh(strapGeometry, strapMaterial)
      strap.rotation.x = Math.PI / 2
      strap.position.y = y
      straps.add(strap)

      const buckle = new THREE.Mesh(buckleGeometry, strapMaterial)
      buckle.position.set(0, y, 0.41)
      straps.add(buckle)
    }
    root.add(straps)

    const closureAnchor = new THREE.Object3D()
    closureAnchor.position.set(-0.26, 0.42, 0.3)
    root.add(closureAnchor)
    anchors.closure = closureAnchor

    // --- Interaktion ------------------------------------------------------
    let yaw = 0
    let targetYaw = 0
    let pitch = 0
    let targetPitch = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    let idle = 0

    const onPointerDown = (event: PointerEvent) => {
      dragging = true
      idle = 0
      lastX = event.clientX
      lastY = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      targetYaw += (event.clientX - lastX) * 0.006
      targetPitch = THREE.MathUtils.clamp(
        targetPitch + (event.clientY - lastY) * 0.004,
        -0.35,
        0.45,
      )
      lastX = event.clientX
      lastY = event.clientY
    }
    const onPointerUp = (event: PointerEvent) => {
      dragging = false
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId)
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointercancel', onPointerUp)

    // --- Grösse -----------------------------------------------------------
    const resize = () => {
      const { clientWidth, clientHeight } = host
      if (!clientWidth || !clientHeight) return
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)

    // --- Sichtbarkeit: ausserhalb des Viewports pausieren ------------------
    let visible = true
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '120px' },
    )
    visibility.observe(host)

    // --- Schleife ---------------------------------------------------------
    let frame = 0
    let open = 0
    const projected = new THREE.Vector3()
    let lastTime = performance.now()

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate)
      const delta = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      if (!visible) return

      const target = THREE.MathUtils.clamp(progressRef.current, 0, 1)
      open += (target - open) * Math.min(delta * 4.5, 1)

      // Sanfte Eigenrotation, sobald niemand zieht
      if (!dragging) {
        idle += delta
        if (idle > 1.2) targetYaw += delta * 0.12
      } else {
        idle = 0
      }
      yaw += (targetYaw - yaw) * Math.min(delta * 6, 1)
      pitch += (targetPitch - pitch) * Math.min(delta * 6, 1)
      root.rotation.y = yaw
      root.rotation.x = pitch

      const eased = open * open * (3 - 2 * open)
      halves[0].position.set(eased * 0.16, 0, eased * 0.98)
      halves[0].rotation.y = eased * 0.3
      halves[1].position.set(eased * -0.16, 0, eased * -0.98)
      halves[1].rotation.y = eased * -0.3
      strapMaterial.opacity = 1 - Math.min(eased * 2.2, 1)
      straps.visible = strapMaterial.opacity > 0.02

      for (let i = 0; i < layers.length; i += 1) {
        const label = labelRefs.current[i]
        const anchor = anchors[layers[i].id]
        if (!label || !anchor) continue
        anchor.getWorldPosition(projected)
        projected.project(camera)
        const width = host.clientWidth
        const height = host.clientHeight
        const x = (projected.x * 0.5 + 0.5) * width
        const y = (-projected.y * 0.5 + 0.5) * height
        const inside =
          projected.z < 1 && x > 4 && x < width - 4 && y > 4 && y < height - 4
        const reveal = inside
          ? THREE.MathUtils.clamp((eased - i * 0.12) * 3.4, 0, 1)
          : 0
        // Tafel klappt zur Bildmitte, damit sie nie über den Rand läuft
        label.dataset.side = x > width * 0.5 ? 'left' : 'right'
        label.style.transform = `translate3d(${x}px, ${y}px, 0)`
        label.style.opacity = String(reveal)
        label.style.visibility = reveal < 0.02 ? 'hidden' : 'visible'
      }

      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibility.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('pointercancel', onPointerUp)
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [layers, progressRef])

  return (
    <div className="valve-scene" ref={hostRef}>
      {layers.map((layer, index) => (
        <div
          className="valve-label"
          data-index={index}
          key={layer.id}
          ref={(node) => {
            labelRefs.current[index] = node
          }}
          aria-hidden="true"
        >
          <span className="valve-label__dot" />
          <span className="valve-label__text">
            <b>{layer.no}</b>
            {layer.title}
          </span>
        </div>
      ))}
    </div>
  )
}
