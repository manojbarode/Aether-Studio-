import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export default function AnimatedCounter({ value, suffix = "", duration = 1600, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }

    let frame;
    let start;
    const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);

    const tick = (time) => {
      if (start === undefined) start = time;
      const progress = Math.min((time - start) / duration, 1);
      setDisplay(Math.round(value * easeOut(progress)));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
