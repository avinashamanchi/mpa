import { PhaseRing } from '../ui/PhaseRing.jsx'
import { Badge } from '../ui/Badge.jsx'
import { PHASE_LABELS } from '../../design/tokens.js'

const PHASE_DESCRIPTIONS = {
  menstrual: "Your period is here. Rest when you can.",
  follicular: "Energy is building. Estrogen is rising.",
  ovulatory: "You're at your energetic peak.",
  luteal: "Progesterone is high. Slow down and recharge.",
}

export function CycleStatusCard({ phase, dayOfCycle, avgCycleLength, daysUntil, discreetMode }) {
  const periodWord = discreetMode ? 'cycle' : 'period'
  return (
    <div className="flex flex-col items-center py-10 px-6">
      <div className="relative mb-6">
        <PhaseRing phase={phase} dayOfCycle={dayOfCycle} avgCycleLength={avgCycleLength} size={180} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>
            {daysUntil != null ? Math.abs(daysUntil) : '—'}
          </span>
          <span className="text-xs text-body mt-1">
            {daysUntil == null ? '' : daysUntil <= 0 ? `${periodWord} active` : `days until ${periodWord}`}
          </span>
        </div>
      </div>
      <Badge variant={`phase_${phase}`}>{PHASE_LABELS[phase] || 'Unknown'} Phase</Badge>
      <p className="text-sm text-body text-center mt-3 max-w-xs font-light">
        {PHASE_DESCRIPTIONS[phase] || ''}
      </p>
      <p className="text-xs text-body/60 mt-2">Day {dayOfCycle} of cycle</p>
    </div>
  )
}
