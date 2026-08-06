import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { createQuiltTexture } from './three/quilt'

export type CategoryKind =
  | 'ventile-armaturen'
  | 'heizungszentralen'
  | 'ascheaustragssysteme'
  | 'revisionstueren'
  | 'kompensatoren'
  | 'turbinen'
  | 'sonderbau'

type CategorySceneProps = {
  kind: CategoryKind
  /** 0 = Dämmkissen geschlossen, 1 = abgenommen. */
  progressRef: { current: number }
  controlRef?: CategorySceneControl
  statusRef?: { current: (ready: boolean) => void }
}

export type CategorySceneControl = {
  current: {
    turn: number
    reset: number
  }
}

type Track = <T extends { dispose: () => void }>(item: T) => T

type Materials = {
  steel: THREE.MeshStandardMaterial
  darkSteel: THREE.MeshStandardMaterial
  foil: THREE.MeshStandardMaterial
  liner: THREE.MeshStandardMaterial
  wool: THREE.MeshStandardMaterial
  strap: THREE.MeshStandardMaterial
}

type Model = {
  root: THREE.Group
  /** Öffnet die Isolierung; eased läuft von 0 bis 1. */
  applyOpen: (eased: number) => void
  /** Blickrichtung auf das Bauteil; der Abstand wird automatisch berechnet. */
  view: [number, number, number]
}

type Builder = (m: Materials, track: Track) => Model

const v2 = (x: number, y: number) => new THREE.Vector2(x, y)

/* --------------------------------------------------------------------------
   Bausteine – aus diesen Helfern setzen sich alle sieben Modelle zusammen.
   -------------------------------------------------------------------------- */

/** Zylinder mit Achse in Y. */
const tube = (
  radius: number,
  length: number,
  track: Track,
  segments = 28,
) => track(new THREE.CylinderGeometry(radius, radius, length, segments))

/** Bolzenkranz-Flansch, Achse in Y. */
function flange(
  radius: number,
  thickness: number,
  bolts: number,
  m: Materials,
  track: Track,
) {
  const group = new THREE.Group()
  group.add(
    new THREE.Mesh(
      track(new THREE.CylinderGeometry(radius, radius, thickness, 36)),
      m.darkSteel,
    ),
  )
  const boltGeometry = track(
    new THREE.CylinderGeometry(0.021, 0.021, thickness + 0.05, 10),
  )
  for (let i = 0; i < bolts; i += 1) {
    const angle = (i / bolts) * Math.PI * 2
    const bolt = new THREE.Mesh(boltGeometry, m.darkSteel)
    bolt.position.set(
      Math.cos(angle) * (radius - 0.045),
      0,
      Math.sin(angle) * (radius - 0.045),
    )
    group.add(bolt)
  }
  return group
}

/**
 * Zwei Halbschalen mit je drei Lagen. Das Profil wird pro Lage mit einem
 * Abstand zum Bauteil aufgerufen – aussen Hülle, dann Kern, dann Innenhülle.
 */
function jacketHalves(
  profile: (offset: number) => THREE.Vector2[],
  m: Materials,
  track: Track,
  segments = 44,
) {
  const halves: THREE.Group[] = []
  for (const phiStart of [0, Math.PI]) {
    const half = new THREE.Group()
    const layers: [number, THREE.MeshStandardMaterial][] = [
      [0.1, m.foil],
      [0.064, m.wool],
      [0.03, m.liner],
    ]
    for (const [offset, material] of layers) {
      const geometry = track(
        new THREE.LatheGeometry(profile(offset), segments, phiStart, Math.PI),
      )
      half.add(new THREE.Mesh(geometry, material))
    }
    halves.push(half)
  }
  return halves
}

/** Gerades Hüllprofil mit gebrochenen Kanten – Rohre, Pumpen, Gehäuse. */
const barrelProfile =
  (radius: number, halfLength: number) => (offset: number) => {
    const r = radius + offset
    const l = halfLength + offset * 0.55
    const c = Math.min(0.075, l * 0.42)
    return [
      v2(0.004, -l),
      v2(r - c, -l),
      v2(r, -l + c),
      v2(r, l - c),
      v2(r - c, l),
      v2(0.004, l),
    ]
  }

/** Hüllprofil entlang einer beliebigen Kontur, gleichmässig aufgedickt. */
const contourProfile =
  (points: [number, number][]) => (offset: number) =>
    points.map(([radius, y]) => v2(radius + offset, y))

/** Spannbänder mit Schnalle – liegen in der lokalen XZ-Ebene. */
function strapSet(
  rings: [radius: number, y: number][],
  m: Materials,
  track: Track,
) {
  const group = new THREE.Group()
  const buckleGeometry = track(new THREE.BoxGeometry(0.08, 0.055, 0.028))
  for (const [radius, y] of rings) {
    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(radius, 0.012, 8, 46)),
      m.strap,
    )
    ring.rotation.x = Math.PI / 2
    ring.position.y = y
    group.add(ring)

    const buckle = new THREE.Mesh(buckleGeometry, m.strap)
    buckle.position.set(0, y, radius + 0.008)
    group.add(buckle)
  }
  return group
}

/** Laminierter Kissenaufbau als flache Platte – für Türen und Deckel. */
function padStack(
  width: number,
  height: number,
  m: Materials,
  track: Track,
) {
  const group = new THREE.Group()
  const layers: [number, number, number, THREE.MeshStandardMaterial][] = [
    [width, height, 0.055, m.foil],
    [width * 0.96, height * 0.97, 0.06, m.wool],
    [width * 0.9, height * 0.93, 0.035, m.liner],
  ]
  let z = 0.075
  for (const [w, h, depth, material] of layers) {
    const mesh = new THREE.Mesh(
      track(new THREE.BoxGeometry(w, h, depth)),
      material,
    )
    mesh.position.z = z - depth / 2
    z -= depth
    group.add(mesh)
  }
  return group
}

/* --------------------------------------------------------------------------
   Die sieben Kategorien
   -------------------------------------------------------------------------- */

/** 01 · Ventile & Armaturen */
const buildValve: Builder = (m, track) => {
  const root = new THREE.Group()
  const core = new THREE.Group()
  root.add(core)

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

  core.add(
    new THREE.Mesh(
      track(
        new THREE.LatheGeometry(
          bodyProfile.map(([radius, y]) => v2(radius, y)),
          46,
        ),
      ),
      m.steel,
    ),
  )

  const stubGeometry = tube(0.13, 0.52, track, 30)
  for (const direction of [1, -1]) {
    const stub = new THREE.Mesh(stubGeometry, m.steel)
    stub.rotation.z = Math.PI / 2
    stub.position.x = direction * 0.46
    core.add(stub)

    const end = flange(0.235, 0.055, 8, m, track)
    end.rotation.z = Math.PI / 2
    end.position.x = direction * 0.71
    core.add(end)
  }

  const bonnet = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.15, 0.19, 0.3, 30)),
    m.steel,
  )
  bonnet.position.y = 0.44
  core.add(bonnet)

  const bonnetFlange = new THREE.Mesh(tube(0.21, 0.05, track), m.darkSteel)
  bonnetFlange.position.y = 0.32
  core.add(bonnetFlange)

  const stem = new THREE.Mesh(tube(0.032, 0.42, track, 14), m.darkSteel)
  stem.position.y = 0.76
  core.add(stem)

  const wheel = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.2, 0.026, 10, 36)),
    m.darkSteel,
  )
  wheel.position.y = 0.95
  wheel.rotation.x = Math.PI / 2
  core.add(wheel)

  const spokeGeometry = tube(0.017, 0.4, track, 10)
  for (let i = 0; i < 3; i += 1) {
    const spoke = new THREE.Mesh(spokeGeometry, m.darkSteel)
    spoke.position.y = 0.95
    spoke.rotation.x = Math.PI / 2
    spoke.rotation.y = (i / 3) * Math.PI
    core.add(spoke)
  }

  const profile = (offset: number) => [
    v2(0.09 + offset * 0.5, -0.42),
    v2(0.16 + offset * 0.8, -0.4),
    ...bodyProfile
      .filter(([radius]) => radius > 0.02)
      .map(([radius, y]) => v2(radius + offset, y)),
    v2(0.2 + offset, 0.36),
    v2(0.17 + offset * 0.6, 0.4),
  ]

  const halves = jacketHalves(profile, m, track)
  halves.forEach((half) => root.add(half))

  const straps = strapSet([[0.4, -0.16], [0.4, 0.14]], m, track)
  root.add(straps)

  return {
    root,
    view: [2.3, 1.05, 3.3],
    applyOpen: (eased) => {
      halves[0].position.set(eased * 0.95, 0, 0)
      halves[0].rotation.z = eased * -0.24
      halves[1].position.set(eased * -0.95, 0, 0)
      halves[1].rotation.z = eased * 0.24
      m.strap.opacity = 1 - Math.min(eased * 2.4, 1)
      straps.visible = m.strap.opacity > 0.02
    },
  }
}

/** 02 · Heizungszentralen – Pumpe mit Saug- und Druckstutzen */
const buildPump: Builder = (m, track) => {
  const root = new THREE.Group()
  const core = new THREE.Group()
  root.add(core)

  const volute = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 40)),
    m.steel,
  )
  volute.rotation.x = Math.PI / 2
  core.add(volute)

  const voluteRim = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.42, 0.035, 10, 40)),
    m.darkSteel,
  )
  core.add(voluteRim)

  const suction = new THREE.Mesh(tube(0.16, 0.46, track), m.steel)
  suction.rotation.x = Math.PI / 2
  suction.position.z = 0.36
  core.add(suction)

  const suctionFlange = flange(0.25, 0.05, 8, m, track)
  suctionFlange.rotation.x = Math.PI / 2
  suctionFlange.position.z = 0.58
  core.add(suctionFlange)

  const discharge = new THREE.Mesh(tube(0.14, 0.55, track), m.steel)
  discharge.position.y = 0.5
  core.add(discharge)

  const dischargeFlange = flange(0.22, 0.05, 8, m, track)
  dischargeFlange.position.y = 0.78
  core.add(dischargeFlange)

  const lantern = new THREE.Mesh(tube(0.11, 0.24, track), m.darkSteel)
  lantern.rotation.x = Math.PI / 2
  lantern.position.z = -0.28
  core.add(lantern)

  const motor = new THREE.Mesh(tube(0.21, 0.62, track, 32), m.darkSteel)
  motor.rotation.x = Math.PI / 2
  motor.position.z = -0.7
  core.add(motor)

  const finGeometry = track(new THREE.TorusGeometry(0.215, 0.014, 8, 32))
  for (let i = 0; i < 5; i += 1) {
    const fin = new THREE.Mesh(finGeometry, m.darkSteel)
    fin.position.z = -0.5 - i * 0.1
    core.add(fin)
  }

  const terminal = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.24, 0.14, 0.3)),
    m.darkSteel,
  )
  terminal.position.set(0, 0.24, -0.7)
  core.add(terminal)

  const base = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.42, 0.06, 1.5)),
    m.darkSteel,
  )
  base.position.set(0, -0.62, -0.25)
  core.add(base)

  const pedestalGeometry = track(new THREE.BoxGeometry(0.2, 0.3, 0.24))
  for (const z of [0.05, -0.68]) {
    const pedestal = new THREE.Mesh(pedestalGeometry, m.darkSteel)
    pedestal.position.set(0, -0.44, z)
    core.add(pedestal)
  }

  const jacket = new THREE.Group()
  jacket.rotation.x = Math.PI / 2
  root.add(jacket)

  const halves = jacketHalves(barrelProfile(0.44, 0.18), m, track)
  halves.forEach((half) => jacket.add(half))

  const straps = strapSet([[0.53, -0.08], [0.53, 0.08]], m, track)
  jacket.add(straps)

  return {
    root,
    view: [2.5, 1.3, 3.25],
    applyOpen: (eased) => {
      halves[0].position.x = eased * 1.0
      halves[1].position.x = eased * -1.0
      m.strap.opacity = 1 - Math.min(eased * 2.4, 1)
      straps.visible = m.strap.opacity > 0.02
    },
  }
}

/** 03 · Ascheaustrag & Trichter */
const buildHopper: Builder = (m, track) => {
  const root = new THREE.Group()
  const core = new THREE.Group()
  root.add(core)

  const hopperProfile: [number, number][] = [
    [0.2, -0.32],
    [0.2, -0.24],
    [0.56, 0.34],
    [0.58, 0.4],
  ]

  core.add(
    new THREE.Mesh(
      track(
        new THREE.LatheGeometry(
          hopperProfile.map(([radius, y]) => v2(radius, y)),
          40,
        ),
      ),
      m.steel,
    ),
  )

  const rim = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.58, 0.03, 10, 44)),
    m.darkSteel,
  )
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.4
  core.add(rim)

  const rotary = new THREE.Mesh(tube(0.25, 0.28, track, 32), m.darkSteel)
  rotary.position.y = -0.46
  core.add(rotary)

  const rotaryFlange = flange(0.29, 0.045, 8, m, track)
  rotaryFlange.position.y = -0.32
  core.add(rotaryFlange)

  const screw = new THREE.Mesh(tube(0.15, 0.95, track, 30), m.steel)
  screw.rotation.z = Math.PI / 2
  screw.position.set(0.42, -0.68, 0)
  core.add(screw)

  const screwEnd = flange(0.19, 0.05, 6, m, track)
  screwEnd.rotation.z = Math.PI / 2
  screwEnd.position.set(0.92, -0.68, 0)
  core.add(screwEnd)

  const drive = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.24, 0.26, 0.24)),
    m.darkSteel,
  )
  drive.position.set(1.1, -0.68, 0)
  core.add(drive)

  const legGeometry = tube(0.032, 0.95, track, 10)
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
    const leg = new THREE.Mesh(legGeometry, m.darkSteel)
    leg.position.set(Math.cos(angle) * 0.52, -0.16, Math.sin(angle) * 0.52)
    core.add(leg)
  }

  const halves = jacketHalves(contourProfile(hopperProfile), m, track)
  halves.forEach((half) => root.add(half))

  const straps = strapSet([[0.46, 0.0], [0.64, 0.28]], m, track)
  root.add(straps)

  return {
    root,
    view: [2.9, 1.5, 3.6],
    applyOpen: (eased) => {
      halves[0].position.set(eased * 1.05, eased * 0.12, 0)
      halves[1].position.set(eased * -1.05, eased * 0.12, 0)
      m.strap.opacity = 1 - Math.min(eased * 2.4, 1)
      straps.visible = m.strap.opacity > 0.02
    },
  }
}

/** 04 · Revisionstüren & Öffnungen */
const buildDoor: Builder = (m, track) => {
  const root = new THREE.Group()
  const core = new THREE.Group()
  root.add(core)

  const wall = new THREE.Mesh(
    track(new THREE.BoxGeometry(1.7, 1.24, 0.18)),
    m.darkSteel,
  )
  wall.position.z = -0.16
  core.add(wall)

  const ribGeometry = track(new THREE.BoxGeometry(0.07, 1.24, 0.09))
  for (const x of [-0.78, 0.78]) {
    const rib = new THREE.Mesh(ribGeometry, m.steel)
    rib.position.set(x, 0, -0.04)
    core.add(rib)
  }

  const frame = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.44, 0.05, 12, 44)),
    m.steel,
  )
  frame.position.z = -0.06
  core.add(frame)

  const door = new THREE.Mesh(tube(0.42, 0.1, track, 40), m.steel)
  door.rotation.x = Math.PI / 2
  door.position.z = -0.02
  core.add(door)

  const hinge = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.12, 0.3, 0.14)),
    m.darkSteel,
  )
  hinge.position.set(-0.5, 0, -0.02)
  core.add(hinge)

  const latchGeometry = tube(0.028, 0.26, track, 12)
  const handleGeometry = track(new THREE.TorusGeometry(0.09, 0.02, 8, 24))
  for (const y of [0.22, -0.22]) {
    const latch = new THREE.Mesh(latchGeometry, m.darkSteel)
    latch.rotation.x = Math.PI / 2
    latch.position.set(0.46, y, 0.06)
    core.add(latch)

    const handle = new THREE.Mesh(handleGeometry, m.darkSteel)
    handle.position.set(0.46, y, 0.18)
    core.add(handle)
  }

  const sightGlass = new THREE.Mesh(tube(0.08, 0.12, track, 20), m.darkSteel)
  sightGlass.rotation.x = Math.PI / 2
  sightGlass.position.set(0, 0.0, 0.06)
  core.add(sightGlass)

  // Zwei Kissenflügel, die wie Läden aufschwenken
  const halves: THREE.Group[] = []
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group()
    pivot.position.set(side * 0.52, 0, 0.1)
    const pad = padStack(0.52, 1.06, m, track)
    pad.position.x = side * -0.26
    pivot.add(pad)
    root.add(pivot)
    halves.push(pivot)
  }

  const straps = new THREE.Group()
  const strapGeometry = track(new THREE.BoxGeometry(1.06, 0.05, 0.02))
  const buckleGeometry = track(new THREE.BoxGeometry(0.09, 0.07, 0.035))
  for (const y of [0.32, -0.32]) {
    const band = new THREE.Mesh(strapGeometry, m.strap)
    band.position.set(0, y, 0.19)
    straps.add(band)
    const buckle = new THREE.Mesh(buckleGeometry, m.strap)
    buckle.position.set(0, y, 0.212)
    straps.add(buckle)
  }
  root.add(straps)

  return {
    root,
    view: [1.5, 0.7, 3.4],
    applyOpen: (eased) => {
      halves[0].rotation.y = eased * -1.55
      halves[0].position.x = eased * -0.18
      halves[1].rotation.y = eased * 1.55
      halves[1].position.x = eased * 0.18
      m.strap.opacity = 1 - Math.min(eased * 3, 1)
      straps.visible = m.strap.opacity > 0.02
    },
  }
}

/** 05 · Kompensatoren */
const buildBellows: Builder = (m, track) => {
  const root = new THREE.Group()
  const core = new THREE.Group()
  root.add(core)

  const sleeve = new THREE.Mesh(tube(0.17, 0.78, track, 32), m.darkSteel)
  sleeve.rotation.z = Math.PI / 2
  core.add(sleeve)

  const convolution = track(new THREE.TorusGeometry(0.25, 0.072, 10, 40))
  for (let i = 0; i < 7; i += 1) {
    const ring = new THREE.Mesh(convolution, m.steel)
    ring.rotation.y = Math.PI / 2
    ring.position.x = -0.3 + i * 0.1
    core.add(ring)
  }

  const pipeGeometry = tube(0.19, 0.55, track, 30)
  for (const direction of [1, -1]) {
    const pipe = new THREE.Mesh(pipeGeometry, m.steel)
    pipe.rotation.z = Math.PI / 2
    pipe.position.x = direction * 0.66
    core.add(pipe)

    const end = flange(0.28, 0.06, 10, m, track)
    end.rotation.z = Math.PI / 2
    end.position.x = direction * 0.94
    core.add(end)
  }

  const tieGeometry = tube(0.022, 1.2, track, 10)
  for (const z of [0.3, -0.3]) {
    const tie = new THREE.Mesh(tieGeometry, m.darkSteel)
    tie.rotation.z = Math.PI / 2
    tie.position.set(0, 0, z)
    core.add(tie)
  }

  const jacket = new THREE.Group()
  jacket.rotation.z = -Math.PI / 2
  root.add(jacket)

  const halves = jacketHalves(barrelProfile(0.36, 0.46), m, track)
  halves.forEach((half) => jacket.add(half))

  const straps = strapSet([[0.45, -0.28], [0.45, 0.28]], m, track)
  jacket.add(straps)

  return {
    root,
    view: [2.05, 1.2, 3.3],
    applyOpen: (eased) => {
      halves[0].position.x = eased * 1.0
      halves[1].position.x = eased * -1.0
      m.strap.opacity = 1 - Math.min(eased * 2.4, 1)
      straps.visible = m.strap.opacity > 0.02
    },
  }
}

/** 06 · Turbinen */
const buildTurbine: Builder = (m, track) => {
  const root = new THREE.Group()
  const core = new THREE.Group()
  root.add(core)

  const casingProfile: [number, number][] = [
    [0.24, -0.64],
    [0.29, -0.56],
    [0.42, -0.22],
    [0.46, 0.08],
    [0.39, 0.42],
    [0.29, 0.58],
    [0.24, 0.64],
  ]

  const casing = new THREE.Group()
  casing.rotation.z = -Math.PI / 2
  core.add(casing)
  casing.add(
    new THREE.Mesh(
      track(
        new THREE.LatheGeometry(
          casingProfile.map(([radius, y]) => v2(radius, y)),
          44,
        ),
      ),
      m.steel,
    ),
  )

  const splitFlange = new THREE.Mesh(
    track(new THREE.BoxGeometry(1.3, 0.035, 0.96)),
    m.darkSteel,
  )
  core.add(splitFlange)

  const boltGeometry = tube(0.024, 0.09, track, 8)
  for (let i = 0; i < 12; i += 1) {
    const side = i % 2 === 0 ? 1 : -1
    const bolt = new THREE.Mesh(boltGeometry, m.darkSteel)
    bolt.position.set(-0.55 + Math.floor(i / 2) * 0.22, 0, side * 0.44)
    core.add(bolt)
  }

  const shaft = new THREE.Mesh(tube(0.09, 2.05, track, 20), m.darkSteel)
  shaft.rotation.z = Math.PI / 2
  core.add(shaft)

  const bearingGeometry = track(new THREE.BoxGeometry(0.26, 0.42, 0.44))
  for (const x of [0.85, -0.85]) {
    const bearing = new THREE.Mesh(bearingGeometry, m.darkSteel)
    bearing.position.set(x, -0.14, 0)
    core.add(bearing)
  }

  const inlet = new THREE.Mesh(tube(0.16, 0.42, track), m.steel)
  inlet.position.set(-0.3, 0.6, 0)
  core.add(inlet)

  const inletFlange = flange(0.24, 0.05, 8, m, track)
  inletFlange.position.set(-0.3, 0.83, 0)
  core.add(inletFlange)

  const exhaust = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.3, 0.24, 0.34, 28)),
    m.steel,
  )
  exhaust.position.set(0.44, -0.56, 0)
  core.add(exhaust)

  const base = new THREE.Mesh(
    track(new THREE.BoxGeometry(2.3, 0.07, 0.9)),
    m.darkSteel,
  )
  base.position.y = -0.82
  core.add(base)

  const jacket = new THREE.Group()
  jacket.rotation.z = -Math.PI / 2
  root.add(jacket)

  const halves = jacketHalves(contourProfile(casingProfile), m, track)
  halves.forEach((half) => jacket.add(half))

  const straps = strapSet(
    [[0.48, -0.36], [0.57, 0.0], [0.52, 0.38]],
    m,
    track,
  )
  jacket.add(straps)

  return {
    root,
    view: [2.75, 1.5, 3.7],
    applyOpen: (eased) => {
      halves[0].position.x = eased * 1.15
      halves[1].position.x = eased * -1.15
      m.strap.opacity = 1 - Math.min(eased * 2.4, 1)
      straps.visible = m.strap.opacity > 0.02
    },
  }
}

/** 07 · Sonderbau & Kombinationen – Ventilatorgehäuse */
const buildFan: Builder = (m, track) => {
  const root = new THREE.Group()
  const core = new THREE.Group()
  root.add(core)

  const scroll = new THREE.Mesh(tube(0.5, 0.38, track, 44), m.steel)
  scroll.rotation.x = Math.PI / 2
  core.add(scroll)

  const scrollRim = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.5, 0.03, 10, 44)),
    m.darkSteel,
  )
  core.add(scrollRim)

  const outlet = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.34, 0.55, 0.38)),
    m.steel,
  )
  outlet.position.set(0.38, 0.52, 0)
  outlet.rotation.z = -0.24
  core.add(outlet)

  const outletFlange = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.42, 0.05, 0.46)),
    m.darkSteel,
  )
  outletFlange.position.set(0.45, 0.78, 0)
  outletFlange.rotation.z = -0.24
  core.add(outletFlange)

  const inlet = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.3, 0.22, 0.22, 32)),
    m.steel,
  )
  inlet.rotation.x = Math.PI / 2
  inlet.position.z = 0.3
  core.add(inlet)

  const shaft = new THREE.Mesh(tube(0.06, 0.9, track, 16), m.darkSteel)
  shaft.rotation.x = Math.PI / 2
  shaft.position.z = -0.4
  core.add(shaft)

  const motor = new THREE.Mesh(tube(0.19, 0.5, track, 30), m.darkSteel)
  motor.rotation.x = Math.PI / 2
  motor.position.z = -0.72
  core.add(motor)

  const bracket = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.32, 0.5, 0.06)),
    m.darkSteel,
  )
  bracket.position.set(0, -0.5, -0.6)
  core.add(bracket)

  const base = new THREE.Mesh(
    track(new THREE.BoxGeometry(1.05, 0.07, 1.5)),
    m.darkSteel,
  )
  base.position.set(0, -0.74, -0.28)
  core.add(base)

  const jacket = new THREE.Group()
  jacket.rotation.x = Math.PI / 2
  root.add(jacket)

  const halves = jacketHalves(barrelProfile(0.53, 0.21), m, track)
  halves.forEach((half) => jacket.add(half))

  const straps = strapSet([[0.62, -0.1], [0.62, 0.1]], m, track)
  jacket.add(straps)

  return {
    root,
    view: [2.5, 1.35, 3.3],
    applyOpen: (eased) => {
      halves[0].position.x = eased * 1.1
      halves[1].position.x = eased * -1.1
      m.strap.opacity = 1 - Math.min(eased * 2.4, 1)
      straps.visible = m.strap.opacity > 0.02
    },
  }
}

const builders: Record<CategoryKind, Builder> = {
  'ventile-armaturen': buildValve,
  heizungszentralen: buildPump,
  ascheaustragssysteme: buildHopper,
  revisionstueren: buildDoor,
  kompensatoren: buildBellows,
  turbinen: buildTurbine,
  sonderbau: buildFan,
}

function createMaterials(track: Track, quilt: THREE.Texture | null): Materials {
  return {
    steel: track(
      new THREE.MeshStandardMaterial({
        color: 0x40484c,
        metalness: 0.92,
        roughness: 0.42,
      }),
    ),
    darkSteel: track(
      new THREE.MeshStandardMaterial({
        color: 0x22282b,
        metalness: 0.8,
        roughness: 0.5,
      }),
    ),
    // Aussenhülle: beschichtetes Glasgewebe, kein Spiegel. Weniger Metall und
    // mehr Rauheit als zuvor – sonst wirkt das Kissen wie Glas.
    foil: track(
      new THREE.MeshStandardMaterial({
        color: 0xbfc6ca,
        metalness: 0.34,
        roughness: 0.58,
        side: THREE.DoubleSide,
        bumpMap: quilt ?? undefined,
        bumpScale: 2.4,
        roughnessMap: quilt ?? undefined,
      }),
    ),
    liner: track(
      new THREE.MeshStandardMaterial({
        color: 0x9aa2a6,
        metalness: 0.45,
        roughness: 0.62,
        side: THREE.DoubleSide,
      }),
    ),
    wool: track(
      new THREE.MeshStandardMaterial({
        color: 0xd9cbab,
        metalness: 0,
        roughness: 1,
        side: THREE.DoubleSide,
      }),
    ),
    strap: track(
      new THREE.MeshStandardMaterial({
        color: 0x1c2124,
        metalness: 0.4,
        roughness: 0.6,
        transparent: true,
        opacity: 1,
      }),
    ),
  }
}

/** Weiche Kontaktschattierung, damit die Bauteile nicht im Weissen schweben. */
function createContactShadow(track: Track, radius: number, y: number) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  gradient.addColorStop(0, 'rgba(14, 17, 18, 0.42)')
  gradient.addColorStop(0.55, 'rgba(14, 17, 18, 0.16)')
  gradient.addColorStop(1, 'rgba(14, 17, 18, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = track(new THREE.CanvasTexture(canvas))
  const material = track(
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    }),
  )
  const mesh = new THREE.Mesh(
    track(new THREE.PlaneGeometry(radius * 2.6, radius * 2.6)),
    material,
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = y - 0.01
  mesh.renderOrder = -1
  return mesh
}

/**
 * Setzt die Kamera so, dass das geschlossene Bauteil formatfüllend im Bild
 * steht – unabhängig von Seitenverhältnis und Modellgrösse. Ersetzt die
 * früheren handgesetzten Kamerapositionen, bei denen einzelne Modelle je nach
 * Fenstergrösse angeschnitten waren.
 */
function frameCamera(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  direction: [number, number, number],
  margin = 1.12,
) {
  const box = new THREE.Box3().setFromObject(object)
  if (box.isEmpty()) return new THREE.Vector3()

  /*
   * Eingepasst wird die Silhouette, die beim Drehen um die Hochachse
   * entsteht: in der Breite der Radius in der XZ-Ebene, in der Höhe schlicht
   * die Bauteilhöhe. Die volle Hüllkugel wäre zu grosszügig – dann stünde das
   * Bauteil verloren in der Bühne –, die achsenparallele Box zu knapp, dann
   * ragten Grundplatten beim Drehen hinaus.
   */
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const spinRadius = Math.sqrt(size.x * size.x + size.z * size.z) / 2
  const verticalFov = (camera.fov * Math.PI) / 180
  const horizontalFov =
    2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
  const distance =
    Math.max(
      spinRadius / Math.tan(horizontalFov / 2),
      size.y / 2 / Math.tan(verticalFov / 2),
    ) * margin

  const offset = new THREE.Vector3(...direction).normalize()
  camera.position.copy(center).addScaledVector(offset, distance)
  camera.near = Math.max(distance / 100, 0.01)
  camera.far = distance * 12
  camera.updateProjectionMatrix()
  camera.lookAt(center)
  return center
}

export default function CategoryScene({
  kind,
  progressRef,
  controlRef,
  statusRef,
}: CategorySceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const setSceneStatus = statusRef?.current

    const disposables: { dispose: () => void }[] = []
    const track: Track = (item) => {
      disposables.push(item)
      return item
    }

    // Auf Touchgeräten zählt Füllrate mehr als Kantenglättung
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const renderer = new THREE.WebGLRenderer({
      antialias: !coarsePointer,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, coarsePointer ? 1.35 : 1.6),
    )
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    host.appendChild(renderer.domElement)

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      setSceneStatus?.(false)
    }
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.025).texture
    scene.environment = environment
    disposables.push(environment, pmrem)

    const key = new THREE.DirectionalLight(0xffffff, 1.55)
    key.position.set(2.5, 3.2, 2.4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xd8e2e8, 0.75)
    fill.position.set(-3, 1.2, -2)
    scene.add(fill)
    // Warmer Streifen in IsoMat-Rot – setzt die Kante gegen den weissen Grund ab
    const accent = new THREE.DirectionalLight(0xff5a52, 0.14)
    accent.position.set(-1.4, -1.8, 2.6)
    scene.add(accent)
    scene.add(new THREE.AmbientLight(0xffffff, 0.38))

    const quilt = createQuiltTexture(3, 2)
    if (quilt) disposables.push(quilt)

    const materials = createMaterials(track, quilt)
    const model = builders[kind](materials, track)

    const pivot = new THREE.Group()
    pivot.add(model.root)
    scene.add(pivot)

    // Modellmittelpunkt in den Ursprung legen, damit sich das Bauteil um sich
    // selbst dreht und nicht um einen zufälligen Punkt
    const bounds = new THREE.Box3().setFromObject(model.root)
    const centre = bounds.getCenter(new THREE.Vector3())
    model.root.position.sub(centre)

    const shadow = createContactShadow(
      track,
      Math.max(bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z) / 2,
      bounds.min.y - centre.y,
    )
    if (shadow) pivot.add(shadow)

    const focus = new THREE.Vector3()
    const basePosition = new THREE.Vector3()
    const viewDirection = new THREE.Vector3()
    const framing = () => {
      focus.copy(frameCamera(camera, pivot, model.view))
      basePosition.copy(camera.position)
      viewDirection.copy(basePosition).sub(focus).normalize()
    }
    framing()

    // --- Interaktion ------------------------------------------------------
    let yaw = 0
    let targetYaw = 0
    let pitch = 0
    let targetPitch = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    let seenReset = controlRef?.current.reset ?? 0
    let seenTurn = controlRef?.current.turn ?? 0

    const onPointerDown = (event: PointerEvent) => {
      dragging = true
      lastX = event.clientX
      lastY = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      targetYaw += (event.clientX - lastX) * 0.007
      targetPitch = THREE.MathUtils.clamp(
        targetPitch + (event.clientY - lastY) * 0.004,
        -0.4,
        0.5,
      )
      lastX = event.clientX
      lastY = event.clientY
      if (controlRef) {
        controlRef.current.turn = targetYaw
        seenTurn = targetYaw
      }
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

    const resize = () => {
      const { clientWidth, clientHeight } = host
      if (!clientWidth || !clientHeight) return
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      // Nach jeder Grössenänderung neu einpassen, sonst ragt das Bauteil in
      // schmalen Fenstern aus dem Bild
      framing()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)

    /*
     * Sichtbarkeit über die Position statt über IntersectionObserver: dessen
     * Callbacks werden in inaktiven Tabs nicht zugestellt, und dann bliebe die
     * Bühne dauerhaft leer.
     */
    let visible = true
    const measureVisible = () => {
      const rect = host.getBoundingClientRect()
      visible = rect.bottom > -160 && rect.top < window.innerHeight + 160
    }
    measureVisible()
    window.addEventListener('scroll', measureVisible, { passive: true })
    window.addEventListener('resize', measureVisible)

    let frame = 0
    let announcedReady = false
    /*
     * Das Kissen fährt nicht linear auf, sondern wie ein gedämpfter Feder-
     * mechanismus: kurzes Anfahren, sanftes Ausschwingen. Dazu ein Auftritt
     * beim Kategoriewechsel und eine leichte Kamerafahrt beim Öffnen.
     */
    let open = 0
    let openVelocity = 0
    let intro = 0
    let lastTime = performance.now()

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate)
      const delta = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      if (!visible) return

      const goal = THREE.MathUtils.clamp(progressRef.current, 0, 1)
      const stiffness = 46
      const damping = 2 * Math.sqrt(stiffness) * 0.78
      openVelocity +=
        ((goal - open) * stiffness - openVelocity * damping) * delta
      open += openVelocity * delta

      intro = Math.min(1, intro + delta / 0.75)

      if (controlRef && controlRef.current.reset !== seenReset) {
        seenReset = controlRef.current.reset
        seenTurn = controlRef.current.turn
        targetYaw = 0
        targetPitch = 0
      } else if (controlRef && controlRef.current.turn !== seenTurn) {
        seenTurn = controlRef.current.turn
        targetYaw = seenTurn
      }
      yaw += (targetYaw - yaw) * Math.min(delta * 3.4, 1)
      pitch += (targetPitch - pitch) * Math.min(delta * 3.4, 1)
      pivot.rotation.y = yaw
      pivot.rotation.x = pitch

      const eased = THREE.MathUtils.clamp(open, 0, 1.04)
      model.applyOpen(eased)
      // Leichtes Anheben, sobald die Isolierung offen ist
      model.root.position.y = eased * 0.04

      // Auftritt: das Bauteil setzt sich beim Wechsel kurz zusammen
      const introEase = 1 - Math.pow(1 - intro, 3)
      pivot.scale.setScalar(0.93 + 0.07 * introEase)
      pivot.position.y = (1 - introEase) * -0.06

      // Die Kamera weicht beim Öffnen ein Stück zurück
      camera.position
        .copy(basePosition)
        .addScaledVector(viewDirection, eased * 0.22)
      camera.lookAt(focus)

      renderer.render(scene, camera)
      if (!announcedReady) {
        announcedReady = true
        setSceneStatus?.(true)
      }
    }
    model.applyOpen(0)
    renderer.render(scene, camera)
    announcedReady = true
    setSceneStatus?.(true)
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', measureVisible)
      window.removeEventListener('resize', measureVisible)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('pointercancel', onPointerUp)
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost)
      setSceneStatus?.(false)
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [controlRef, kind, progressRef, statusRef])

  return <div className="category-scene" ref={hostRef} aria-hidden="true" />
}
