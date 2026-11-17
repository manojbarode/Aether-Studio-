import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Layers3 } from "lucide-react";

export default function ProjectCard({ project, onOpen }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      className={`project-card ${project.bento ? `bento-${project.bento}` : ""}`}
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.985 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], layout: { duration: 0.35 } }}
    >
      <button
        type="button"
        className="project-card-trigger"
        onClick={() => onOpen(project)}
        aria-label={`View details for ${project.title}`}
      >
        <span className="project-image-wrap">
          <img
            src={project.image}
            alt={project.alt}
            width="960"
            height="600"
            loading="lazy"
            decoding="async"
          />
          <span className="project-overlay">
            <span className="project-overlay-content">
              <span className="project-overlay-kicker"><Layers3 size={14} aria-hidden="true" /> Selected case study</span>
              <span className="project-overlay-title">{project.title}</span>
              <span className="project-overlay-description">{project.description}</span>
              <span className="project-open-label">
                Explore project <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </span>
          </span>
        </span>
      </button>
    </motion.article>
  );
}
