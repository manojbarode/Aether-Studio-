import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export default function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const springX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.35 });

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") {
      setEnabled(false);
      return undefined;
    }
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return undefined;
    const onPointerMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [enabled, x, y]);

  if (!enabled || reduceMotion) return null;

  return <motion.div className="cursor-glow" style={{ x: springX, y: springY }} aria-hidden="true" />;
}
