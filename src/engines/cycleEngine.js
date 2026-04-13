import { differenceInDays, addDays, parseISO, startOfDay } from 'date-fns'

export function computeCycleLength(startDate, nextStartDate) {
  if (!nextStartDate) return null
  return differenceInDays(parseISO(nextStartDate), parseISO(startDate))
}

export function detectIrregularity(lengths) {
  if (lengths.length < 2) return false
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const variance = lengths.reduce((s, l) => s + Math.pow(l - mean, 2), 0) / lengths.length
  return Math.sqrt(variance) / mean > 0.20
}

export function predictNextPeriod(cycles) {
  const valid = cycles.filter(c => c.length != null && c.length > 0)

  if (valid.length === 0) {
    return {
      predictedDate: addDays(startOfDay(new Date()), 28).toISOString().split('T')[0],
      confidenceDays: 5, avgCycleLength: 28, stddev: null,
      cyclesUsed: 0, isIrregular: false, isColdStart: true,
    }
  }

  if (valid.length < 3) {
    const lengths = valid.map(c => c.length)
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length
    return {
      predictedDate: addDays(parseISO(valid[valid.length - 1].startDate), Math.round(avg)).toISOString().split('T')[0],
      confidenceDays: 4, avgCycleLength: Math.round(avg * 10) / 10,
      stddev: null, cyclesUsed: lengths.length, isIrregular: false, isLimitedStart: true,
    }
  }

  const lengths = valid.map(c => c.length)
  const weights = lengths.map((_, i) => Math.pow(0.8, lengths.length - 1 - i))
  const wSum = weights.reduce((a, b) => a + b, 0)
  const wAvg = weights.reduce((s, w, i) => s + w * lengths[i], 0) / wSum
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const stddev = Math.sqrt(lengths.reduce((s, l) => s + Math.pow(l - mean, 2), 0) / lengths.length)

  return {
    predictedDate: addDays(parseISO(valid[valid.length - 1].startDate), Math.round(wAvg)).toISOString().split('T')[0],
    confidenceDays: Math.max(1, Math.min(4, Math.round(stddev * 0.5))),
    avgCycleLength: Math.round(wAvg * 10) / 10,
    stddev: Math.round(stddev * 10) / 10,
    cyclesUsed: lengths.length,
    isIrregular: detectIrregularity(lengths),
  }
}

export function getCurrentPhase(lastPeriodStartDate, avgCycleLength = 28) {
  const today = startOfDay(new Date())
  const start = startOfDay(parseISO(lastPeriodStartDate))
  const dayOfCycle = differenceInDays(today, start) + 1
  const ovDay = avgCycleLength - 14
  let phase
  if (dayOfCycle <= 5) phase = 'menstrual'
  else if (dayOfCycle < ovDay - 1) phase = 'follicular'
  else if (dayOfCycle <= ovDay + 2) phase = 'ovulatory'
  else phase = 'luteal'
  return { phase, dayOfCycle, avgCycleLength }
}

export function getDaysUntilPeriod(predictedDateStr) {
  return differenceInDays(startOfDay(parseISO(predictedDateStr)), startOfDay(new Date()))
}

export function getConfidenceModifier(profile) {
  if (!profile) return { extraDays: 0, isHormonalFlag: false, isLifestyleFlag: false }
  let extraDays = 0
  const conditions = profile.conditions || []
  if (
    conditions.includes('PCOS') ||
    conditions.includes('Endometriosis') ||
    conditions.includes('Thyroid disorder')
  ) extraDays += 2
  if (conditions.includes('Perimenopause')) extraDays += 1
  if (profile.cycleRegularity === 'irregular') extraDays += 1
  const hormonalContraceptives = ['Pill', 'Hormonal IUD', 'Implant', 'Patch']
  const isHormonalFlag = hormonalContraceptives.includes(profile.contraceptiveType)
  const isLifestyleFlag = profile.stressLevel === 'high' && profile.activityLevel === 'sedentary'
  return { extraDays, isHormonalFlag, isLifestyleFlag }
}

export function getFertileWindow(lastPeriodStartDate, avgCycleLength = 28) {
  const ovDay = avgCycleLength - 14
  const start = parseISO(lastPeriodStartDate)
  return {
    windowStart: addDays(start, ovDay - 5).toISOString().split('T')[0],
    windowEnd: addDays(start, ovDay + 1).toISOString().split('T')[0],
    ovulationDate: addDays(start, ovDay).toISOString().split('T')[0],
  }
}
