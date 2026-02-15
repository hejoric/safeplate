export default function SectionHeader({ id, title, subtitle, className = '' }) {
  return (
    <header id={id} className={`sp-section-header ${className}`.trim()}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </header>
  )
}
