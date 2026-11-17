import { useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight, MapPin, Phone } from "lucide-react";
import Brand from "./Brand.jsx";
import Button from "./Button.jsx";
import { navLinks, site } from "../data/site.js";
import { services } from "../data/services.js";

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <h2>
            Ready to make your brand <span className="serif-accent">unforgettable?</span>
          </h2>
          <Button href="#contact" variant="primary" icon={<ArrowUpRight size={17} />}>
            Start a Conversation
          </Button>
        </div>

        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand />
            <p>{site.intro}</p>
          </div>

          <nav className="footer-column" aria-label="Footer navigation">
            <h3>Explore</h3>
            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-column footer-column--services" aria-label="Footer services">
            <h3>Services</h3>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <a href="#services">{service.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-column">
            <h3>Get in Touch</h3>
            <ul>
              <li>
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
                  <Phone size={13} aria-hidden="true" /> {site.phone}
                </a>
              </li>
              <li>
                <span>
                  <MapPin size={13} aria-hidden="true" /> {site.location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {site.name} Studio. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            <a href="#home">Privacy-friendly, frontend-only demo</a>
            <span aria-hidden="true">·</span>
            <button type="button" className="footer-top-button" onClick={backToTop}>
              Back to top <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
