import { describe, it, expect, beforeEach } from 'vitest'
import { getProfile, saveProfile, getAllCycles, addCycle, deleteCycle, clearAllData } from '../../src/storage/db.js'

describe('db — profile', () => {
  beforeEach(() => clearAllData())

  it('returns null when no profile saved', async () => {
    expect(await getProfile()).toBeNull()
  })

  it('saves and retrieves profile', async () => {
    await saveProfile({ age: 28, tempUnit: 'C' })
    const p = await getProfile()
    expect(p.age).toBe(28)
    expect(p.tempUnit).toBe('C')
  })

  it('overwrites profile on second save', async () => {
    await saveProfile({ age: 28 })
    await saveProfile({ age: 30, tempUnit: 'F' })
    const p = await getProfile()
    expect(p.age).toBe(30)
  })
})

describe('db — cycles', () => {
  beforeEach(() => clearAllData())

  it('returns empty array with no cycles', async () => {
    expect(await getAllCycles()).toEqual([])
  })

  it('adds and retrieves a cycle', async () => {
    await addCycle({ startDate: '2026-01-01', endDate: '2026-01-05', length: 28 })
    const cycles = await getAllCycles()
    expect(cycles).toHaveLength(1)
    expect(cycles[0].startDate).toBe('2026-01-01')
  })

  it('sorts cycles by startDate ascending', async () => {
    await addCycle({ startDate: '2026-02-01', length: 27 })
    await addCycle({ startDate: '2026-01-01', length: 28 })
    const cycles = await getAllCycles()
    expect(cycles[0].startDate).toBe('2026-01-01')
    expect(cycles[1].startDate).toBe('2026-02-01')
  })

  it('deletes a cycle', async () => {
    const id = await addCycle({ startDate: '2026-01-01', length: 28 })
    await deleteCycle(id)
    expect(await getAllCycles()).toHaveLength(0)
  })
})
