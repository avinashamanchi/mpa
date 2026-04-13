export function Card({ children, className = '', elevated = false, dark = false }) {
  const base = 'rounded-xl border bg-white'
  const shadow = elevated ? 'shadow-stripe' : 'shadow-stripe-sm'
  const theme = dark ? 'bg-brand-dark border-white/10 text-white' : 'border-border-default'
  return (
    <div className={`${base} ${shadow} ${theme} ${className}`}>
      {children}
    </div>
  )
}
