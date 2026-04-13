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
    <div className="max-w-lg mx-auto px-4 pt-8">
      <h1 className="text-3xl font-light text-heading mb-6" style={{ letterSpacing: '-0.04em' }}>Calendar</h1>
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
  )
}
