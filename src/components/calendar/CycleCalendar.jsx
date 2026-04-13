import { useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, parseISO, startOfWeek, endOfWeek } from 'date-fns'
import { PHASE_COLORS } from '../../design/tokens.js'

function getDayPhase(date, cycles, prediction) {
  for (const cycle of [...cycles].reverse()) {
    const start = parseISO(cycle.startDate)
    const diff = Math.floor((date - start) / 86400000)
    if (diff < 0) continue
    const len = cycle.length ?? prediction?.avgCycleLength ?? 28
    const ovDay = len - 14
    if (diff < 5) return 'menstrual'
    if (diff < ovDay - 1) return 'follicular'
    if (diff <= ovDay + 2) return 'ovulatory'
    if (diff < len) return 'luteal'
  }
  return null
}

function isPredicted(date, prediction) {
  if (!prediction) return false
  const target = parseISO(prediction.predictedDate)
  const diff = Math.abs(Math.floor((date - target) / 86400000))
  return diff <= prediction.confidenceDays
}

export function CycleCalendar({ cycles, prediction, logs, onDayClick }) {
  const [viewDate, setViewDate] = useState(new Date())
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })
  const logMap = Object.fromEntries((logs || []).map(l => [l.date, l]))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1))}
          className="text-body hover:text-heading px-2 py-1 rounded-sm">‹</button>
        <h2 className="text-base font-light text-heading" style={{ letterSpacing: '-0.02em' }}>
          {format(viewDate, 'MMMM yyyy')}
        </h2>
        <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1))}
          className="text-body hover:text-heading px-2 py-1 rounded-sm">›</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs text-body font-light py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const phase = getDayPhase(day, cycles, prediction)
          const predicted = isPredicted(day, prediction)
          const inMonth = isSameMonth(day, viewDate)
          const today = isToday(day)
          const hasLog = !!logMap[dateStr]

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick && onDayClick(day, logMap[dateStr])}
              className={`relative aspect-square flex items-center justify-center rounded-sm text-sm font-light transition-all ${
                !inMonth ? 'opacity-30' : ''
              } ${today ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              style={{
                backgroundColor: phase
                  ? `${PHASE_COLORS[phase]}${predicted ? 'aa' : '55'}`
                  : predicted ? '#b9b9f966' : 'transparent',
                border: predicted ? '1px dashed #362baa' : '1px solid transparent',
                color: phase ? '#061b31' : '#64748d',
              }}
            >
              {format(day, 'd')}
              {hasLog && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/60" />
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {[['menstrual', 'Menstrual'], ['follicular', 'Follicular'], ['ovulatory', 'Ovulatory'], ['luteal', 'Luteal']].map(([phase, label]) => (
          <div key={phase} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${PHASE_COLORS[phase]}55` }} />
            <span className="text-xs text-body font-light">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border border-dashed border-[#362baa] bg-primary-light/30" />
          <span className="text-xs text-body font-light">Predicted</span>
        </div>
      </div>
    </div>
  )
}
