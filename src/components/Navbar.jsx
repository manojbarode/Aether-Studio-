import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand.jsx";
import Button from "./Button.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { navLinks } from "../data/site.js";
import { useScrollProgress } from "../hooks/useScrollProgress.js";

const sectionIds = navLinks.map((link) => link.id);

export default function Navbar({ theme, toggleTheme }) {
  const { scrolled, activeSection } = useScrollProgress(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-menu-open" : ""}`}>
      <div className="container nav-inner">
        <Brand onClick={closeMenu} />

        <nav className="nav-links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link ${activeSection === link.id ? "is-active" : ""}`}
              aria-current={activeSection === link.id ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Button href="#contact" variant="primary" size="small" icon={<ArrowUpRight size={16} />}>
            Let&apos;s Talk
          </Button>
          <button
            type="button"
            className="mobile-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="container mobile-menu-inner" aria-label="Mobile navigation">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`mobile-nav-link ${activeSection === link.id ? "is-active" : ""}`}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + index * 0.045, duration: 0.3 }}
                >
                  {link.label}
                  <span aria-hidden="true">0{index + 1}</span>
                </motion.a>
              ))}
              <Button href="#contact" variant="primary" className="button-full" onClick={closeMenu}>
                Start a Project
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
