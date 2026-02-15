export default function ResourceCard({ as: Component = 'section', className = '', children, ...props }) {
  const classes = `sp-resource-card ${className}`.trim()

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
