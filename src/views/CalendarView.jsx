import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Camera, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildGoogleCalendarUrl } from '../services/calendarService';

export default function CalendarView() {
  const { events, setSelectedEventId, setActiveView } = useApp();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-500" />
            Shoot Calendar
          </h1>
          <p className="text-xs text-zinc-400">Monthly shoot calendar view for CrystalSky Photography</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-white px-2">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Calendar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-amber-500 border-b border-zinc-800 pb-2">
          <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
        </div>

        {/* Month Cells */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[70px] rounded-xl bg-zinc-900/20 border border-transparent"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.EventDate === dateStr);

            return (
              <div key={dayNum} className="min-h-[80px] p-2 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
                <span className="font-mono text-xs font-bold text-zinc-400">{dayNum}</span>
                <div className="space-y-1">
                  {dayEvents.map(e => (
                    <div
                      key={e.EventID}
                      onClick={() => { setSelectedEventId(e.EventID); setActiveView('event_detail'); }}
                      className="p-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold truncate cursor-pointer hover:bg-amber-500/30"
                    >
                      📸 {e.EventName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
