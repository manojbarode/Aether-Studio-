import { useEffect, useState } from "react";

const NO_SECTIONS = [];

export function useScrollProgress(sectionIds = NO_SECTIONS) {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "home");

  useEffect(() => {
    let frame = null;

    const update = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(Math.max(scrollTop / maxScroll, 0), 1));
      setScrolled(scrollTop > 24);

      if (sectionIds.length) {
        const marker = window.innerHeight * 0.38;
        let current = sectionIds[0];
        sectionIds.forEach((id) => {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= marker) current = id;
        });
        setActiveSection(current);
      }
      frame = null;
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return { progress, scrolled, activeSection };
}
