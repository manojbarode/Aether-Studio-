import { useState } from "react";
import {
  Braces,
  Clock3,
  Eye,
  Focus,
  MessageSquare,
  Palette,
  Smartphone,
  Waves,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { whyFeatures } from "../data/site.js";

const iconMap = {
  Palette,
  Smartphone,
  Braces,
  Focus,
  Waves,
  MessageSquare,
  Clock3,
  Eye,
};

export default function WhyChooseUs() {
  const [flippedCards, setFlippedCards] = useState(() => new Set());

  const toggleCard = (title) => {
    setFlippedCards((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <section id="why-us" className="section section--tight" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading
          eyebrow="The Aether Difference"
          title="Why Work With Us?"
          headingId="why-title"
          description="A senior, detail-led partnership from first conversation to final pixel — without the agency overhead."
        />

        <div className="why-grid">
          {whyFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon] || SparklesFallback;
            const isFlipped = flippedCards.has(feature.title);
            return (
              <ScrollReveal key={feature.title} delay={Math.min(index * 0.055, 0.35)} y={26}>
                <article className={`glass-card why-card ${isFlipped ? "is-flipped" : ""}`}>
                  <button
                    type="button"
                    className="why-card-toggle"
                    aria-pressed={isFlipped}
                    aria-label={`${isFlipped ? "Show overview for" : "Explore"} ${feature.title}`}
                    onClick={() => toggleCard(feature.title)}
                  >
                    <span className="why-card-flip-inner">
                      <span className="why-card-face why-card-front" aria-hidden={isFlipped}>
                        <span className="why-card-number" aria-hidden="true">0{index + 1}</span>
                        <span className="icon-box" aria-hidden="true"><Icon size={21} strokeWidth={1.8} /></span>
                        <span className="why-card-title">{feature.title}</span>
                        <span className="why-card-description">{feature.description}</span>
                        <span className="why-card-hint">Tap to discover <span aria-hidden="true">↗</span></span>
                      </span>
                      <span className="why-card-face why-card-back" aria-hidden={!isFlipped}>
                        <span className="why-card-back-top">
                          <span className="why-card-back-icon"><Icon size={19} strokeWidth={1.8} /></span>
                          <span className="why-card-back-label">The Aether standard</span>
                        </span>
                        <span className="why-card-back-title">Made with intention.</span>
                        <span className="why-card-description">{feature.detail}</span>
                        <span className="why-card-tags">
                          {feature.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </span>
                        <span className="why-card-hint">Tap to flip back <span aria-hidden="true">↶</span></span>
                      </span>
                    </span>
                  </button>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SparklesFallback(props) {
  return <Palette {...props} />;
}
