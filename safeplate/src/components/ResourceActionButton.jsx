export default function ResourceActionButton({ icon, title, subtext, href, ariaLabel }) {
  return (
    <a
      href={href}
      className="sp-resource-action"
      aria-label={ariaLabel || `${title}: ${subtext}`}
    >
      <span className="sp-resource-action__icon" aria-hidden="true">{icon}</span>
      <span>
        <span className="sp-resource-action__title">{title}</span>
        <span className="sp-resource-action__subtext">{subtext}</span>
      </span>
    </a>
  )
}
