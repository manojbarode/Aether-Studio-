import ScrollReveal from "./ScrollReveal.jsx";

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "split",
  small = false,
  headingId,
  children,
}) {
  return (
    <ScrollReveal
      className={`section-header ${align === "center" ? "section-header--center" : ""}`}
      y={30}
    >
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className={`section-title ${small ? "section-title-sm" : ""}`} id={headingId}>
          {title}
          {accent && (
            <>
              {" "}
              <span className="serif-accent">{accent}</span>
            </>
          )}
        </h2>
        {children}
      </div>
      {description && <p className="section-description">{description}</p>}
    </ScrollReveal>
  );
}
