import { motion, useReducedMotion } from "motion/react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 30,
  x = 0,
  duration = 0.72,
  amount = 0.18,
  once = true,
  style,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
