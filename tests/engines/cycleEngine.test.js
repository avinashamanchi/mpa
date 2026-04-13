import { describe, it, expect } from 'vitest'
import { predictNextPeriod, getCurrentPhase, getDaysUntilPeriod, computeCycleLength, detectIrregularity } from '../../src/engines/cycleEngine.js'

describe('computeCycleLength', () => {
  it('returns days between two start dates', () => {
    expect(computeCycleLength('2026-01-01', '2026-01-29')).toBe(28)
  })
  it('returns null if nextStartDate missing', () => {
    expect(computeCycleLength('2026-01-01', null)).toBeNull()
  })
})

describe('predictNextPeriod — cold start', () => {
  it('returns 28-day prediction with confidence 5', () => {
    const r = predictNextPeriod([])
    expect(r.avgCycleLength).toBe(28)
    expect(r.confidenceDays).toBe(5)
    expect(r.isColdStart).toBe(true)
  })
})

describe('predictNextPeriod — limited data', () => {
  it('uses simple average for <3 cycles', () => {
    const cycles = [{ startDate: '2026-01-01', length: 30 }, { startDate: '2026-01-31', length: 28 }]
    const r = predictNextPeriod(cycles)
    expect(r.avgCycleLength).toBeCloseTo(29, 0)
    expect(r.isLimitedStart).toBe(true)
    expect(r.confidenceDays).toBe(4)
  })
})

describe('predictNextPeriod — full data', () => {
  it('returns lower confidence than cold start for regular cycles', () => {
    const cycles = [
      { startDate: '2026-01-01', length: 28 }, { startDate: '2026-01-29', length: 28 },
      { startDate: '2026-02-26', length: 28 }, { startDate: '2026-03-26', length: 28 },
    ]
    const r = predictNextPeriod(cycles)
    expect(r.confidenceDays).toBeLessThanOrEqual(2)
    expect(r.avgCycleLength).toBeCloseTo(28, 0)
    expect(r.isColdStart).toBeFalsy()
  })

  it('weights recent cycles higher', () => {
    const cycles = [
      { startDate: '2026-01-01', length: 35 }, { startDate: '2026-02-05', length: 35 },
      { startDate: '2026-03-12', length: 35 }, { startDate: '2026-04-16', length: 25 },
    ]
    expect(predictNextPeriod(cycles).avgCycleLength).toBeLessThan(32)
  })
})

describe('detectIrregularity', () => {
  it('returns false for regular cycles', () => {
    expect(detectIrregularity([28, 29, 28, 30])).toBe(false)
  })
  it('returns true when CV > 20%', () => {
    expect(detectIrregularity([21, 35, 42, 21])).toBe(true)
  })
})

describe('getDaysUntilPeriod', () => {
  it('returns positive for future date', () => {
    const d = new Date(); d.setDate(d.getDate() + 5)
    expect(getDaysUntilPeriod(d.toISOString())).toBe(5)
  })
  it('returns negative for past date', () => {
    const d = new Date(); d.setDate(d.getDate() - 2)
    expect(getDaysUntilPeriod(d.toISOString())).toBe(-2)
  })
})

describe('getCurrentPhase', () => {
  it('returns menstrual for day 1-5', () => {
    const d = new Date(); d.setDate(d.getDate() - 2)
    expect(getCurrentPhase(d.toISOString().split('T')[0], 28).phase).toBe('menstrual')
  })
  it('returns follicular for days 6-13', () => {
    const d = new Date(); d.setDate(d.getDate() - 8)
    expect(getCurrentPhase(d.toISOString().split('T')[0], 28).phase).toBe('follicular')
  })
  it('returns luteal for days 16+', () => {
    const d = new Date(); d.setDate(d.getDate() - 20)
    expect(getCurrentPhase(d.toISOString().split('T')[0], 28).phase).toBe('luteal')
  })
})
