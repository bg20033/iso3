import { lazy, Suspense, useRef } from 'react'
import { MousePointer2 } from 'lucide-react'
import { jacketLayers } from '../data/site'
import { useJacketProgress } from '../hooks/useJacketProgress'
import { useVisibleRange } from '../hooks/useVisibleRange'
import { JacketDiagram } from './JacketDiagram'
import { useCompactLayout, useSceneVisuals } from './useInteractiveVisuals'

const ValveScene = lazy(() => import('./ValveScene'))

export function ValveInsulation() {
  const sectionRef = useRef<HTMLElement>(null)
  const scenes = useSceneVisuals()
  const compact = useCompactLayout()
  const inRange = useVisibleRange(sectionRef, 250)
  const sceneEnabled = scenes && inRange
  const { progressRef, activeLayer } = useJacketProgress(sectionRef, compact)

  return (
    <section className="section section--metal valve-section" ref={sectionRef}>
      <div className="shell valve-section__head">
        <div>
          <span className="eyebrow">03 · Aufbau</span>
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
              <Suspense fallback={<JacketDiagram />}>
                <ValveScene layers={jacketLayers} progressRef={progressRef} />
              </Suspense>
            ) : (
              <JacketDiagram />
            )}
            <span className="valve-stage__hint">
              <MousePointer2 size={14} aria-hidden="true" />
              {!sceneEnabled
                ? 'Schnitt durch den Aufbau'
                : compact
                  ? 'Ziehen dreht das Ventil'
                  : 'Scrollen öffnet die Schnittansicht · Ziehen dreht das Ventil'}
            </span>
          </div>

          <ol className="valve-legend">
            {jacketLayers.map((layer, index) => (
              <li
                className={
                  !compact && index === activeLayer
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
