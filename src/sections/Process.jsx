import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Code2,
  Compass,
  Layers,
  MessageSquare,
  MousePointer2,
  PenTool,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import Button from "../components/Button.jsx";
import { processSteps } from "../data/site.js";

const iconMap = { Compass, Layers, PenTool, Code2, ShieldCheck, Rocket };
const ease = [0.16, 1, 0.3, 1];
const total = processSteps.length;

const facts = [
  { icon: MessageSquare, label: "Regular check-ins", text: "One dedicated point of contact" },
  { icon: Clock3, label: "Realistic timelines", text: "Clear milestones from day one" },
  { icon: ShieldCheck, label: "No surprises", text: "Transparent scope and updates" },
];

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed + 12 : 90;
}

function rangeFor(track, sticky) {
  const top = track.getBoundingClientRect().top + window.scrollY;
  const start = top - headerOffset();
  const end = top + track.offsetHeight - sticky.offsetHeight - headerOffset();
  return { start, end: Math.max(end, start + 1) };
}

export default function Process() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const tabListRef = useRef(null);
  const tabRefs = useRef([]);
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [fills, setFills] = useState(() => processSteps.map((_, index) => (index === 0 ? 0 : 0)));

  const step = processSteps[active];
  const Icon = iconMap[step.icon] || Compass;

  const applyProgress = useCallback((progress) => {
    const scaled = Math.min(total, Math.max(0, progress * total));
    const index = scaled >= total ? total - 1 : Math.floor(scaled);
    const partial = scaled >= total ? 1 : scaled - index;
    const nextFills = processSteps.map((_, i) => (i < index ? 1 : i === index ? partial : 0));
    setActive(index);
    setFills(nextFills);
  }, []);

  const scrollToStep = useCallback((index) => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || reduceMotion) {
      setActive(((index % total) + total) % total);
      return;
    }
    const clamped = Math.max(0, Math.min(total - 1, index));
    const { start, end } = rangeFor(track, sticky);
    const progress = (clamped + 0.12) / total;
    window.scrollTo({ top: start + progress * (end - start), behavior: "smooth" });
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!root || !track || !sticky) return undefined;
    if (reduceMotion) {
      root.classList.remove("is-scrub");
      applyProgress(0);
      return undefined;
    }

    root.classList.add("is-scrub");
    let frame = 0;

    const update = () => {
      frame = 0;
      const { start, end } = rangeFor(track, sticky);
      applyProgress((window.scrollY - start) / (end - start));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      root.classList.remove("is-scrub");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [applyProgress, reduceMotion]);

  useLayoutEffect(() => {
    const list = tabListRef.current;
    const tab = tabRefs.current[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth + 2) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active, reduceMotion]);

  const onTabKeyDown = (event) => {
    const map = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: total - 1 };
    if (!(event.key in map)) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(total - 1, map[event.key]));
    scrollToStep(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="process" className="section pr-section" aria-labelledby="process-title" ref={rootRef}>
      <div className="container">
        <SectionHeading
          eyebrow="How We Work"
          title="From Idea to"
          accent="Digital Reality."
          headingId="process-title"
          description="A clear, collaborative six-stage journey that keeps the work focused, transparent, and moving forward."
        />
      </div>

      <div className="pr-track" ref={trackRef}>
        <div className="pr-sticky" ref={stickyRef}>
          <div className="container pr-shell">
            <div className="pr-tabs" role="tablist" aria-label="Project process steps" ref={tabListRef} onKeyDown={onTabKeyDown}>
              {processSteps.map((item, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={item.number}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`process-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls="process-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={`pr-tab ${isActive ? "is-active" : ""} ${fills[index] >= 1 ? "is-done" : ""}`}
                    onClick={() => scrollToStep(index)}
                  >
                    <span className="pr-tab-bar" aria-hidden="true">
                      <span className="pr-fill" style={{ transform: `scaleX(${fills[index] || 0})` }} />
                    </span>
                    <span className="pr-tab-num">{item.number}</span>
                    <span className="pr-tab-title">{item.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="pr-panel" id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${active}`}>
              <div className="pr-content">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={`ghost-${active}`}
                    className="pr-ghost"
                    aria-hidden="true"
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
                  >
                    {step.number}
                  </motion.span>
                </AnimatePresence>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    className="pr-body"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: reduceMotion ? 0 : 0.34, ease }}
                  >
                    <div className="pr-meta">
                      <span className="pr-icon" aria-hidden="true">
                        <Icon size={20} strokeWidth={1.8} />
                      </span>
                      <span className="pr-chip">{step.duration}</span>
                      <span className="pr-count">
                        Step {step.number} / {String(total).padStart(2, "0")}
                      </span>
                    </div>

                    <h3>{step.title}</h3>
                    <p>{step.description}</p>

                    <ul className="pr-points">
                      {step.points.map((point) => (
                        <li key={point}>
                          <span className="pr-check" aria-hidden="true">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                <div className="pr-controls">
                  <button
                    type="button"
                    className="pr-ctrl"
                    aria-label="Previous step"
                    disabled={active === 0}
                    onClick={() => scrollToStep(active - 1)}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="pr-ctrl"
                    aria-label="Next step"
                    disabled={active === total - 1}
                    onClick={() => scrollToStep(active + 1)}
                  >
                    <ArrowRight size={18} />
                  </button>
                  <span className="pr-scroll-hint">
                    <MousePointer2 size={13} aria-hidden="true" />
                    Scroll to continue
                  </span>
                </div>
              </div>

              <div className="pr-visual" aria-hidden="true">
                {processSteps.map((item, index) => (
                  <img
                    key={item.number}
                    className={`pr-img ${index === active ? "is-active" : ""}`}
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                <div className="pr-visual-shade" />
                <div className="pr-visual-sheen" />
                <div className="pr-visual-badge">
                  <strong>{step.number}</strong>
                  <span>{step.title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <ScrollReveal y={26} delay={0.08}>
          <div className="pr-facts">
            {facts.map(({ icon: FactIcon, label, text }) => (
              <div className="pr-fact" key={label}>
                <span className="pr-fact-icon" aria-hidden="true">
                  <FactIcon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <strong>{label}</strong>
                  <span>{text}</span>
                </div>
              </div>
            ))}
            <Button href="#contact" variant="primary" size="small" icon={<ArrowUpRight size={16} />}>
              Start your project
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
