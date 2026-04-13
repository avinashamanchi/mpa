import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Card } from '../ui/Card.jsx'

export function ExplainabilityPanel({ prediction, discreetMode }) {
  const [open, setOpen] = useState(false)
  const periodWord = discreetMode ? 'cycle' : 'period'
  if (!prediction) return null
  const { predictedDate, confidenceDays, avgCycleLength, cyclesUsed, stddev, isColdStart, isLimitedStart, isIrregular } = prediction

  const startRange = new Date(predictedDate)
  startRange.setDate(startRange.getDate() - confidenceDays)
  const endRange = new Date(predictedDate)
  endRange.setDate(endRange.getDate() + confidenceDays)

  return (
    <Card className="mx-6 mb-4 overflow-hidden">
      <button className="w-full flex items-center justify-between px-4 py-3 text-left" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div>
          <p className="text-xs text-body font-light uppercase tracking-widest">Next {periodWord}</p>
          <p className="text-lg font-light text-heading" style={{ letterSpacing: '-0.02em' }}>
            {format(parseISO(predictedDate), 'MMM d')}
            {confidenceDays > 0 && <span className="text-sm text-body ml-1 font-light">± {confidenceDays}d</span>}
          </p>
        </div>
        <span className="text-body text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border-default">
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-body font-light">Window</span>
              <span className="text-heading font-light">{format(startRange, 'MMM d')} – {format(endRange, 'MMM d')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-body font-light">Avg cycle</span>
              <span className="text-heading font-light">{avgCycleLength} days</span>
            </div>
            {stddev && (
              <div className="flex justify-between text-sm">
                <span className="text-body font-light">Variation</span>
                <span className="text-heading font-light">±{stddev}d</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-body font-light">Based on</span>
              <span className="text-heading font-light">{cyclesUsed} {cyclesUsed === 1 ? 'cycle' : 'cycles'}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-body font-light leading-relaxed">
            {isColdStart && 'Using population average — log more cycles to personalize your prediction.'}
            {isLimitedStart && `Based on ${cyclesUsed} cycle${cyclesUsed > 1 ? 's' : ''}. Accuracy improves after 3 logged cycles.`}
            {!isColdStart && !isLimitedStart && `Weighted average of last ${cyclesUsed} cycles, emphasizing recent data.`}
          </p>
          {isIrregular && (
            <p className="mt-2 text-xs text-ruby font-light">Your cycles show high variability. Consider speaking with a healthcare provider.</p>
          )}
        </div>
      )}
    </Card>
  )
}
