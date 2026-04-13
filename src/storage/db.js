import { openDB } from 'idb'
import { DB_NAME, DB_VERSION, STORES } from './schema.js'

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore(STORES.PROFILE)
          const cycleStore = db.createObjectStore(STORES.CYCLES, { keyPath: 'id', autoIncrement: true })
          cycleStore.createIndex('by-startDate', 'startDate')
          const logStore = db.createObjectStore(STORES.SYMPTOM_LOGS, { keyPath: 'id', autoIncrement: true })
          logStore.createIndex('by-date', 'date')
          logStore.createIndex('by-cycleId', 'cycleId')
        }
      },
    })
  }
  return dbPromise
}

export async function getProfile() {
  const db = await getDB()
  return (await db.get(STORES.PROFILE, 'profile')) ?? null
}

export async function saveProfile(data) {
  const db = await getDB()
  await db.put(STORES.PROFILE, { ...data }, 'profile')
}

export async function getAllCycles() {
  const db = await getDB()
  const all = await db.getAllFromIndex(STORES.CYCLES, 'by-startDate')
  return all.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
}

export async function addCycle(cycle) {
  const db = await getDB()
  return db.add(STORES.CYCLES, cycle)
}

export async function updateCycle(cycle) {
  const db = await getDB()
  return db.put(STORES.CYCLES, cycle)
}

export async function deleteCycle(id) {
  const db = await getDB()
  return db.delete(STORES.CYCLES, id)
}

export async function getLogByDate(date) {
  const db = await getDB()
  const results = await db.getAllFromIndex(STORES.SYMPTOM_LOGS, 'by-date', date)
  return results[0] ?? null
}

export async function getAllLogs() {
  const db = await getDB()
  return db.getAll(STORES.SYMPTOM_LOGS)
}

export async function saveLog(log) {
  const db = await getDB()
  if (log.id) return db.put(STORES.SYMPTOM_LOGS, log)
  return db.add(STORES.SYMPTOM_LOGS, log)
}

export async function deleteLog(id) {
  const db = await getDB()
  return db.delete(STORES.SYMPTOM_LOGS, id)
}

export async function clearAllData() {
  const db = await getDB()
  const tx = db.transaction(Object.values(STORES), 'readwrite')
  await Promise.all([
    tx.objectStore(STORES.PROFILE).clear(),
    tx.objectStore(STORES.CYCLES).clear(),
    tx.objectStore(STORES.SYMPTOM_LOGS).clear(),
  ])
  await tx.done
}

export async function exportAllData() {
  const [profile, cycles, logs] = await Promise.all([getProfile(), getAllCycles(), getAllLogs()])
  return { exportedAt: new Date().toISOString(), profile, cycles, logs }
}
