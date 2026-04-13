import { Card } from '../ui/Card.jsx'
import { getInsightForPhase } from '../../data/phaseInsights.js'

export function InsightStrip({ phase }) {
  if (!phase) return null
  const insight = getInsightForPhase(phase)
  return (
    <Card className="mx-6 mb-4 px-4 py-3">
      <p className="text-xs text-body uppercase tracking-widest mb-1 font-light">Today's Insight</p>
      <p className="text-sm font-light text-heading" style={{ letterSpacing: '-0.01em' }}>{insight.title}</p>
      <p className="text-xs text-body font-light mt-1 leading-relaxed">{insight.body}</p>
    </Card>
  )
}
