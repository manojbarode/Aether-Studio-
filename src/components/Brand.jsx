import { site } from "../data/site.js";

export default function Brand({ onClick, compact = false, href = "#home" }) {
  return (
    <a className="brand" href={href} aria-label={`${site.name} Studio — back to home`} onClick={onClick}>
      <span className="brand-symbol" aria-hidden="true">
        <img src="/brand-mark.svg" alt="" />
      </span>
      <span className="brand-copy">
        <span className="brand-name">{site.name}</span>
        {!compact && <span className="brand-sub">{site.descriptor}</span>}
      </span>
    </a>
  );
}
