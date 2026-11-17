import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Asterisk } from "lucide-react";

export default function Preloader({ onDone }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onDone, reduceMotion ? 250 : 1050);
    return () => window.clearTimeout(timer);
  }, [onDone, reduceMotion]);

  return (
    <motion.div
      className="preloader"
      role="status"
      aria-label="Loading Aether Studio"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="preloader-inner">
        <div className="preloader-brand">
          <span className="preloader-mark" aria-hidden="true">
            <Asterisk size={22} strokeWidth={2.3} />
          </span>
          AETHER
        </div>
        <div className="preloader-track" aria-hidden="true">
          <motion.div
            className="preloader-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className="sr-only">Loading the experience</span>
      </div>
    </motion.div>
  );
}
