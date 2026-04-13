import { useCycles } from '../hooks/useCycles.js'
import { useProfile } from '../hooks/useProfile.js'
import { CycleStatusCard } from '../components/dashboard/CycleStatusCard.jsx'
import { QuickStartButton } from '../components/dashboard/QuickStartButton.jsx'
import { ExplainabilityPanel } from '../components/dashboard/ExplainabilityPanel.jsx'
import { InsightStrip } from '../components/dashboard/InsightStrip.jsx'

export function DashboardView() {
  const { cycles, loading, prediction, currentPhase, daysUntil, activeCycle, startPeriod, endPeriod } = useCycles()
  const { profile } = useProfile()
  const discreetMode = profile?.discreetMode ?? false

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-body font-light">Loading…</p>
      </div>
    )
  }

  const phase = currentPhase?.phase ?? 'follicular'
  const dayOfCycle = currentPhase?.dayOfCycle ?? 1
  const avgCycleLength = prediction?.avgCycleLength ?? 28

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-6 pt-8 pb-2">
        <h1 className="text-3xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>
          {discreetMode ? 'Cycle' : 'My Cycle'}
        </h1>
      </div>
      <CycleStatusCard
        phase={phase}
        dayOfCycle={dayOfCycle}
        avgCycleLength={avgCycleLength}
        daysUntil={daysUntil}
        discreetMode={discreetMode}
      />
      <QuickStartButton
        activePeriod={activeCycle && !activeCycle.endDate ? activeCycle : null}
        onStart={startPeriod}
        onEnd={endPeriod}
        discreetMode={discreetMode}
      />
      <ExplainabilityPanel prediction={prediction} discreetMode={discreetMode} />
      <InsightStrip phase={phase} />
      {cycles.length === 0 && (
        <div className="mx-6 rounded-md border border-border-soft-purple bg-primary/5 px-4 py-3">
          <p className="text-sm font-light text-primary">
            Start by logging your first period above. Predictions improve with each cycle you track.
          </p>
        </div>
      )}
    </div>
  )
}
