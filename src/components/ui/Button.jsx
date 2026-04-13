export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '' }) {
  const base = 'inline-flex items-center justify-center font-normal rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    ghost: 'bg-transparent text-primary border border-primary-light hover:bg-primary/5',
    danger: 'bg-ruby text-white hover:bg-ruby/90',
    neutral: 'bg-transparent text-body border border-border-default hover:bg-gray-50',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
