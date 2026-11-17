export const plannerFoundations = [
  {
    id: "website",
    label: "Business Website",
    shortLabel: "Website",
    icon: "Monitor",
    contactType: "Website Design & Development",
    includedPages: 6,
    weeks: 4,
    summary: "A refined, responsive marketing website built around your brand and conversion goals.",
    deliverables: ["Responsive page design", "Reusable frontend components", "Contact & conversion touchpoints"],
  },
  {
    id: "ecommerce",
    label: "E-commerce Store",
    shortLabel: "E-commerce",
    icon: "ShoppingBag",
    contactType: "E-commerce Development",
    includedPages: 8,
    weeks: 6,
    summary: "A polished storefront with clear product discovery and a friction-light shopping journey.",
    deliverables: ["Storefront & product templates", "Responsive shopping flows", "Reusable commerce components"],
  },
  {
    id: "webapp",
    label: "Web Application",
    shortLabel: "Web App",
    icon: "LayoutDashboard",
    contactType: "Web Application Development",
    includedPages: 6,
    weeks: 8,
    summary: "A focused frontend application with clear workflows, dashboards, and interactive states.",
    deliverables: ["Application UI architecture", "Interactive dashboard states", "Scalable component patterns"],
  },
  {
    id: "uiux",
    label: "UI/UX Design",
    shortLabel: "UI/UX",
    icon: "PenTool",
    contactType: "UI/UX Design",
    includedPages: 5,
    weeks: 3,
    summary: "A complete interface design package from user flows to a developer-ready visual system.",
    deliverables: ["User flows & wireframes", "High-fidelity interface screens", "Developer-ready handoff"],
  },
  {
    id: "redesign",
    label: "Website Redesign",
    shortLabel: "Redesign",
    icon: "RefreshCw",
    contactType: "Website Redesign",
    includedPages: 5,
    weeks: 3,
    summary: "A strategic visual and usability refresh that preserves what already works.",
    deliverables: ["Current experience audit", "Refreshed responsive UI", "Performance-focused improvements"],
  },
];

export const designDepths = [
  { id: "essential", label: "Essential", note: "Clean, focused UI", effort: 1, weeks: 0 },
  { id: "signature", label: "Signature", note: "Custom visual system", effort: 2, weeks: 1 },
  { id: "immersive", label: "Immersive", note: "Advanced art direction", effort: 3, weeks: 2 },
];

export const plannerAddons = [
  { id: "motion", label: "Motion & interactions", note: "Scroll scenes and micro-interactions", weeks: 1 },
  { id: "cms", label: "CMS-ready structure", note: "Reusable, editable content patterns", weeks: 1 },
  { id: "integrations", label: "Frontend integrations", note: "Connect third-party service interfaces", weeks: 1 },
];

export const plannerPaces = [
  { id: "flexible", label: "Flexible", note: "Room to explore", weekDelta: 2 },
  { id: "standard", label: "Standard", note: "Balanced pace", weekDelta: 0 },
  { id: "fast", label: "Fast-track", note: "Priority delivery", weekDelta: -1 },
];

export const defaultPlannerConfig = {
  foundation: "website",
  pages: 6,
  depth: "signature",
  addons: ["motion"],
  pace: "standard",
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function calculateBlueprint(config) {
  const foundation = plannerFoundations.find((item) => item.id === config.foundation) || plannerFoundations[0];
  const depth = designDepths.find((item) => item.id === config.depth) || designDepths[1];
  const pace = plannerPaces.find((item) => item.id === config.pace) || plannerPaces[1];
  const selectedAddons = plannerAddons.filter((item) => config.addons.includes(item.id));
  const pages = clamp(Number(config.pages) || foundation.includedPages, 1, 20);
  const extraPages = Math.max(0, pages - foundation.includedPages);
  const addonWeeks = selectedAddons.reduce((sum, item) => sum + item.weeks, 0);
  const rawWeeks = foundation.weeks + Math.ceil(extraPages / 4) + depth.weeks + addonWeeks + pace.weekDelta;
  const minWeeks = clamp(rawWeeks, 2, 24);
  const maxWeeks = minWeeks + (depth.id === "immersive" ? 2 : 1);

  const parts = [
    { id: "core", label: "Core experience", summary: `${pages} screen${pages === 1 ? "" : "s"}`, weight: pages, tone: "blue" },
    { id: "design", label: "Design direction", summary: depth.label, weight: depth.effort, tone: "violet" },
    {
      id: "addons",
      label: "Selected extras",
      summary: `${selectedAddons.length} selected`,
      weight: Math.max(selectedAddons.length, 0.4),
      tone: "cyan",
    },
  ];
  const partsTotal = parts.reduce((sum, item) => sum + item.weight, 0) || 1;

  return {
    foundation,
    depth,
    pace,
    selectedAddons,
    pages,
    extraPages,
    minWeeks,
    maxWeeks,
    budget: "Not sure yet",
    parts: parts.map((part) => ({ ...part, percentage: (part.weight / partsTotal) * 100 })),
    deliverables: [
      ...foundation.deliverables,
      depth.id === "essential"
        ? "Focused, accessible interface styling"
        : depth.id === "signature"
          ? "Custom design tokens & interface states"
          : "Bespoke art direction & advanced motion language",
    ],
  };
}

export function createBriefText(config, blueprint) {
  const addons = blueprint.selectedAddons.length
    ? blueprint.selectedAddons.map((item) => item.label).join(", ")
    : "None selected";

  return [
    "AETHER STUDIO — PROJECT BLUEPRINT",
    "",
    `Project: ${blueprint.foundation.label}`,
    `Scope: ${blueprint.pages} page${blueprint.pages === 1 ? "" : "s"}`,
    `Design level: ${blueprint.depth.label} — ${blueprint.depth.note}`,
    `Delivery pace: ${blueprint.pace.label}`,
    `Add-ons: ${addons}`,
    `Indicative timeline: ${blueprint.minWeeks}–${blueprint.maxWeeks} weeks`,
    "",
    "Expected deliverables:",
    ...blueprint.deliverables.map((item) => `- ${item}`),
    "",
    blueprint.foundation.summary,
    "",
    "Client-side planning outline. Scope and schedule are reviewed together during discovery.",
  ].join("\n");
}