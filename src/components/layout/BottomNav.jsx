import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '○' },
  { to: '/log', label: 'Log', icon: '+' },
  { to: '/calendar', label: 'Calendar', icon: '▦' },
  { to: '/trends', label: 'Trends', icon: '↗' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-border-default rounded-full shadow-stripe-sm px-3 py-2">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-body hover:text-heading hover:bg-border-default/50'
              }`
            }
          >
            <span className="text-base leading-none mb-0.5">{item.icon}</span>
            <span className="hidden sm:block">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
