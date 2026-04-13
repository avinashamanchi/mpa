export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-white text-heading border border-border-default',
    success: 'bg-success-bg text-success-text border border-green-300/40',
    primary: 'bg-primary/10 text-primary border border-primary-light',
    phase_menstrual: 'bg-ruby/10 text-ruby border border-ruby/30',
    phase_follicular: 'bg-primary-light/30 text-primary-deep border border-primary-light',
    phase_ovulatory: 'bg-primary/10 text-primary border border-primary/30',
    phase_luteal: 'bg-magenta-light/50 text-label border border-magenta-light',
  }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-light ${variants[variant] || variants.default}`}>
      {children}
    </span>
  )
}
