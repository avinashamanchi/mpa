import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { parseISO } from 'date-fns'

const CYCLE_COLORS = ['#533afd', '#b9b9f9', '#1c1e54']

export function ComparisonTab({ cycles, logs }) {
  const completeCycles = cycles.filter(c => c.length != null).slice(-3)

  if (completeCycles.length < 2) {
    return (
      <p className="text-sm text-body font-light text-center py-8">
        Log at least 2 complete cycles to compare.
      </p>
    )
  }

  const maxLen = Math.max(...completeCycles.map(c => c.length))
  const data = Array.from({ length: maxLen }, (_, i) => {
    const point = { day: i + 1 }
    completeCycles.forEach((cycle, ci) => {
      const dayDate = new Date(parseISO(cycle.startDate))
      dayDate.setDate(dayDate.getDate() + i)
      const dateStr = dayDate.toISOString().split('T')[0]
      const log = logs.find(l => l.date === dateStr)
      point[`cycle${ci + 1}`] = log?.symptoms?.length ?? null
    })
    return point
  })

  return (
    <div>
      <p className="text-xs text-body uppercase tracking-widest mb-3 font-light">Symptom load by cycle day</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748d', fontWeight: 300 }} />
          <YAxis tick={{ fontSize: 10, fill: '#64748d', fontWeight: 300 }} />
          <Tooltip contentStyle={{ borderRadius: 4, border: '1px solid #e5edf5', fontSize: 12, fontWeight: 300 }} />
          {completeCycles.map((c, i) => (
            <Line
              key={i} type="monotone" dataKey={`cycle${i + 1}`}
              stroke={CYCLE_COLORS[i]} strokeWidth={i === completeCycles.length - 1 ? 2 : 1}
              strokeOpacity={i === completeCycles.length - 1 ? 1 : 0.5}
              dot={false} connectNulls
              name={`Cycle starting ${c.startDate}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-body font-light mt-1 text-center">Most recent cycle shown solid. Older cycles faded.</p>
    </div>
  )
}
