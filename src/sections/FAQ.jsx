import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import Button from "../components/Button.jsx";
import { faqs } from "../data/faqs.js";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section id="faq" className="section section--tight" aria-labelledby="faq-title">
      <div className="container">
        <div className="faq-layout">
          <ScrollReveal className="faq-aside" y={26}>
            <span className="eyebrow">Good to Know</span>
            <h2 id="faq-title" className="section-title section-title-sm">
              Frequently Asked <span className="serif-accent">Questions.</span>
            </h2>
            <p className="section-description">
              Clear answers before we begin. If your question is not here, we would love to hear from you.
            </p>
            <div className="faq-cta">
              <strong>Still have a question?</strong>
              <p>Tell us what you are planning and we will point you in the right direction.</p>
              <Button href="#contact" variant="secondary" size="small" icon={<ArrowUpRight size={15} />}>
                Ask us directly
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal className="faq-list" delay={0.08} y={26}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
                  <button
                    type="button"
                    className="faq-question"
                    id={`faq-question-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggle(index)}
                  >
                    {faq.question}
                    <span className="faq-icon" aria-hidden="true">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        className="faq-answer-wrap"
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0.12 : 0.36, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="faq-answer">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
