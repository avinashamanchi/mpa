import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

export function CycleLengthChart({ cycles }) {
  const data = cycles
    .filter(c => c.length != null)
    .map((c, i) => ({ name: `C${i + 1}`, length: c.length, date: c.startDate }))

  if (data.length < 2) {
    return (
      <p className="text-sm text-body font-light text-center py-8">
        Log at least 2 complete cycles to see trends.
      </p>
    )
  }

  return (
    <div>
      <p className="text-xs text-body uppercase tracking-widest mb-3 font-light">Cycle Length (days)</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748d', fontWeight: 300 }} />
          <YAxis domain={[18, 42]} tick={{ fontSize: 10, fill: '#64748d', fontWeight: 300 }} />
          <Tooltip contentStyle={{ borderRadius: 4, border: '1px solid #e5edf5', fontSize: 12, fontWeight: 300 }} labelStyle={{ color: '#061b31' }} />
          <ReferenceLine y={21} stroke="#ea2261" strokeDasharray="4 2" strokeWidth={1} />
          <ReferenceLine y={35} stroke="#ea2261" strokeDasharray="4 2" strokeWidth={1} />
          <Line type="monotone" dataKey="length" stroke="#533afd" strokeWidth={2} dot={{ fill: '#533afd', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-body font-light mt-1 text-center">Red lines = normal range (21–35 days)</p>
    </div>
  )
}
