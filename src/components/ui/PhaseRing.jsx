import { PHASE_COLORS } from '../../design/tokens.js'

export function PhaseRing({ phase, dayOfCycle, avgCycleLength = 28, size = 160 }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(dayOfCycle / avgCycleLength, 1)
  const strokeDashoffset = circumference * (1 - progress)
  const color = PHASE_COLORS[phase] || PHASE_COLORS.follicular
  const cx = size / 2
  const cy = size / 2

  return (
    <svg width={size} height={size} className="rotate-[-90deg]" aria-hidden="true">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F5DDE2" strokeWidth="8" />
      <circle
        cx={cx} cy={cy} r={radius} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}
