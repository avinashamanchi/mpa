import { Button } from '../ui/Button.jsx'
import { useState } from 'react'

export function QuickStartButton({ activePeriod, onStart, onEnd, discreetMode }) {
  const [loading, setLoading] = useState(false)
  const periodWord = discreetMode ? 'Cycle' : 'Period'

  async function handleClick() {
    setLoading(true)
    try {
      if (activePeriod) await onEnd()
      else await onStart()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-6 pb-4">
      <Button onClick={handleClick} disabled={loading} variant={activePeriod ? 'ghost' : 'primary'} size="lg" className="w-full">
        {loading ? '…' : activePeriod ? `End ${periodWord}` : `Start ${periodWord} Today`}
      </Button>
      {activePeriod && (
        <p className="text-center text-xs text-body mt-2 font-light">
          {periodWord} started {activePeriod.startDate}
        </p>
      )}
    </div>
  )
}
