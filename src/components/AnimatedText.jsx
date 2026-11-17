import { motion, useReducedMotion } from "motion/react";

const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

const easing = [0.16, 1, 0.3, 1];

/**
 * Word/letter reveal.
 * @param trigger "inview" (default) fires when the element scrolls into view;
 *                "mount" fires immediately — use for above-the-fold content.
 */
export default function AnimatedText({
  text,
  as = "span",
  className = "",
  mode = "words",
  delay = 0,
  stagger = 0.03,
  duration = 0.75,
  amount = 0.4,
  trigger = "inview",
}) {
  const reduceMotion = useReducedMotion();
  const Component = tags[as] || motion.span;

  if (reduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const pieces =
    mode === "letters"
      ? Array.from(text)
      : text.split(" ").map((word, index, array) => ({
          value: word,
          trailingSpace: index < array.length - 1 ? "\u00A0" : "",
        }));

  const settled = { y: "0%", opacity: 1 };
  const play =
    trigger === "mount"
      ? { animate: settled }
      : { whileInView: settled, viewport: { once: true, amount } };

  return (
    <Component className={className} aria-label={text}>
      {mode === "letters"
        ? pieces.map((piece, index) => (
            <span className="reveal-letter" aria-hidden="true" key={`${piece}-${index}`}>
              <motion.span
                className="reveal-inner"
                initial={{ y: "110%", opacity: 0 }}
                {...play}
                transition={{ duration, delay: delay + index * stagger, ease: easing }}
              >
                {piece === " " ? "\u00A0" : piece}
              </motion.span>
            </span>
          ))
        : pieces.map((piece, index) => (
            <span key={`${piece.value}-${index}`} aria-hidden="true">
              <span className="reveal-word">
                <motion.span
                  className="reveal-inner"
                  initial={{ y: "110%", opacity: 0 }}
                  {...play}
                  transition={{ duration, delay: delay + index * stagger, ease: easing }}
                >
                  {piece.value}
                </motion.span>
              </span>
              {piece.trailingSpace}
            </span>
          ))}
    </Component>
  );
}
