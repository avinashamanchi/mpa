import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { BottomNav } from './components/layout/BottomNav.jsx'
import { DashboardView } from './views/DashboardView.jsx'
import { LogView } from './views/LogView.jsx'
import { CalendarView } from './views/CalendarView.jsx'
import { TrendsView } from './views/TrendsView.jsx'
import { SettingsView } from './views/SettingsView.jsx'
import { PinLock } from './components/PinLock.jsx'
import { useProfile } from './hooks/useProfile.js'

export default function App() {
  const { profile, loading } = useProfile()
  const [unlocked, setUnlocked] = useState(false)

  if (!loading && profile?.pinHash && !unlocked) {
    return <PinLock pinHash={profile.pinHash} onUnlock={() => setUnlocked(true)} />
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-0">
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
    </HashRouter>
  )
}
