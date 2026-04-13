import { useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { Card } from '../ui/Card.jsx'

const SYMPTOM_CATEGORIES = {
  Physical: ['Cramps', 'Headache', 'Bloating', 'Breast tenderness', 'Back pain', 'Fatigue', 'Nausea'],
  Mood: ['Anxious', 'Irritable', 'Sad', 'Calm', 'Energetic', 'Foggy', 'Happy'],
  Sleep: ['Insomnia', 'Vivid dreams', 'Restless', 'Deep sleep'],
  Digestion: ['Bloating', 'Constipation', 'Diarrhea', 'Appetite increase', 'Appetite decrease'],
}

export function SymptomLogger({ onSave, existingLog, date }) {
  const [selected, setSelected] = useState(() => {
    const map = {}
    for (const s of (existingLog?.symptoms || [])) map[s.type] = s.severity
    return map
  })
  const [notes, setNotes] = useState(existingLog?.notes || '')
  const [bbt, setBbt] = useState(existingLog?.bbt || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleSymptom(type) {
    setSelected(prev => {
      if (prev[type] != null) { const n = { ...prev }; delete n[type]; return n }
      return { ...prev, [type]: 3 }
    })
  }

  function setSeverity(type, severity) {
    setSelected(prev => ({ ...prev, [type]: severity }))
  }

  async function handleSave() {
    setSaving(true)
    const symptoms = Object.entries(selected).map(([type, severity]) => ({ type, severity }))
    await onSave({ symptoms, notes, bbt: bbt ? parseFloat(bbt) : null }, date)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card className="p-4 mb-4">
      <p className="text-xs text-body uppercase tracking-widest mb-3 font-light">Symptoms</p>
      {Object.entries(SYMPTOM_CATEGORIES).map(([cat, items]) => (
        <div key={cat} className="mb-4">
          <p className="text-xs text-label mb-2 font-light">{cat}</p>
          <div className="flex flex-wrap gap-1.5">
            {items.map(item => {
              const key = item.toLowerCase()
              const active = selected[key] != null
              return (
                <div key={item}>
                  <button
                    onClick={() => toggleSymptom(key)}
                    className={`px-2.5 py-1 rounded-sm text-xs font-light border transition-colors ${
                      active ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-body hover:border-primary/40'
                    }`}
                  >
                    {item}
                  </button>
                  {active && (
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setSeverity(key, n)}
                          className={`w-5 h-1.5 rounded-full transition-colors ${n <= selected[key] ? 'bg-primary' : 'bg-border-default'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div className="mb-3">
        <label className="block text-xs text-label mb-1 font-light">BBT (optional)</label>
        <input
          type="number" step="0.01" value={bbt} onChange={e => setBbt(e.target.value)}
          placeholder="36.5"
          className="w-full border border-border-default rounded-sm px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
        />
      </div>
      <div className="mb-3">
        <label className="block text-xs text-label mb-1 font-light">Notes</label>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          className="w-full border border-border-default rounded-sm px-3 py-2 text-sm font-light focus:outline-none focus:border-primary resize-none"
          placeholder="Anything else to note…"
        />
      </div>
      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Log'}
      </Button>
    </Card>
  )
}
