import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Preloader from "../components/Preloader.jsx";
import ScrollProgress from "../components/ScrollProgress.jsx";
import CursorGlow from "../components/CursorGlow.jsx";
import BackToTop from "../components/BackToTop.jsx";
import Hero from "../sections/Hero.jsx";
import Services from "../sections/Services.jsx";
import About from "../sections/About.jsx";
import WhyChooseUs from "../sections/WhyChooseUs.jsx";
import Portfolio from "../sections/Portfolio.jsx";
import Process from "../sections/Process.jsx";
import Technologies from "../sections/Technologies.jsx";
import ProjectPlanner from "../sections/ProjectPlanner.jsx";
import FAQ from "../sections/FAQ.jsx";
import Contact from "../sections/Contact.jsx";
import { useTheme } from "../hooks/useTheme.js";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const finishLoading = useCallback(() => setLoading(false), []);

  useEffect(() => {
    document.body.classList.toggle("preloader-open", loading);
    return () => document.body.classList.remove("preloader-open");
  }, [loading]);

  // Handle cross-page hand-offs: service detail page CTA/chips can ask the
  // home page to scroll to a section and pre-filter the portfolio.
  useEffect(() => {
    const state = location.state;
    if (!state || typeof state !== "object" || (!state.scrollTo && !state.portfolioFilter)) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      if (state.scrollTo) {
        document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (state.portfolioFilter) {
        window.dispatchEvent(new CustomEvent("aether:portfolio-filter", { detail: state.portfolioFilter }));
      }
    }, 1350);
    return () => window.clearTimeout(timer);
  }, [location.state]);

  return (
    <div className="site-shell">
      <div className="ambient-bg" aria-hidden="true" />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <AnimatePresence>{loading && <Preloader key="preloader" onDone={finishLoading} />}</AnimatePresence>

      <ScrollProgress />
      <CursorGlow />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main id="main-content">
        <Hero />
        <div className="section-line" aria-hidden="true" />
        <Services />
        <About />
        <div className="section-line" aria-hidden="true" />
        <WhyChooseUs />
        <Portfolio />
        <div className="section-line" aria-hidden="true" />
        <Process />
        <Technologies />
        <div className="section-line" aria-hidden="true" />
        <ProjectPlanner />
        <FAQ />
        <Contact />
      </main>

      <Footer theme={theme} />
      <BackToTop />
    </div>
  );
}
