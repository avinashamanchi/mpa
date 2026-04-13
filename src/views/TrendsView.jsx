import { useState } from 'react'
import { useCycles } from '../hooks/useCycles.js'
import { useSymptoms } from '../hooks/useSymptoms.js'
import { Card } from '../components/ui/Card.jsx'
import { CycleLengthChart } from '../components/trends/CycleLengthChart.jsx'
import { SymptomsTab } from '../components/trends/SymptomsTab.jsx'
import { ComparisonTab } from '../components/trends/ComparisonTab.jsx'

const TABS = ['Cycles', 'Symptoms', 'Comparison']

export function TrendsView() {
  const { cycles } = useCycles()
  const { logs } = useSymptoms()
  const [tab, setTab] = useState('Cycles')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-6 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 100%)' }}>
        <h1 className="text-4xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>Trends</h1>
      </div>
      <div className="px-4 pt-2">
      <div className="flex border-b border-border-default mb-4">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-light border-b-2 transition-colors -mb-px ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-body hover:text-heading'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="p-4">
        {tab === 'Cycles' && <CycleLengthChart cycles={cycles} />}
        {tab === 'Symptoms' && <SymptomsTab logs={logs} />}
        {tab === 'Comparison' && <ComparisonTab cycles={cycles} logs={logs} />}
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <p className="text-2xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>
            {cycles.filter(c => c.length).length}
          </p>
          <p className="text-xs text-body font-light mt-1">Cycles logged</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>
            {logs.length}
          </p>
          <p className="text-xs text-body font-light mt-1">Days logged</p>
        </Card>
      </div>
      </div>
    </div>
  )
}
