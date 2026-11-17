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
            return (
              <ScrollReveal key={feature.title} delay={Math.min(index * 0.055, 0.35)} y={26}>
                <article className="glass-card why-card">
                  <span className="why-card-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div className="card-content">
                    <span className="icon-box" aria-hidden="true">
                      <Icon size={21} strokeWidth={1.8} />
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
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
