import { useState } from 'react'
import { useCycles } from '../hooks/useCycles.js'
import { useSymptoms } from '../hooks/useSymptoms.js'
import { useProfile } from '../hooks/useProfile.js'
import { PeriodLogger } from '../components/log/PeriodLogger.jsx'
import { SymptomLogger } from '../components/log/SymptomLogger.jsx'

export function LogView() {
  const { activeCycle, startPeriod, endPeriod } = useCycles()
  const { logToday, getLogForDate } = useSymptoms()
  const { profile } = useProfile()
  const [date] = useState(new Date().toISOString().split('T')[0])
  const existingLog = getLogForDate(date)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-6 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 100%)' }}>
        <h1 className="text-4xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>Log</h1>
      </div>
      <div className="px-4 pt-2">
        <PeriodLogger
          activeCycle={activeCycle && !activeCycle.endDate ? activeCycle : null}
          onStart={startPeriod}
          onEnd={endPeriod}
          discreetMode={profile?.discreetMode}
        />
        <SymptomLogger onSave={logToday} existingLog={existingLog} date={date} />
      </div>
    </div>
  )
}
