import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import Button from "../components/Button.jsx";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  budget: "",
  details: "",
};

const projectTypes = [
  "Website Design & Development",
  "UI/UX Design",
  "E-commerce Development",
  "Web Application Development",
  "Website Redesign",
  "Maintenance & Optimization",
  "Something else",
];

const budgets = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
  "Not sure yet",
];

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.phone.trim() && !/^[+()\d\s-]{7,}$/.test(values.phone.trim()))
    errors.phone = "Please enter a valid phone number or leave this blank.";
  if (!values.projectType) errors.projectType = "Please choose a project type.";
  if (!values.budget) errors.budget = "Please choose an estimated budget.";
  if (values.details.trim().length < 20)
    errors.details = "Please share at least 20 characters about your project.";
  return errors;
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  placeholder = "",
  options = null,
  textarea = false,
  full = false,
  autoComplete,
}) {
  const id = `contact-${name}`;
  const shared = {
    id,
    name,
    value,
    onChange,
    placeholder,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    autoComplete,
  };

  return (
    <div className={`form-field ${full ? "form-field--full" : ""}`}>
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {options ? (
        <select {...shared}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea {...shared} rows={5} />
      ) : (
        <input {...shared} type={type} inputMode={type === "email" ? "email" : type === "tel" ? "tel" : undefined} />
      )}
      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [plannerLoaded, setPlannerLoaded] = useState(false);

  useEffect(() => {
    const receiveBrief = (event) => {
      const detail = event.detail;
      if (!detail || typeof detail !== "object") return;
      setSubmitted(null);
      setErrors({});
      setPlannerLoaded(true);
      setForm((current) => ({
        ...current,
        projectType: detail.projectType || current.projectType,
        budget: detail.budget || current.budget,
        details: detail.details || current.details,
      }));
    };

    window.addEventListener("aether:project-brief", receiveBrief);
    return () => window.removeEventListener("aether:project-brief", receiveBrief);
  }, []);

  const handleChange = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setSubmitted({ ...form });
  };

  const editBrief = () => {
    setSubmitted(null);
    setForm(initialForm);
    setErrors({});
    setPlannerLoaded(false);
  };

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-layout">
          <ScrollReveal className="contact-intro" y={28}>
            <span className="eyebrow">Start a Conversation</span>
            <h2 id="contact-title">
              Have a Project in Mind?
              <br />
              <span className="serif-accent">Let&apos;s Build Something Amazing.</span>
            </h2>
            <p>
              Share a little about your idea, timeline, and goals. We will use it to start a focused
              conversation about the right digital solution for your business.
            </p>

          </ScrollReveal>

          <ScrollReveal className="contact-form-wrap" y={32} delay={0.08}>
            <div className="form-heading">
              <h3>Project brief</h3>
              <span>{plannerLoaded ? "Planner brief loaded" : "Frontend demo form"}</span>
            </div>

            {submitted ? (
              <div className="form-success" role="status">
                <h3>
                  <CheckCircle2 size={22} />
                  Demo brief validated
                </h3>
                <p>
                  Your information passed client-side validation, but <strong>no message was sent</strong>. This
                  is a frontend-only demo with no backend, database, or email service connected.
                </p>
                <dl>
                  <div>
                    <dt>Name</dt>
                    <dd>{submitted.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{submitted.email}</dd>
                  </div>
                  <div>
                    <dt>Project type</dt>
                    <dd>{submitted.projectType}</dd>
                  </div>
                  <div>
                    <dt>Estimated budget</dt>
                    <dd>{submitted.budget}</dd>
                  </div>
                </dl>
                <Button variant="secondary" onClick={editBrief}>
                  Edit another brief
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-describedby="form-demo-note">
                <div className="form-grid">
                  <Field
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    error={errors.name}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    error={errors.email}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                  <Field
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    error={errors.phone}
                    placeholder="Optional"
                    autoComplete="tel"
                  />
                  <Field
                    label="Company name"
                    name="company"
                    value={form.company}
                    onChange={(event) => handleChange("company", event.target.value)}
                    error={errors.company}
                    placeholder="Optional"
                    autoComplete="organization"
                  />
                  <Field
                    label="Project type"
                    name="projectType"
                    value={form.projectType}
                    onChange={(event) => handleChange("projectType", event.target.value)}
                    error={errors.projectType}
                    options={projectTypes}
                    required
                  />
                  <Field
                    label="Estimated budget"
                    name="budget"
                    value={form.budget}
                    onChange={(event) => handleChange("budget", event.target.value)}
                    error={errors.budget}
                    options={budgets}
                    required
                  />
                  <Field
                    label="Project details"
                    name="details"
                    value={form.details}
                    onChange={(event) => handleChange("details", event.target.value)}
                    error={errors.details}
                    placeholder="Tell us about your goals, timeline, pages, features, and anything else useful..."
                    textarea
                    full
                    required
                  />
                </div>

                <div className="form-footer">
                  <p id="form-demo-note">
                    Demo only · Validation happens in your browser. Nothing is transmitted or stored on a server.
                  </p>
                  <Button type="submit" variant="primary" icon={<Send size={16} />}>
                    Submit Demo Brief
                  </Button>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
