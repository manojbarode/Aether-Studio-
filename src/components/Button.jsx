import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const springConfig = { stiffness: 220, damping: 20, mass: 0.35 };

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "default",
  icon = null,
  className = "",
  magnetic = true,
  type = "button",
  disabled = false,
  ariaLabel,
  target,
  rel,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const isMagnetic = magnetic && !reduceMotion && !disabled;
  const Component = href ? motion.a : motion.button;

  const classes = [
    "button",
    `button-${variant}`,
    size === "small" ? "button-small" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleMouseMove = (event) => {
    if (!isMagnetic) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.24);
  };

  const resetMagnet = () => {
    x.set(0);
    y.set(0);
  };

  const componentProps = {
    className: classes,
    style: isMagnetic ? { x: springX, y: springY } : undefined,
    whileTap: reduceMotion || disabled ? undefined : { scale: 0.97 },
    onMouseMove: handleMouseMove,
    onMouseLeave: resetMagnet,
    onClick,
    "aria-label": ariaLabel,
    ...rest,
  };

  if (href) {
    componentProps.href = href;
    if (target) componentProps.target = target;
    if (rel) componentProps.rel = rel;
    else if (target === "_blank") componentProps.rel = "noopener noreferrer";
  } else {
    componentProps.type = type;
    componentProps.disabled = disabled;
  }

  return (
    <Component {...componentProps}>
      <span>{children}</span>
      {icon && <span className={`button-icon ${className.includes("button-ghost") ? "" : "button-icon--arrow"}`}>{icon}</span>}
    </Component>
  );
}
