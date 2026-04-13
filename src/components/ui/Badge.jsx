export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-white text-heading border border-border-default',
    success: 'bg-success-bg text-success-text border border-green-300/40',
    primary: 'bg-primary/10 text-primary border border-primary-light',
    phase_menstrual: 'bg-primary/10 text-primary border border-primary/30',
    phase_follicular: 'bg-amber-light text-amber-hover border border-amber/30',
    phase_ovulatory: 'bg-yellow-50 text-yellow-700 border border-yellow-300/60',
    phase_luteal: 'bg-primary-light/20 text-label border border-primary-light/50',
  }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-light ${variants[variant] || variants.default}`}>
      {children}
    </span>
  )
}
