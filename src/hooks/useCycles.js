import { useState, useEffect, useCallback } from 'react'
import { getAllCycles, addCycle, updateCycle, deleteCycle } from '../storage/db.js'
import { computeCycleLength, predictNextPeriod, getCurrentPhase, getDaysUntilPeriod } from '../engines/cycleEngine.js'
import { useProfile } from './useProfile.js'

export function useCycles() {
  const { profile } = useProfile()
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const raw = await getAllCycles()
    const withLengths = raw.map((c, i) => ({
      ...c,
      length: c.length ?? computeCycleLength(c.startDate, raw[i + 1]?.startDate ?? null),
    }))
    setCycles(withLengths)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const startPeriod = useCallback(async (date = new Date().toISOString().split('T')[0], flow = 'Medium') => {
    const open = cycles.find(c => !c.endDate)
    if (open) {
      await updateCycle({ ...open, endDate: date, length: computeCycleLength(open.startDate, date) })
    }
    const id = await addCycle({ startDate: date, endDate: null, length: null, flow })
    await refresh()
    return id
  }, [cycles, refresh])

  const endPeriod = useCallback(async (date = new Date().toISOString().split('T')[0]) => {
    const open = cycles.find(c => !c.endDate)
    if (!open) return
    await updateCycle({ ...open, endDate: date })
    await refresh()
  }, [cycles, refresh])

  const removeCycle = useCallback(async (id) => {
    await deleteCycle(id)
    await refresh()
  }, [refresh])

  const prediction = predictNextPeriod(cycles)
  const activeCycle = cycles.find(c => !c.endDate) ?? cycles[cycles.length - 1] ?? null

  const effectiveAvgCycleLength =
    (profile?.smartCycleLength === false && profile?.manualCycleLength)
      ? Number(profile.manualCycleLength)
      : prediction.avgCycleLength

  const currentPhase = activeCycle ? getCurrentPhase(activeCycle.startDate, effectiveAvgCycleLength) : null
  const daysUntil = prediction ? getDaysUntilPeriod(prediction.predictedDate) : null

  return { cycles, loading, prediction, currentPhase, daysUntil, activeCycle, startPeriod, endPeriod, removeCycle, refresh }
}
