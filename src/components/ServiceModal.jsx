import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Clock3, Package, Wrench, X } from "lucide-react";

const requestPortfolioFilter = (category) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("aether:portfolio-filter", { detail: category }));
  }
};

export default function ServiceModal({ service, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!service) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    };
  }, [service, onClose]);

  if (typeof document === "undefined") return null;

  const goToPortfolio = (category) => {
    requestPortfolioFilter(category);
    onClose();
    window.setTimeout(() => {
      document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const goToContact = () => {
    onClose();
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return createPortal(
    <AnimatePresence>
      {service && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            className="project-modal service-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              ref={closeRef}
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close service details"
            >
              <X size={18} />
            </button>

            <div className="service-modal-hero">
              <img src={service.image} alt={service.imageAlt} className="service-modal-image" width="1200" height="700" />
              <div className="service-modal-scrim" aria-hidden="true" />
              <div className="service-modal-hero-content">
                <div className="service-modal-badges">
                  <span className="pill">{service.group}</span>
                  <span className="pill">{service.number} / 06</span>
                </div>
                <h2 id="service-modal-title">{service.title}</h2>
                <p>{service.description}</p>
              </div>
            </div>

            <div className="modal-body service-modal-body">
              <div className="service-modal-grid">
                <div>
                  <h3>Overview</h3>
                  <p className="modal-summary">{service.intro}</p>

                  <div className="service-modal-includes">
                    {service.items.slice(0, 4).map((item) => (
                      <span className="service-modal-chip" key={item}>
                        <Check size={13} aria-hidden="true" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="service-modal-aside">
                  <div className="service-modal-fact">
                    <span>
                      <Clock3 size={15} aria-hidden="true" />
                      Typical timeline
                    </span>
                    <strong>{service.timeline}</strong>
                  </div>
                  <div className="service-modal-fact">
                    <span>
                      <Wrench size={15} aria-hidden="true" />
                      Engagement
                    </span>
                    <strong>{service.engagement}</strong>
                  </div>
                  <div className="service-modal-fact service-modal-fact--stack">
                    <span>
                      <Package size={15} aria-hidden="true" />
                      Related categories
                    </span>
                    <div className="service-modal-category-list">
                      {service.categories.slice(0, 3).map((category) => (
                        <button
                          type="button"
                          key={category}
                          className="service-related-chip"
                          onClick={() => goToPortfolio(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="service-modal-actions">
                <button type="button" className="button button-primary" onClick={goToContact}>
                  Discuss this service
                  <span className="button-icon button-icon--arrow">
                    <ArrowUpRight size={16} />
                  </span>
                </button>
                <button type="button" className="button button-secondary" onClick={onClose}>
                  Close popup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
