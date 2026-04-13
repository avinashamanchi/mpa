import { useCycles } from '../hooks/useCycles.js'
import { useProfile } from '../hooks/useProfile.js'
import { CycleStatusCard } from '../components/dashboard/CycleStatusCard.jsx'
import { QuickStartButton } from '../components/dashboard/QuickStartButton.jsx'
import { ExplainabilityPanel } from '../components/dashboard/ExplainabilityPanel.jsx'
import { InsightStrip } from '../components/dashboard/InsightStrip.jsx'
import { getConfidenceModifier } from '../engines/cycleEngine.js'

export function DashboardView() {
  const { cycles, loading, prediction, currentPhase, daysUntil, activeCycle, startPeriod, endPeriod } = useCycles()
  const { profile } = useProfile()
  const discreetMode = profile?.discreetMode ?? false

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 50%, #fff8ec 100%)' }}>
        <p className="text-body font-light text-sm">Loading…</p>
      </div>
    )
  }

  const phase = currentPhase?.phase ?? 'follicular'
  const dayOfCycle = currentPhase?.dayOfCycle ?? 1
  const avgCycleLength = prediction?.avgCycleLength ?? 28
  const modifier = getConfidenceModifier(profile)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-6 pt-10 pb-6" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 60%, #fff8ec 100%)' }}>
        <p className="text-xs text-body uppercase tracking-widest mb-1 font-light">My Period Assistant</p>
        <h1 className="text-4xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>
          {discreetMode ? 'Cycle' : profile?.name ? `Hi, ${profile.name}` : 'My Cycle'}
        </h1>
        {modifier.isHormonalFlag && (
          <p className="text-xs text-amber font-light mt-1">Hormonal contraceptive — predictions show natural cycle estimate</p>
        )}
      </div>

      <div className="px-4">
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
          <div className="mx-2 rounded-xl border border-border-default bg-primary/5 px-5 py-4 mb-4">
            <p className="text-sm font-light text-primary">
              Start by logging your first period above. Predictions improve with each cycle you track.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
