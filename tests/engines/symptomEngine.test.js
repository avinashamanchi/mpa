import { describe, it, expect } from 'vitest'
import { getTopSymptoms, aggregateLogs } from '../../src/engines/symptomEngine.js'

const SAMPLE_LOGS = [
  { date: '2026-01-03', symptoms: [{ type: 'cramps', severity: 4 }, { type: 'fatigue', severity: 3 }] },
  { date: '2026-01-04', symptoms: [{ type: 'cramps', severity: 3 }] },
  { date: '2026-01-10', symptoms: [{ type: 'energetic', severity: 4 }] },
]

describe('getTopSymptoms', () => {
  it('returns symptoms sorted by frequency descending', () => {
    const top = getTopSymptoms(SAMPLE_LOGS, 3)
    expect(top[0].type).toBe('cramps')
    expect(top[0].count).toBe(2)
  })
  it('limits to N results', () => {
    expect(getTopSymptoms(SAMPLE_LOGS, 1)).toHaveLength(1)
  })
})

describe('aggregateLogs', () => {
  it('returns severity per symptom type per day', () => {
    const result = aggregateLogs(SAMPLE_LOGS)
    expect(result['2026-01-03'].cramps).toBe(4)
    expect(result['2026-01-03'].fatigue).toBe(3)
  })
})
