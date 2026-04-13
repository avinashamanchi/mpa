import { useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { Card } from '../ui/Card.jsx'

const FLOW_LEVELS = ['Spotting', 'Light', 'Medium', 'Heavy']

export function PeriodLogger({ activeCycle, onStart, onEnd, discreetMode }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [flow, setFlow] = useState('Medium')
  const [loading, setLoading] = useState(false)
  const periodWord = discreetMode ? 'Cycle' : 'Period'

  async function handleStart() {
    setLoading(true)
    await onStart(selectedDate, flow)
    setLoading(false)
  }

  async function handleEnd() {
    setLoading(true)
    await onEnd(selectedDate)
    setLoading(false)
  }

  return (
    <Card className="p-4 mb-4">
      <p className="text-xs text-body uppercase tracking-widest mb-3 font-light">{periodWord} Logging</p>
      <div className="mb-3">
        <label className="block text-xs text-label mb-1 font-light">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full border border-border-default rounded-sm px-3 py-2 text-sm text-heading font-light focus:outline-none focus:border-primary"
        />
      </div>
      {activeCycle && (
        <div className="mb-3">
          <label className="block text-xs text-label mb-1 font-light">Flow</label>
          <div className="flex gap-2">
            {FLOW_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setFlow(level)}
                className={`px-3 py-1 rounded-sm text-xs font-light border transition-colors ${
                  flow === level ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-body hover:border-primary/40'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {!activeCycle ? (
          <Button onClick={handleStart} disabled={loading} className="flex-1">
            {loading ? '…' : `Start ${periodWord}`}
          </Button>
        ) : (
          <Button onClick={handleEnd} disabled={loading} variant="ghost" className="flex-1">
            {loading ? '…' : `End ${periodWord}`}
          </Button>
        )}
      </div>
      {activeCycle && (
        <p className="text-xs text-body mt-2 font-light">{periodWord} started {activeCycle.startDate}</p>
      )}
    </Card>
  )
}
