import { getTopSymptoms } from '../../engines/symptomEngine.js'

export function SymptomsTab({ logs }) {
  const top = getTopSymptoms(logs, 8)

  if (!top.length) {
    return (
      <p className="text-sm text-body font-light text-center py-8">
        No symptom data yet. Start logging daily to see patterns.
      </p>
    )
  }

  const maxCount = top[0]?.count || 1

  return (
    <div className="space-y-3">
      <p className="text-xs text-body uppercase tracking-widest mb-3 font-light">Most frequent symptoms</p>
      {top.map(({ type, count }) => (
        <div key={type}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-label font-light capitalize">{type}</span>
            <span className="text-body font-light">{count}x</span>
          </div>
          <div className="w-full bg-border-default rounded-full h-1.5">
            <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
