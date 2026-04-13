import { useState } from 'react'
import { useProfile } from '../hooks/useProfile.js'
import { clearAllData, exportAllData } from '../storage/db.js'
import { hashPin } from '../storage/crypto.js'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'

const CONDITIONS = ['PCOS', 'Endometriosis', 'Thyroid disorder', 'Perimenopause']
const CONTRACEPTIVES = ['None', 'Pill', 'Hormonal IUD', 'Copper IUD', 'Implant', 'Patch', 'Other']

function SectionTitle({ children }) {
  return <p className="text-xs text-body uppercase tracking-widest mb-3 font-light">{children}</p>
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-primary' : 'bg-border-default'}`}
      role="switch"
      aria-checked={value}
    >
      <span className={`block w-4 h-4 rounded-full bg-white shadow-sm mx-0.5 transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export function SettingsView() {
  const { profile, updateProfile } = useProfile()
  const [confirmReset, setConfirmReset] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinStatus, setPinStatus] = useState(null)
  const [saved, setSaved] = useState(false)

  async function handleExport() {
    const data = await exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mpa-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return }
    await clearAllData()
    window.location.reload()
  }

  async function handleSetPin() {
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setPinStatus('PIN must be exactly 4 digits')
      return
    }
    const pinHash = await hashPin(pinInput)
    await updateProfile({ pinHash })
    setPinInput('')
    setPinStatus('PIN set successfully')
    setTimeout(() => setPinStatus(null), 3000)
  }

  async function handleRemovePin() {
    await updateProfile({ pinHash: null })
    setPinStatus('PIN removed')
    setTimeout(() => setPinStatus(null), 2000)
  }

  async function update(field, value) {
    await updateProfile({ [field]: value })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const p = profile || {}

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-6 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 100%)' }}>
        <h1 className="text-4xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>Settings</h1>
      </div>
      <div className="px-4 pt-4 pb-12">

      {/* Privacy status banner */}
      <Card className="p-4 mb-6 flex items-start gap-3 border-primary-light bg-primary/5">
        <Badge variant="success">Local only</Badge>
        <p className="text-xs text-body font-light leading-relaxed">
          All your data is stored only on this device. Nothing is sent to any server.
        </p>
      </Card>

      {/* Health Profile */}
      <Card className="p-4 mb-4">
        <SectionTitle>Health Profile</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-label mb-1 font-light">Year of birth</label>
            <input
              type="number" value={p.birthYear || ''} onChange={e => update('birthYear', +e.target.value)}
              min={1940} max={2015} placeholder="1995"
              className="w-full border border-border-default rounded-sm px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-label mb-1 font-light">Height (cm)</label>
              <input
                type="number" value={p.heightCm || ''} onChange={e => update('heightCm', +e.target.value)}
                placeholder="165"
                className="w-full border border-border-default rounded-sm px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-label mb-1 font-light">Weight (kg)</label>
              <input
                type="number" value={p.weightKg || ''} onChange={e => update('weightKg', +e.target.value)}
                placeholder="60"
                className="w-full border border-border-default rounded-sm px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-label mb-1 font-light">Contraceptive</label>
            <select
              value={p.contraceptiveType || 'None'} onChange={e => update('contraceptiveType', e.target.value)}
              className="w-full border border-border-default rounded-sm px-3 py-2 text-sm font-light focus:outline-none focus:border-primary bg-white"
            >
              {CONTRACEPTIVES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-label mb-2 font-light">Conditions</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(cond => {
                const active = (p.conditions || []).includes(cond)
                return (
                  <button
                    key={cond}
                    onClick={() => {
                      const current = p.conditions || []
                      update('conditions', active ? current.filter(c => c !== cond) : [...current, cond])
                    }}
                    className={`px-3 py-1 rounded-sm text-xs font-light border transition-colors ${
                      active ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-body hover:border-primary/40'
                    }`}
                  >
                    {cond}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-label font-light">Pregnant / Breastfeeding</label>
            <Toggle value={!!p.isPregnant} onChange={v => update('isPregnant', v)} />
          </div>
        </div>
        {saved && <p className="text-xs text-success-text mt-3 font-light">&#10003; Saved</p>}
      </Card>

      {/* Preferences */}
      <Card className="p-4 mb-4">
        <SectionTitle>Preferences</SectionTitle>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-heading font-light">Discreet mode</p>
              <p className="text-xs text-body font-light mt-0.5">Replaces &quot;period&quot; with &quot;cycle&quot; everywhere</p>
            </div>
            <Toggle value={!!p.discreetMode} onChange={v => update('discreetMode', v)} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-heading font-light">Temperature unit</p>
            <div className="flex gap-1">
              {['C', 'F'].map(u => (
                <button
                  key={u}
                  onClick={() => update('tempUnit', u)}
                  className={`px-3 py-1 text-xs font-light rounded-sm border transition-colors ${
                    (p.tempUnit || 'C') === u ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-body'
                  }`}
                >
                  &deg;{u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Controls */}
      <Card className="p-4 mb-4">
        <SectionTitle>Privacy Controls</SectionTitle>
        <div className="space-y-5">
          <div>
            <p className="text-sm text-heading font-light mb-1.5">App PIN lock</p>
            <p className="text-xs text-body font-light mb-2">4-digit PIN locks the app on this device. Hashed with PBKDF2 &mdash; raw PIN never stored.</p>
            <div className="flex gap-2">
              <input
                type="password" inputMode="numeric" maxLength={4}
                value={pinInput} onChange={e => setPinInput(e.target.value)}
                placeholder="4-digit PIN"
                className="flex-1 border border-border-default rounded-sm px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
              />
              <Button onClick={handleSetPin} size="sm">Set PIN</Button>
            </div>
            {p.pinHash && (
              <button onClick={handleRemovePin} className="text-xs text-ruby font-light mt-1.5 hover:underline">
                Remove PIN
              </button>
            )}
            {pinStatus && <p className="text-xs text-body font-light mt-1">{pinStatus}</p>}
          </div>

          <div>
            <p className="text-sm text-heading font-light mb-1">Export data</p>
            <p className="text-xs text-body font-light mb-2">Download all your data as JSON &mdash; useful for healthcare provider visits.</p>
            <Button onClick={handleExport} variant="ghost" size="sm">Download JSON</Button>
          </div>

          <div>
            <p className="text-sm text-heading font-light mb-1">Delete all data</p>
            <p className="text-xs text-body font-light mb-2">Permanently wipes all cycles, symptoms, and settings from this device. Cannot be undone.</p>
            <Button onClick={handleReset} variant="danger" size="sm">
              {confirmReset ? 'Tap again to confirm' : 'Delete all data'}
            </Button>
            {confirmReset && (
              <button className="text-xs text-body font-light ml-3 hover:underline" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </Card>

      <p className="text-xs text-body text-center font-light mt-6 pb-4">
        MPA v1.0 &middot; All data local &middot; No tracking &middot; No accounts
      </p>
      </div>
    </div>
  )
}
