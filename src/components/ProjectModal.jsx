import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, X } from "lucide-react";

export default function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!project) return undefined;

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
        dialogRef.current.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
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
  }, [project, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              ref={closeRef}
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close project details"
            >
              <X size={19} />
            </button>

            <img className="modal-image" src={project.image} alt={project.alt} width="960" height="480" />

            <div className="modal-body">
              <div className="project-modal-heading">
                <div className="modal-meta">
                  <span className="pill">{project.category}</span>
                  <span className="pill">{project.year}</span>
                </div>
                <span className="project-modal-index">CASE STUDY / {project.id.toUpperCase()}</span>
              </div>
              <div className="project-modal-tags" aria-label="Project technologies">
                {project.tags.map((tag) => (
                  <span className="project-modal-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <h2 id="project-modal-title">{project.title}</h2>
              <p className="modal-summary">{project.description}</p>

              <div className="modal-columns">
                <div>
                  <h3>The Challenge</h3>
                  <p>{project.challenge}</p>
                </div>
                <div>
                  <h3>Our Solution</h3>
                  <p>{project.solution}</p>
                </div>
              </div>

              <div className="modal-deliverables">
                <h3>Deliverables</h3>
                <ul>
                  {project.deliverables.map((item) => (
                    <li key={item}>
                      <Check size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project-modal-cta">
                <div>
                  <strong>Have a similar project in mind?</strong>
                  <span>Let’s plan a digital experience built around your goals.</span>
                </div>
                <a className="button button-primary" href="#contact" onClick={onClose}>
                  Start a project <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>

              <p className="modal-disclaimer">
                Concept case study with placeholder visuals and sample copy. Replace with verified project details before publishing.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
