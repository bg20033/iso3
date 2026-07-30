import { motion, useReducedMotion } from 'motion/react';
import type { Transition } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

export type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  as?: 'p' | 'h1' | 'h2';
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 65,
  className = '',
  as: Component = 'p',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
  const reduceMotion = useReducedMotion();
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(Boolean(reduceMotion));
  const ref = useRef<HTMLElement | null>(null);

  // Der Effekt hängt bewusst NICHT am Element. Unter React StrictMode werden
  // Ref-Detach und Ref-Attach im selben Commit gebatcht, der Node-State ändert
  // sich netto nicht, und ein davon abhängiger Effekt läuft nie erneut – die
  // Überschrift bliebe für immer auf opacity 0 stehen. Deshalb wird das
  // Element hier bei jedem Tick frisch aus dem Ref gelesen.
  useEffect(() => {
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let timer = 0;
    let elapsed = 0;

    const isOnScreen = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
    };

    const tick = () => {
      const el = ref.current;
      if (el) {
        if (isOnScreen(el)) {
          setInView(true);
          observer?.disconnect();
          return;
        }
        if (!observer) {
          observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setInView(true);
                observer?.disconnect();
              }
            },
            { threshold, rootMargin }
          );
          observer.observe(el);
        }
      }
      elapsed += 120;
      if (elapsed < 2000) timer = window.setTimeout(tick, 120);
    };

    tick();

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [threshold, rootMargin, reduceMotion]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <Component
      ref={node => {
        ref.current = node;
      }}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing
        };

        return (
          <motion.span
            key={index}
            className="blur-word"
            initial={reduceMotion ? false : fromSnapshot}
            animate={reduceMotion ? undefined : inView ? animateKeyframes : fromSnapshot}
            transition={reduceMotion ? { duration: 0 } : spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity'
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </Component>
  );
};

export default BlurText;
