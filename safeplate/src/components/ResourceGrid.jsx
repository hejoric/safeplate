export default function ResourceGrid({ children, className = '' }) {
  return <ul className={`sp-resource-grid ${className}`.trim()}>{children}</ul>
}
