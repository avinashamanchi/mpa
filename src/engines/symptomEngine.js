export function getTopSymptoms(logs, limit = 5) {
  const counts = {}
  for (const log of logs) {
    for (const s of (log.symptoms || [])) {
      counts[s.type] = (counts[s.type] || 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function aggregateLogs(logs) {
  const result = {}
  for (const log of logs) {
    result[log.date] = {}
    for (const s of (log.symptoms || [])) {
      result[log.date][s.type] = s.severity
    }
  }
  return result
}

export function correlateSymptomsByPhase(logs, cycles, avgCycleLength = 28) {
  const phaseMap = { menstrual: {}, follicular: {}, ovulatory: {}, luteal: {} }
  if (!cycles.length) return phaseMap
  for (const log of logs) {
    const logDate = new Date(log.date)
    const cycle = [...cycles].reverse().find(c => new Date(c.startDate) <= logDate)
    if (!cycle) continue
    const dayOfCycle = Math.floor((logDate - new Date(cycle.startDate)) / 86400000) + 1
    const ovDay = avgCycleLength - 14
    let phase
    if (dayOfCycle <= 5) phase = 'menstrual'
    else if (dayOfCycle < ovDay - 1) phase = 'follicular'
    else if (dayOfCycle <= ovDay + 2) phase = 'ovulatory'
    else phase = 'luteal'
    for (const s of (log.symptoms || [])) {
      if (!phaseMap[phase][s.type]) phaseMap[phase][s.type] = []
      phaseMap[phase][s.type].push(s.severity)
    }
  }
  for (const phase of Object.keys(phaseMap)) {
    for (const type of Object.keys(phaseMap[phase])) {
      const arr = phaseMap[phase][type]
      phaseMap[phase][type] = arr.reduce((a, b) => a + b, 0) / arr.length
    }
  }
  return phaseMap
}
