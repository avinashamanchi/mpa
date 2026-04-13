import { useState, useEffect, useCallback } from 'react'
import { getProfile, saveProfile } from '../storage/db.js'

export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile().then(p => { setProfile(p); setLoading(false) })
  }, [])

  const updateProfile = useCallback(async (updates) => {
    const next = { ...(profile || {}), ...updates }
    await saveProfile(next)
    setProfile(next)
  }, [profile])

  return { profile, loading, updateProfile }
}
