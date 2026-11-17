import SectionHeading from "../components/SectionHeading.jsx";
import { technologies } from "../data/technologies.js";
import {
  siBootstrap,
  siCss,
  siFigma,
  siFramer,
  siGit,
  siGithub,
  siGsap,
  siHtml5,
  siJavascript,
  siReact,
  siTailwindcss,
  siVite,
} from "simple-icons";

const firstRow = technologies.slice(0, 6);
const secondRow = technologies.slice(6);
const iconMap = {
  siHtml5,
  siCss,
  siJavascript,
  siReact,
  siVite,
  siTailwindcss,
  siBootstrap,
  siFramer,
  siGsap,
  siGit,
  siGithub,
  siFigma,
};

function TechTile({ item }) {
  const icon = iconMap[item.icon];

  return (
    <div className="tech-tile" style={{ "--tech-color": item.color }}>
      <span className="tech-mark" aria-hidden="true" title={`${item.name} logo`}>
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d={icon.path} />
        </svg>
      </span>
      <span>{item.name}</span>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }) {
  return (
    <div className={`marquee-shell ${reverse ? "marquee-shell--reverse" : ""}`}>
      <div className="marquee-track">
        <div className="marquee-group">
          {items.map((item) => (
            <TechTile key={item.name} item={item} />
          ))}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {items.map((item) => (
            <TechTile key={`${item.name}-duplicate`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Technologies() {
  return (
    <section id="technologies" className="section section--tight tech-section" aria-labelledby="tech-title">
      <div className="container">
        <SectionHeading
          eyebrow="Our Toolkit"
          title="Built With Modern"
          accent="Technology."
          align="center"
          small
          headingId="tech-title"
          description="A focused frontend stack chosen for speed, flexibility, maintainability, and expressive digital craft."
        />
      </div>

      <div className="tech-marquees" aria-label="Technologies we use">
        <MarqueeRow items={firstRow} />
        <MarqueeRow items={secondRow} reverse />
      </div>

      <div className="container">
        <p className="tech-caption">Continuous marquee · Hover to pause · Reduced motion supported</p>
      </div>
    </section>
  );
}
