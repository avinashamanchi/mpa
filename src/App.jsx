import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav.jsx'
import { DashboardView } from './views/DashboardView.jsx'
import { LogView } from './views/LogView.jsx'
import { CalendarView } from './views/CalendarView.jsx'
import { TrendsView } from './views/TrendsView.jsx'
import { SettingsView } from './views/SettingsView.jsx'
import { PinLock } from './components/PinLock.jsx'
import { OnboardingWizard } from './components/OnboardingWizard.jsx'
import { useProfile } from './hooks/useProfile.js'

export default function App() {
  const { profile, loading } = useProfile()
  const [unlocked, setUnlocked] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 50%, #fff8ec 100%)' }}>
        <p className="text-body font-light text-sm">Loading…</p>
      </div>
    )
  }

  if (!profile?.onboardingComplete) {
    return <OnboardingWizard onComplete={() => window.location.reload()} />
  }

  if (profile?.pinHash && !unlocked) {
    return <PinLock pinHash={profile.pinHash} onUnlock={() => setUnlocked(true)} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <main className="pb-28">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/log" element={<LogView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/trends" element={<TrendsView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
