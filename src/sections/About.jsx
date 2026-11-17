import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import Button from "../components/Button.jsx";

gsap.registerPlugin(ScrollTrigger);

const COPY = {
  line1: "Creative Minds.",
  line2: "Digital Excellence.",
  p1: "Aether is an independent digital studio for brands that care about how their work is experienced. We bring strategy, design, and frontend engineering together in one focused, collaborative process.",
  p2: "Our creative philosophy is simple: remove the unnecessary, make the essential feel effortless, and give every detail a reason to exist.",
  note: "Remove the unnecessary, elevate the essential, and build interfaces that feel calm, clear, and memorable at every breakpoint.",
};

const principles = [
  {
    number: "01",
    label: "Our Vision",
    title: "Digital with feeling",
    description: "Make every interaction purposeful, beautiful, and unmistakably human.",
  },
  {
    number: "02",
    label: "Our Mission",
    title: "Build what moves you",
    description: "Turn ambitious ideas into dependable experiences that help brands grow.",
  },
  {
    number: "03",
    label: "Our Approach",
    title: "Clarity before craft",
    description: "Understand the problem, simplify the path, then obsess over every detail.",
  },
];

/**
 * Text that "types" while scrolling. The full text is always laid out (the
 * untyped remainder is just hidden), so words never jump between lines.
 */
function TypeText({ id, text, as: Tag = "span", className = "" }) {
  return (
    <Tag className={`tw ${className}`} data-tw={id} data-text={text} aria-hidden="true">
      <span className="tw-on" />
      <span className="tw-off">{text}</span>
    </Tag>
  );
}

function typeInto(timeline, element, at, duration) {
  if (!element) return;
  const on = element.querySelector(".tw-on");
  const off = element.querySelector(".tw-off");
  const text = element.dataset.text || "";
  const state = { n: 0 };

  const apply = () => {
    const count = Math.round(state.n);
    on.textContent = text.slice(0, count);
    off.textContent = text.slice(count);
    element.classList.toggle("is-typing", count > 0 && count < text.length);
  };

  timeline.to(
    state,
    {
      n: text.length,
      duration,
      ease: "none",
      onUpdate: apply,
      onComplete: apply,
      onReverseComplete: apply,
    },
    at
  );
}

export default function About() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 768px)" },
      (context) => {
        // Reduced motion: keep the static, fully visible layout.
        if (!context.conditions.motion) return undefined;

        const { mobile } = context.conditions;
        const one = (selector) => root.querySelector(selector);
        const tw = (id) => root.querySelector(`[data-tw="${id}"]`);

        root.classList.add("is-scrub");

        const startClip = mobile
          ? "inset(40% 30% 32% 30% round 22px)"
          : "inset(40% 42% 32% 42% round 28px)";
        const endClip = "inset(0% 0% 0% 0% round 0px)";

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: one(".about-track"),
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        // 1. Small image grows to full screen.
        timeline.fromTo(one(".about-media"), { clipPath: startClip }, { clipPath: endClip, duration: 1.4, ease: "power2.inOut" }, 0);
        timeline.fromTo(one(".about-media img"), { scale: 1.4 }, { scale: 1, duration: 1.6, ease: "power1.out" }, 0);
        timeline.to(one(".about-hint"), { opacity: 0, duration: 0.2 }, 0);
        timeline.to(one(".about-preface"), { opacity: 0, y: -36, duration: 0.5 }, 0.55);
        timeline.fromTo(one(".about-media-shade"), { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.9);

        // 2. Copy types in over the full-screen image.
        timeline.fromTo(one(".about-overlay-meta"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35 }, 1.35);
        typeInto(timeline, tw("line1"), 1.5, 0.5);
        typeInto(timeline, tw("line2"), 2.0, 0.55);
        typeInto(timeline, tw("p1"), 2.55, 1.0);
        typeInto(timeline, tw("p2"), 3.55, 0.8);

        // 3. Supporting details arrive last.
        timeline.fromTo(
          root.querySelectorAll(".about-aside-item"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
          3.9
        );
        typeInto(timeline, tw("note"), 4.2, 0.7);

        // Short hold so the finished frame rests before the page scrolls on.
        timeline.to({}, { duration: 0.5 }, 5.0);

        return () => root.classList.remove("is-scrub");
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="about" className="about-scroll" aria-labelledby="about-title" ref={rootRef}>
      <h2 id="about-title" className="sr-only">
        {COPY.line1} {COPY.line2}
      </h2>
      <p className="sr-only">
        {COPY.p1} {COPY.p2}
      </p>

      <div className="about-track">
        <div className="about-stage">
          <div className="about-media">
            <img
              src="/images/about-studio.jpg"
              alt="Minimal creative studio desk with a laptop showing an abstract blue and violet interface"
              width="1448"
              height="1086"
              loading="lazy"
              decoding="async"
            />
            <div className="about-media-shade" />
          </div>

          <div className="about-preface" aria-hidden="true">
            <span className="eyebrow">About Aether</span>
            <p className="about-preface-title">
              Creative Minds.
              <span className="serif-accent">Digital Excellence.</span>
            </p>
          </div>

          <div className="about-hint" aria-hidden="true">
            Scroll to expand
            <ChevronDown size={16} />
          </div>

          <div className="about-overlay">
            <div className="about-overlay-inner">
              <div className="about-overlay-copy">
                <div className="about-overlay-meta">
                  <span className="eyebrow">About Aether</span>
                </div>

                <p className="about-title" aria-hidden="true">
                  <TypeText id="line1" text={COPY.line1} />
                  <TypeText id="line2" text={COPY.line2} className="serif-accent tw--accent" />
                </p>

                <p className="about-overlay-text">
                  <TypeText id="p1" text={COPY.p1} />
                </p>
                <p className="about-overlay-text about-overlay-text--soft">
                  <TypeText id="p2" text={COPY.p2} />
                </p>
              </div>

              <div className="about-aside">
                <div className="about-aside-item about-note">
                  <span className="about-note-label">Creative working philosophy</span>
                  <p>
                    <TypeText id="note" text={COPY.note} />
                  </p>
                </div>

                <div className="about-aside-item about-caption">
                  <div>
                    <strong>Designed with intention</strong>
                    <span>Independent · Remote · Worldwide</span>
                  </div>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-details section--tight">
        <div className="container">
          <ScrollReveal className="about-principles about-principles--editorial" y={30}>
            {principles.map((principle) => (
              <div className="about-principle about-principle--editorial" key={principle.label}>
                <div className="about-principle-head">
                  <span>{principle.label}</span>
                  <strong>{principle.number}</strong>
                </div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            ))}
          </ScrollReveal>

          <div className="about-details-cta">
            <Button href="#process" variant="secondary" icon={<ArrowUpRight size={16} />}>
              See how we work
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
