import { useState, useEffect, useCallback } from 'react'
import { getAllLogs, getLogByDate, saveLog, deleteLog } from '../storage/db.js'

export function useSymptoms() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const all = await getAllLogs()
    setLogs(all.sort((a, b) => a.date.localeCompare(b.date)))
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const logToday = useCallback(async (data, date = new Date().toISOString().split('T')[0]) => {
    const existing = await getLogByDate(date)
    if (existing) {
      await saveLog({ ...existing, ...data, date })
    } else {
      await saveLog({ ...data, date })
    }
    await refresh()
  }, [refresh])

  const removeLog = useCallback(async (id) => {
    await deleteLog(id)
    await refresh()
  }, [refresh])

  const getLogForDate = useCallback((date) => logs.find(l => l.date === date) ?? null, [logs])

  return { logs, loading, logToday, removeLog, getLogForDate, refresh }
}
