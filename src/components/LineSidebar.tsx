import { useRef, useState, useCallback, useEffect } from 'react';
import type { CSSProperties } from 'react';
import './LineSidebar.css';

type Falloff = 'linear' | 'smooth' | 'sharp';

export interface LineSidebarProps {
  items?: string[];
  ariaLabel?: string;
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  activeIndex?: number | null;
  defaultActive?: number | null;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
}

const FALLOFF_CURVES: Record<Falloff, (p: number) => number> = {
  linear: p => p,
  smooth: p => p * p * (3 - 2 * p),
  sharp: p => p * p * p
};

const DEFAULT_ITEMS = [
  'Overview',
  'Components',
  'Animations',
  'Backgrounds',
  'Showcase',
  'Playground',
  'Templates',
  'Changelog',
  'Community',
  'Resources',
  'Documentation',
  'Support'
];

const LineSidebar = ({
  items = DEFAULT_ITEMS,
  ariaLabel = 'Bereichsnavigation',
  accentColor = '#A855F7',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = 'smooth',
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  activeIndex: controlledActiveIndex,
  defaultActive = null,
  onItemClick,
  className = ''
}: LineSidebarProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef<number | null>(defaultActive);
  const smoothingRef = useRef(smoothing);
  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(defaultActive);
  const activeIndex = controlledActiveIndex === undefined
    ? internalActiveIndex
    : controlledActiveIndex;

  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  // Single rAF loop that eases every item's --effect toward its target using
  // frame-rate independent exponential smoothing, so color, shift and scale
  // all move together without staggering CSS transitions.
  const runFrame = useCallback((now: number) => {
    const dt = Math.max(0, Math.min((now - lastRef.current) / 1000, 0.05));
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const items = itemRefs.current;
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      if (!el) continue;
      const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty('--effect', value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const items = itemRefs.current;
      const horizontal = Boolean(
        items[0] && items[1] && Math.abs(items[0].offsetTop - items[1].offsetTop) < 2,
      );
      const pointerPosition = horizontal
        ? e.clientX - rect.left
        : e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;
        const center = horizontal
          ? el.offsetLeft + el.offsetWidth / 2
          : el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerPosition - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop]
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string) => {
      if (controlledActiveIndex === undefined) setInternalActiveIndex(index);
      onItemClick?.(index, label);
    },
    [controlledActiveIndex, onItemClick]
  );

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(() => {
    if (activeIndex == null) return;
    const item = itemRefs.current[activeIndex];
    if (!item) return;

    let scroller = item.parentElement;
    while (scroller && scroller !== document.body) {
      if (scroller.scrollWidth > scroller.clientWidth + 1) {
        const itemRect = item.getBoundingClientRect();
        const scrollerRect = scroller.getBoundingClientRect();
        const itemLeft = itemRect.left - scrollerRect.left + scroller.scrollLeft;
        const targetLeft = itemLeft - (scroller.clientWidth - itemRect.width) / 2;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        scroller.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
        break;
      }
      scroller = scroller.parentElement;
    }
  }, [activeIndex]);

  useEffect(
    () => () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        // Handle zurücksetzen, sonst hält startLoop() die Schleife nach einem
        // Remount (z. B. React StrictMode) für immer angehalten.
        rafRef.current = null;
      }
    },
    []
  );

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
      style={
        {
          '--accent-color': accentColor,
          '--text-color': textColor,
          '--marker-color': markerColor,
          '--marker-length': `${markerLength}px`,
          '--marker-gap': `${markerGap}px`,
          '--tick-scale': tickScale,
          '--max-shift': `${maxShift}px`,
          '--item-gap': `${itemGap}px`,
          '--font-size': `${fontSize}rem`,
          '--smoothing': `${smoothing}ms`
        } as CSSProperties
      }
    >
      <ul ref={listRef} className="line-sidebar__list" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            className="line-sidebar__item"
            aria-current={activeIndex === index ? 'true' : undefined}
            aria-label={`${String(index + 1).padStart(2, '0')} ${label}`}
            onClick={() => handleClick(index, label)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleClick(index, label);
                return;
              }

              const previousKey = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
              const nextKey = event.key === 'ArrowDown' || event.key === 'ArrowRight';
              if (!previousKey && !nextKey && event.key !== 'Home' && event.key !== 'End') return;

              event.preventDefault();
              const nextIndex = event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? items.length - 1
                  : (index + (previousKey ? -1 : 1) + items.length) % items.length;
              itemRefs.current[nextIndex]?.focus();
              handleClick(nextIndex, items[nextIndex]);
            }}
            role="button"
            tabIndex={0}
          >
            {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
            <span className="line-sidebar__label">
              {showIndex && <span className="line-sidebar__index">{String(index + 1).padStart(2, '0')}</span>}
              <span className="line-sidebar__text">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LineSidebar;
