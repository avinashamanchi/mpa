import { useState } from 'react'
import { useCycles } from '../hooks/useCycles.js'
import { useSymptoms } from '../hooks/useSymptoms.js'
import { CycleCalendar } from '../components/calendar/CycleCalendar.jsx'
import { Card } from '../components/ui/Card.jsx'
import { format } from 'date-fns'

export function CalendarView() {
  const { cycles, prediction } = useCycles()
  const { logs } = useSymptoms()
  const [selectedDay, setSelectedDay] = useState(null)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-6 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 100%)' }}>
        <h1 className="text-4xl font-light text-heading" style={{ letterSpacing: '-0.04em' }}>Calendar</h1>
      </div>
      <div className="px-4 pt-2 pb-4">
      <Card className="p-4 mb-4">
        <CycleCalendar
          cycles={cycles}
          prediction={prediction}
          logs={logs}
          onDayClick={(day, log) => setSelectedDay({ day, log })}
        />
      </Card>
      {selectedDay && (
        <Card className="p-4">
          <p className="text-xs text-body uppercase tracking-widest mb-2 font-light">
            {format(selectedDay.day, 'MMMM d, yyyy')}
          </p>
          {selectedDay.log ? (
            <div>
              {selectedDay.log.symptoms?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedDay.log.symptoms.map(s => (
                    <span key={s.type} className="text-xs font-light text-label bg-border-default/50 rounded-sm px-2 py-0.5">
                      {s.type} ({s.severity}/5)
                    </span>
                  ))}
                </div>
              )}
              {selectedDay.log.bbt && <p className="text-xs text-body mt-1 font-light">BBT: {selectedDay.log.bbt}°</p>}
              {selectedDay.log.notes && <p className="text-xs text-body mt-1 font-light">{selectedDay.log.notes}</p>}
            </div>
          ) : (
            <p className="text-sm text-body font-light">No log for this day.</p>
          )}
        </Card>
      )}
      </div>
    </div>
  )
}
