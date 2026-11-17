import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, MousePointer2 } from "lucide-react";
import AnimatedText from "../components/AnimatedText.jsx";
import Button from "../components/Button.jsx";

const ease = [0.16, 1, 0.3, 1];
const HERO_VIDEO = "/videos/hero-abstract.mp4";
const HERO_POSTER = "/images/hero-visual.jpg";

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const inViewRef = useRef(true);
  const reduceMotion = useReducedMotion();
  const [pointerActive, setPointerActive] = useState(false);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(glowX, { stiffness: 80, damping: 24, mass: 0.4 });
  const springY = useSpring(glowY, { stiffness: 80, damping: 24, mass: 0.4 });

  // The hero motion keeps running by default (it is a slow, muted, non-flashing
  // loop). It only stops when the hero is off-screen,
  // the hero is off-screen, or the tab is hidden — saving battery and CPU.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    // React does not reliably reflect the `muted` attribute, and browsers only
    // allow autoplay for muted video — set it on the element directly.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const tryPlay = () => {
      if (reduceMotion || document.hidden || !inViewRef.current) return;
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          // Autoplay was blocked — the first user gesture below will start it.
        });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.04 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else tryPlay();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    tryPlay();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, []);

  const onPointerMove = (event) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    glowX.set(event.clientX - rect.left);
    glowY.set(event.clientY - rect.top);
    setPointerActive(true);
  };

  return (
    <section
      id="home"
      className="hero hero--video"
      aria-labelledby="hero-title"
      ref={sectionRef}
      onMouseMove={onPointerMove}
      onMouseLeave={() => setPointerActive(false)}
    >
      {/* Full-screen cinematic motion matched to the hero artwork:
          iridescent 3D glass torus, optimized local 15s loop. */}
      <div className="hero-video-layer" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          poster={HERO_POSTER}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          onLoadedData={(event) => {
            event.currentTarget.classList.add("is-ready");
          }}
          onError={(event) => event.currentTarget.classList.remove("is-ready")}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="hero-video-fallback" />
        <div className="hero-video-scrim" />
        <div className="hero-video-vignette" />
      </div>

      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="hero-aurora hero-aurora--one" aria-hidden="true" />
      <div className="hero-aurora hero-aurora--two" aria-hidden="true" />
      <motion.div
        className={`hero-pointer-glow ${pointerActive ? "is-active" : ""}`}
        style={{ x: springX, y: springY }}
        aria-hidden="true"
      />

      <div className="container hero-layout">
        <div className="hero-copy">
          <h1
            id="hero-title"
            className="hero-title"
            aria-label="WE BUILD DIGITAL EXPERIENCES THAT MAKE BRANDS UNFORGETTABLE."
          >
            <AnimatedText
              as="span"
              className="hero-line"
              text="WE BUILD DIGITAL"
              mode="letters"
              trigger="mount"
              delay={0.12}
              stagger={0.018}
            />
            <AnimatedText
              as="span"
              className="hero-line hero-line--gradient"
              text="EXPERIENCES THAT"
              mode="letters"
              trigger="mount"
              delay={0.3}
              stagger={0.016}
            />
            <AnimatedText
              as="span"
              className="hero-line"
              text="MAKE BRANDS"
              mode="letters"
              trigger="mount"
              delay={0.48}
              stagger={0.018}
            />
            <AnimatedText
              as="span"
              className="hero-line hero-line--serif"
              text="UNFORGETTABLE."
              mode="letters"
              trigger="mount"
              delay={0.66}
              stagger={0.022}
            />
          </h1>

          <motion.p
            className="hero-subtitle"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.88, ease }}
          >
            We design and develop modern websites, digital products, and creative solutions that help
            businesses grow, stand out, and succeed online.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.98, ease }}
          >
            <Button href="#contact" variant="primary" icon={<ArrowUpRight size={17} />}>
              Let&apos;s Work Together
            </Button>
            <Button href="#portfolio" variant="secondary" icon={<ArrowUpRight size={17} />}>
              Explore Our Work
            </Button>
          </motion.div>

          <motion.div
            className="hero-meta"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <span className="hero-availability">
              <span className="pill-dot" aria-hidden="true" />
              Available for select projects
            </span>
            <span className="hero-meta-divider" aria-hidden="true" />
            <span>Strategy · Design · Development</span>
          </motion.div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <MousePointer2 size={13} />
        <span>Scroll to explore</span>
        <span className="scroll-indicator-track">
          <span className="scroll-indicator-dot" />
        </span>
      </div>
    </section>
  );
}
