import { NavLink } from 'react-router-dom'

const NAV_GROUPS = [
  { label: 'Core', items: [{ to: '/', label: 'Dashboard' }, { to: '/log', label: 'Log' }] },
  { label: 'Insights', items: [{ to: '/calendar', label: 'Calendar' }, { to: '/trends', label: 'Trends' }] },
  { label: 'System', items: [{ to: '/settings', label: 'Settings' }] },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen border-r border-border-default px-4 py-8">
      <div className="mb-8 px-2">
        <span className="text-xl font-light tracking-tight text-heading" style={{ letterSpacing: '-0.04em' }}>MPA</span>
        <p className="text-xs text-body mt-0.5">My Period Assistant</p>
      </div>
      {NAV_GROUPS.map(group => (
        <div key={group.label} className="mb-6">
          <p className="text-xs text-body px-2 mb-1 uppercase tracking-widest">{group.label}</p>
          {group.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block px-2 py-1.5 rounded-sm text-sm font-light transition-colors mb-0.5 ${
                  isActive ? 'bg-primary/8 text-primary' : 'text-body hover:text-heading hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  )
}
