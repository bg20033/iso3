import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { MousePointer2 } from 'lucide-react'
import { jacketLayers } from '../data/site'
import { useNearViewport } from '../hooks/useNearViewport'
import { useInteractiveVisuals } from './useInteractiveVisuals'

const ValveScene = lazy(() => import('./ValveScene'))

/** Statische Schnittzeichnung, wenn kein WebGL läuft oder Bewegung reduziert ist. */
function ValveDiagram() {
  return (
    <svg
      className="valve-diagram"
      viewBox="0 0 420 320"
      role="img"
      aria-label="Schnitt durch ein Dämmkissen: Aussenhülle, Dämmkern, Innenhülle und Bauteil"
    >
      <g fill="none" strokeWidth="1.5">
        <circle cx="210" cy="170" r="112" stroke="var(--edge-strong)" />
        <circle cx="210" cy="170" r="92" stroke="var(--edge-strong)" />
        <circle cx="210" cy="170" r="72" stroke="var(--edge-strong)" />
        <circle cx="210" cy="170" r="52" fill="var(--ink)" stroke="none" />
        <path
          d="M210 58v-34M210 316v-30M98 170H62M358 170h-38"
          stroke="var(--edge-strong)"
        />
      </g>
      <g
        fill="var(--ink-faint)"
        fontFamily="var(--font-display)"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.4"
      >
        <text x="210" y="18" textAnchor="middle">
          01 AUSSENHÜLLE
        </text>
        <text x="18" y="174">
          02 KERN
        </text>
        <text x="402" y="174" textAnchor="end">
          03 INNENHÜLLE
        </text>
        <text x="210" y="308" textAnchor="middle">
          BAUTEIL
        </text>
      </g>
    </svg>
  )
}

export function ValveInsulation() {
  const interactive = useInteractiveVisuals()
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const [activeLayer, setActiveLayer] = useState(0)
  const nearby = useNearViewport(sectionRef)
  const sceneEnabled = interactive && nearby

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const value = travel > 0 ? -rect.top / travel : 0
      const clamped = Math.min(Math.max(value, 0), 1)
      progressRef.current = clamped
      const index = Math.min(
        jacketLayers.length - 1,
        Math.floor(clamped * jacketLayers.length * 1.15),
      )
      setActiveLayer((current) => (current === index ? current : index))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="section section--metal valve-section" ref={sectionRef}>
      <div className="shell valve-section__head">
        <div>
          <span className="eyebrow">02 · Aufbau</span>
          <h2>Vier Lagen zwischen Wärme und Umgebung.</h2>
        </div>
        <p>
          Ein Dämmkissen für ein Ventil ist kein Zuschnitt von der Rolle,
          sondern ein mehrlagiger Aufbau, der um die Geometrie herum
          konstruiert wird – und sich für den Service wieder öffnen lässt.
        </p>
      </div>

      <div className="valve-stage">
        <div className="shell valve-stage__inner">
          <div className="valve-stage__viewport">
            {sceneEnabled ? (
              <Suspense fallback={<ValveDiagram />}>
                <ValveScene layers={jacketLayers} progressRef={progressRef} />
              </Suspense>
            ) : (
              <ValveDiagram />
            )}
            <span className="valve-stage__hint">
              <MousePointer2 size={14} aria-hidden="true" />
              {sceneEnabled
                ? 'Scrollen öffnet die Schnittansicht · Ziehen dreht das Ventil'
                : 'Schnitt durch den Aufbau'}
            </span>
          </div>

          <ol className="valve-legend">
            {jacketLayers.map((layer, index) => (
              <li
                className={
                  index === activeLayer
                    ? 'valve-legend__item is-active'
                    : 'valve-legend__item'
                }
                key={layer.id}
              >
                <span className="valve-legend__no">{layer.no}</span>
                <div>
                  <h3>
                    {layer.title}
                    <small>{layer.role}</small>
                  </h3>
                  <p>{layer.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
