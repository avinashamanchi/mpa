import { PhaseRing } from '../ui/PhaseRing.jsx'
import { Badge } from '../ui/Badge.jsx'
import { PHASE_LABELS } from '../../design/tokens.js'

const PHASE_DESCRIPTIONS = {
  menstrual: "Your period is here. Rest when you can.",
  follicular: "Energy is building. Estrogen is rising.",
  ovulatory: "You're at your energetic peak.",
  luteal: "Progesterone is high. Slow down and recharge.",
}

const CONFIDENCE_CONFIG = {
  high:   { dot: 'bg-green-400',  label: 'High confidence' },
  medium: { dot: 'bg-amber',      label: 'Moderate estimate' },
  low:    { dot: 'bg-primary',    label: 'Early estimate — log more cycles' },
}

export function CycleStatusCard({ phase, dayOfCycle, avgCycleLength, daysUntil, discreetMode, confidence = 'low' }) {
  const periodWord = discreetMode ? 'cycle' : 'period'
  const conf = CONFIDENCE_CONFIG[confidence] || CONFIDENCE_CONFIG.low
  return (
    <div className="rounded-xl border border-border-default shadow-stripe-sm bg-white mb-4 overflow-hidden">
      <div className="flex flex-col items-center py-10 px-6" style={{ background: 'linear-gradient(to bottom, #ffffff, #fff8f9)' }}>
        <div className="relative mb-6">
          <PhaseRing phase={phase} dayOfCycle={dayOfCycle} avgCycleLength={avgCycleLength} size={200} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>
              {daysUntil != null ? Math.abs(daysUntil) : '—'}
            </span>
            <span className="text-xs text-body mt-1 font-light">
              {daysUntil == null ? '' : daysUntil <= 0 ? `${periodWord} active` : `days until ${periodWord}`}
            </span>
          </div>
        </div>
        <Badge variant={`phase_${phase}`}>{PHASE_LABELS[phase] || 'Unknown'} Phase</Badge>
        <p className="text-sm text-body text-center mt-3 max-w-xs font-light">
          {PHASE_DESCRIPTIONS[phase] || ''}
        </p>
        <p className="text-xs text-body/60 mt-2 font-light">Day {dayOfCycle} of cycle · avg {avgCycleLength}d</p>
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
          <span className="text-xs text-body/70 font-light">{conf.label}</span>
        </div>
      </div>
    </div>
  )
}
