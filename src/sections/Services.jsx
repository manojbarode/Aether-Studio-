import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import ServiceModal from "../components/ServiceModal.jsx";
import Button from "../components/Button.jsx";
import { serviceGroups, services } from "../data/services.js";

export default function Services() {
  const [activeGroup, setActiveGroup] = useState("All Services");
  const [paused, setPaused] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const reduceMotion = useReducedMotion();

  const visibleServices =
    activeGroup === "All Services" ? services : services.filter((service) => service.group === activeGroup);

  const countFor = (group) =>
    group === "All Services" ? services.length : services.filter((service) => service.group === group).length;

  const doubledServices = useMemo(() => [...visibleServices, ...visibleServices], [visibleServices]);

  const scrollClass =
    visibleServices.length < 2 || paused || reduceMotion ? "services-marquee-track is-paused" : "services-marquee-track";

  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          eyebrow="Our Expertise"
          title="What We Do"
          headingId="services-title"
          description="We combine strategy, creativity, and technology to deliver digital solutions that help your business move forward."
        />

        <div className="services-toolbar">
          <div className="filter-bar" role="group" aria-label="Filter services by category">
            {serviceGroups.map((group) => (
              <button
                key={group}
                type="button"
                className={`filter-button ${activeGroup === group ? "is-active" : ""}`}
                aria-pressed={activeGroup === group}
                onClick={() => setActiveGroup(group)}
              >
                {group}
                <span className="filter-count" aria-hidden="true">
                  {countFor(group)}
                </span>
              </button>
            ))}
          </div>

          <div className="services-live-indicator" aria-live="polite">
            <span className="pill-dot" aria-hidden="true" />
            {visibleServices.length < 2 || reduceMotion
              ? `${visibleServices.length} service${visibleServices.length === 1 ? "" : "s"} shown`
              : paused
                ? "Carousel paused"
                : "Auto-scrolling showcase"}
          </div>
        </div>

        <motion.div
          key={activeGroup}
          className="services-marquee"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
          }}
        >
          <div className={scrollClass}>
            {doubledServices.map((service, index) => (
              <div
                className="services-slide"
                key={`${service.id}-${index}`}
                aria-hidden={index >= visibleServices.length ? "true" : undefined}
              >
                <ServiceCard service={service} onOpen={setSelectedService} />
              </div>
            ))}
          </div>
        </motion.div>

        <ScrollReveal className="services-footer" delay={0.1}>
          <div>
            <span className="services-footer-label">Tailored to your ambition</span>
            <p>Need a combination of these services, or something entirely different?</p>
          </div>
          <Button href="#contact" variant="secondary" size="small" icon={<ArrowUpRight size={16} />}>
            Tell us about it
          </Button>
        </ScrollReveal>
      </div>

      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </section>
  );
}
