import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Gauge,
  LayoutDashboard,
  Monitor,
  PenTool,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import Button from "../components/Button.jsx";
import {
  calculateBlueprint,
  createBriefText,
  defaultPlannerConfig,
  designDepths,
  plannerAddons,
  plannerFoundations,
  plannerPaces,
} from "../data/projectPlanner.js";

const iconMap = { Monitor, ShoppingBag, LayoutDashboard, PenTool, RefreshCw };
const STORAGE_KEY = "aether-project-planner";
const ease = [0.16, 1, 0.3, 1];

function getSavedConfig() {
  if (typeof window === "undefined") return defaultPlannerConfig;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return defaultPlannerConfig;
    const foundation = plannerFoundations.some((item) => item.id === saved.foundation)
      ? saved.foundation
      : defaultPlannerConfig.foundation;
    return {
      foundation,
      pages: Math.min(20, Math.max(1, Number(saved.pages) || defaultPlannerConfig.pages)),
      depth: designDepths.some((item) => item.id === saved.depth) ? saved.depth : defaultPlannerConfig.depth,
      addons: Array.isArray(saved.addons)
        ? saved.addons.filter((id) => plannerAddons.some((item) => item.id === id))
        : defaultPlannerConfig.addons,
      pace: plannerPaces.some((item) => item.id === saved.pace) ? saved.pace : defaultPlannerConfig.pace,
    };
  } catch {
    return defaultPlannerConfig;
  }
}

export default function ProjectPlanner() {
  const [config, setConfig] = useState(getSavedConfig);
  const [status, setStatus] = useState(null);
  const statusTimer = useRef(null);
  const reduceMotion = useReducedMotion();
  const blueprint = useMemo(() => calculateBlueprint(config), [config]);
  const briefText = useMemo(() => createBriefText(config, blueprint), [config, blueprint]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // The planner remains fully usable when storage is unavailable.
    }
  }, [config]);

  useEffect(() => () => window.clearTimeout(statusTimer.current), []);

  const notify = (message, type = "success") => {
    window.clearTimeout(statusTimer.current);
    setStatus({ message, type });
    statusTimer.current = window.setTimeout(() => setStatus(null), 3800);
  };

  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));

  const chooseFoundation = (id) => {
    const foundation = plannerFoundations.find((item) => item.id === id);
    setConfig((current) => ({ ...current, foundation: id, pages: foundation.includedPages }));
  };

  const toggleAddon = (id) => {
    setConfig((current) => ({
      ...current,
      addons: current.addons.includes(id)
        ? current.addons.filter((item) => item !== id)
        : [...current.addons, id],
    }));
  };

  const reset = () => {
    setConfig(defaultPlannerConfig);
    notify("Planner reset to the recommended starting point.");
  };

  const copyBrief = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(briefText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = briefText;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Copy unavailable");
      }
      notify("Blueprint copied to your clipboard.");
    } catch {
      notify("Clipboard access is unavailable. Download the brief instead.", "error");
    }
  };

  const downloadBrief = () => {
    const blob = new Blob([briefText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aether-${blueprint.foundation.id}-blueprint.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    notify("Blueprint downloaded as a text file.");
  };

  const useInContact = () => {
    window.dispatchEvent(
      new CustomEvent("aether:project-brief", {
        detail: {
          projectType: blueprint.foundation.contactType,
          budget: blueprint.budget,
          details: briefText,
        },
      })
    );
    notify("Your blueprint is ready in the contact form below.");
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }, 80);
  };

  return (
    <section id="planner" className="section planner-section" aria-labelledby="planner-title">
      <div className="container">
        <SectionHeading
          eyebrow="Interactive Project Planner"
          title="Your Idea."
          accent="A Clear Blueprint."
          headingId="planner-title"
          description="Shape a practical starting point for your project. Adjust the scope and see a live investment range, timeline, and deliverables — no sign-up needed."
        />

        <div className="planner-layout">
          <ScrollReveal className="planner-builder" y={28}>
            <div className="planner-builder-head">
              <span className="planner-step-label">
                <SlidersHorizontal size={15} aria-hidden="true" />
                Configure your project
              </span>
              <button type="button" className="planner-reset" onClick={reset}>
                <RotateCcw size={13} aria-hidden="true" />
                Reset
              </button>
            </div>

            <fieldset className="planner-group">
              <legend>
                <span>01</span> Choose a foundation
              </legend>
              <div className="planner-foundations">
                {plannerFoundations.map((item) => {
                  const Icon = iconMap[item.icon] || Monitor;
                  const selected = config.foundation === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`planner-foundation ${selected ? "is-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => chooseFoundation(item.id)}
                    >
                      <span className="planner-foundation-icon" aria-hidden="true">
                        <Icon size={18} strokeWidth={1.8} />
                      </span>
                      <span>{item.label}</span>
                      {selected && <Check size={14} className="planner-selected-check" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="planner-group planner-scope-group">
              <legend>
                <span>02</span> Define the scope
              </legend>
              <div className="planner-range-head">
                <label htmlFor="planner-pages">Estimated pages or core screens</label>
                <output htmlFor="planner-pages">{config.pages}</output>
              </div>
              <input
                id="planner-pages"
                className="planner-range"
                type="range"
                min="1"
                max="20"
                step="1"
                value={config.pages}
                style={{ "--range-progress": `${((config.pages - 1) / 19) * 100}%` }}
                onChange={(event) => update("pages", Number(event.target.value))}
              />
              <div className="planner-range-labels" aria-hidden="true">
                <span>1 focused page</span>
                <span>20 screens</span>
              </div>
            </fieldset>

            <fieldset className="planner-group">
              <legend>
                <span>03</span> Pick the design depth
              </legend>
              <div className="planner-segment-grid">
                {designDepths.map((item) => (
                  <label className={`planner-segment ${config.depth === item.id ? "is-selected" : ""}`} key={item.id}>
                    <input
                      type="radio"
                      name="design-depth"
                      value={item.id}
                      checked={config.depth === item.id}
                      onChange={() => update("depth", item.id)}
                    />
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="planner-group">
              <legend>
                <span>04</span> Add useful extras
              </legend>
              <div className="planner-addons">
                {plannerAddons.map((item) => {
                  const checked = config.addons.includes(item.id);
                  return (
                    <label className={`planner-addon ${checked ? "is-selected" : ""}`} key={item.id}>
                      <input type="checkbox" checked={checked} onChange={() => toggleAddon(item.id)} />
                      <span className="planner-checkbox" aria-hidden="true">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="planner-addon-copy">
                        <strong>{item.label}</strong>
                        <span>{item.note}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="planner-group planner-group--last">
              <legend>
                <span>05</span> Choose your pace
              </legend>
              <div className="planner-segment-grid">
                {plannerPaces.map((item) => (
                  <label className={`planner-segment ${config.pace === item.id ? "is-selected" : ""}`} key={item.id}>
                    <input
                      type="radio"
                      name="delivery-pace"
                      value={item.id}
                      checked={config.pace === item.id}
                      onChange={() => update("pace", item.id)}
                    />
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </ScrollReveal>

          <ScrollReveal className="planner-result" y={34} delay={0.08}>
            <div className="planner-result-glow" aria-hidden="true" />
            <div className="planner-result-head">
              <span>
                <Sparkles size={15} aria-hidden="true" />
                Live blueprint
              </span>
              <span className="planner-live-dot">Updates instantly</span>
            </div>

            <div className="planner-result-type">Project snapshot</div>
            <div className="planner-estimate-label">Selected foundation</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${blueprint.foundation.id}-${blueprint.pages}-${blueprint.depth.id}-${blueprint.selectedAddons.length}-${blueprint.pace.id}`}
                className="planner-estimate"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
              >
                {blueprint.foundation.label}
              </motion.div>
            </AnimatePresence>

            <p className="planner-summary">{blueprint.foundation.summary}</p>

            <div className="planner-timeline">
              <Clock3 size={18} aria-hidden="true" />
              <div>
                <strong>{blueprint.minWeeks}–{blueprint.maxWeeks} weeks</strong>
                <span>Indicative design & build window</span>
              </div>
            </div>

            <div className="planner-summary-chips" aria-label="Selected project configuration">
              <span>{blueprint.pages} pages</span>
              <span>{blueprint.depth.label}</span>
              <span>{blueprint.pace.label}</span>
            </div>

            <div className="planner-breakdown">
              <div className="planner-breakdown-title">
                <span>Scope at a glance</span>
                <Gauge size={15} aria-hidden="true" />
              </div>
              <div className="planner-mix-bar" aria-hidden="true">
                {blueprint.parts.map((part) => (
                  <span
                    key={part.id}
                    className={`planner-mix-segment planner-mix-segment--${part.tone}`}
                    style={{ width: `${part.percentage}%` }}
                  />
                ))}
              </div>
              <div className="planner-mix-legend">
                {blueprint.parts.map((part) => (
                  <div key={part.id}>
                    <span>
                      <i className={`planner-mix-dot planner-mix-dot--${part.tone}`} />
                      {part.label}
                    </span>
                    <strong>{part.summary}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="planner-deliverables">
              <span className="planner-small-label">Expected deliverables</span>
              <ul>
                {blueprint.deliverables.map((item) => (
                  <li key={item}>
                    <Check size={14} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="planner-actions">
              <Button variant="primary" className="button-full" onClick={useInContact} icon={<ArrowUpRight size={16} />}>
                Use this brief
              </Button>
              <div className="planner-secondary-actions">
                <button type="button" onClick={copyBrief}>
                  <Copy size={15} aria-hidden="true" />
                  Copy
                </button>
                <button type="button" onClick={downloadBrief}>
                  <Download size={15} aria-hidden="true" />
                  Download
                </button>
              </div>
            </div>

            <div className="planner-status" aria-live="polite">
              {status && (
                <span className={status.type === "error" ? "is-error" : ""}>
                  {status.type === "success" && <CheckCircle2 size={14} aria-hidden="true" />}
                  {status.message}
                </span>
              )}
            </div>

            <p className="planner-disclaimer">
              Planning outline only. We will discuss the right scope, budget, and timing together after discovery.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
