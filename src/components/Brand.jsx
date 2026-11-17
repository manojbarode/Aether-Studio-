import { site } from "../data/site.js";

function AetherMark() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="aether-mark-gradient" x1="7" y1="8" x2="41" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="1" stopColor="#E8EAFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M24 8.75 29.9 15l-5.56 5.37L18.65 15 24 8.75Z"
        fill="url(#aether-mark-gradient)"
      />
      <path
        d="M12.75 18.05h6.85v17.2h-6.85c-.9 0-1.63-.73-1.63-1.63V19.68c0-.9.73-1.63 1.63-1.63Z"
        fill="url(#aether-mark-gradient)"
        fillOpacity="0.92"
      />
      <path
        d="M28.4 18.05h6.85c.9 0 1.63.73 1.63 1.63v13.94c0 .9-.73 1.63-1.63 1.63H28.4v-17.2Z"
        fill="url(#aether-mark-gradient)"
        fillOpacity="0.92"
      />
      <path
        d="M21.1 22.05h5.8v17.2h-5.8z"
        fill="url(#aether-mark-gradient)"
        fillOpacity="0.96"
      />
      <path
        d="M15.25 26.65h17.5"
        stroke="#EEF1FF"
        strokeOpacity="0.92"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Brand({ onClick, compact = false, href = "#home" }) {
  return (
    <a className="brand" href={href} aria-label={`${site.name} Studio — back to home`} onClick={onClick}>
      <span className="brand-symbol" aria-hidden="true">
        <AetherMark />
      </span>
      <span className="brand-copy">
        <span className="brand-name">{site.name}</span>
        {!compact && <span className="brand-sub">{site.descriptor}</span>}
      </span>
    </a>
  );
}
