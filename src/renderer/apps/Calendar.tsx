import React, { useState } from 'react';
import { WindowInstance } from '../types/os';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Calendar: React.FC<{ window: WindowInstance }> = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full bg-os-bg flex flex-col p-6 select-none text-white overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">{monthName}</h2>
          <p className="text-os-accent font-medium">{year}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm hover:bg-white/10 rounded-md transition-colors border border-white/10"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider opacity-40">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 flex-1">
        {padding.map(i => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const isToday = today.getDate() === day && 
                          today.getMonth() === month && 
                          today.getFullYear() === year;
          
          return (
            <div key={day} className="flex items-center justify-center aspect-square relative group">
              <div className={twMerge(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all text-sm",
                isToday ? "bg-os-accent text-white font-bold" : "hover:bg-white/10 cursor-default"
              )}>
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
