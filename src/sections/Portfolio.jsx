import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import SectionHeading from "../components/SectionHeading.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import ProjectModal from "../components/ProjectModal.jsx";
import { projectCategories, projects } from "../data/projects.js";

export default function Portfolio() {
  const [category, setCategory] = useState("All Projects");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(
    () => (category === "All Projects" ? projects : projects.filter((project) => project.category === category)),
    [category]
  );

  const closeModal = useCallback(() => setSelectedProject(null), []);

  // Service cards can request a portfolio filter ("Related work" chips).
  useEffect(() => {
    const onFilterRequest = (event) => {
      const category = event.detail;
      if (projectCategories.includes(category)) setCategory(category);
    };
    window.addEventListener("aether:portfolio-filter", onFilterRequest);
    return () => window.removeEventListener("aether:portfolio-filter", onFilterRequest);
  }, []);

  return (
    <section id="portfolio" className="section" aria-labelledby="portfolio-title">
      <div className="container">
        <SectionHeading
          eyebrow="Selected Work"
          title="Selected Work"
          accent="That Speaks."
          headingId="portfolio-title"
          description="A curated look at digital experiences shaped by strategy, visual craft, and thoughtful frontend engineering."
        />

        <div className="filter-bar" role="group" aria-label="Filter projects by category">
          {projectCategories.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-button ${category === item ? "is-active" : ""}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="portfolio-note">
          Concept case studies with realistic placeholder visuals — replace with live client work when available.
        </p>
        <p className="sr-only" aria-live="polite">
          {filteredProjects.length} projects shown in {category}.
        </p>

        <div className={`portfolio-grid ${category === "All Projects" ? "bento-grid" : ""}`}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={setSelectedProject} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="portfolio-empty">No projects in this category yet. Try another filter.</div>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={closeModal} />
    </section>
  );
}
