import { useState } from 'react'
import { verifyPin } from '../storage/crypto.js'
import { Button } from './ui/Button.jsx'

export function PinLock({ pinHash, onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (pin.length !== 4) return
    setLoading(true)
    setError('')
    try {
      const ok = await verifyPin(pin, pinHash)
      if (ok) {
        onUnlock()
      } else {
        setError('Incorrect PIN')
        setPin('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-stripe">
            <span className="text-white text-2xl font-light">M</span>
          </div>
          <h1 className="text-2xl font-light text-heading tracking-tight">MPA</h1>
          <p className="text-body text-sm mt-1">Enter your PIN to unlock</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            className="w-full text-center text-3xl tracking-widest border border-default rounded-md px-4 py-3 outline-none focus:border-primary transition-colors"
            autoFocus
          />
          {error && <p className="text-ruby text-sm">{error}</p>}
          <Button type="submit" disabled={pin.length !== 4 || loading} className="w-full">
            Unlock
          </Button>
        </form>
      </div>
    </div>
  )
}
