import { HashRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { BottomNav } from './components/layout/BottomNav.jsx'
import { DashboardView } from './views/DashboardView.jsx'
import { LogView } from './views/LogView.jsx'
import { CalendarView } from './views/CalendarView.jsx'
import { TrendsView } from './views/TrendsView.jsx'
import { SettingsView } from './views/SettingsView.jsx'

export default function App() {
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
