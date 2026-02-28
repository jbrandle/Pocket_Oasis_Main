
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, Trash2, Calendar as CalendarIcon, Clock, MapPin, Sparkles, Zap, Activity } from 'lucide-react';
import { UserProfile, CalendarEvent } from '../types';

interface CalendarViewProps {
  user: UserProfile;
  onBack: () => void;
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ user, onBack, onAddEvent, onDeleteEvent }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('Quest');
  const [newTime, setNewTime] = useState('12:00');

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);

    // Padding for start of month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [viewDate]);

  const selectedEvents = useMemo(() => {
    const dateStr = selectedDate.toDateString();
    return user.calendarEvents.filter(e => new Date(e.startTime).toDateString() === dateStr)
      .sort((a, b) => a.startTime - b.startTime);
  }, [user.calendarEvents, selectedDate]);

  const hasEvents = (date: Date) => {
    const dateStr = date.toDateString();
    return user.calendarEvents.some(e => new Date(e.startTime).toDateString() === dateStr);
  };

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

  const handleAddEvent = () => {
    if (!newTitle.trim()) return;
    const [hours, minutes] = newTime.split(':').map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);

    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newTitle,
      startTime: startTime.getTime(),
      category: newCategory
    };

    onAddEvent(event);
    setNewTitle('');
    setShowAddModal(false);
  };

  const getCategoryColor = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'Quest': return 'text-oasis-cyan bg-oasis-cyan/10 border-oasis-cyan/20';
      case 'Social': return 'text-magenta-400 bg-magenta-400/10 border-magenta-400/20';
      case 'Biometric': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0c0c14] text-white overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <header className="shrink-0 p-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-3xl z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl active:scale-90 transition-all">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Chronos Sync</h1>
            <p className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.3em] mt-1">Temporal Data Matrix</p>
          </div>
        </div>
        <div className="bg-oasis-cyan/5 px-3 py-1.5 rounded-xl border border-oasis-cyan/20 flex items-center gap-2">
          <CalendarIcon size={12} className="text-oasis-cyan" />
          <span className="text-[10px] font-mono font-black text-white">
            {viewDate.toLocaleDateString([], { month: 'short', year: 'numeric' }).toUpperCase()}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Month Navigation & Grid */}
        <section className="p-5">
          <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-sm font-black italic uppercase tracking-widest text-oasis-cyan">
                {viewDate.toLocaleDateString([], { month: 'long' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 bg-white/5 rounded-lg border border-white/5 hover:border-oasis-cyan transition-all"><ChevronLeft size={16}/></button>
                <button onClick={handleNextMonth} className="p-2 bg-white/5 rounded-lg border border-white/5 hover:border-oasis-cyan transition-all"><ChevronRight size={16}/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['S','M','T','W','T','F','S'].map(d => (
                <div key={d} className="text-[8px] font-black text-gray-600 mb-2 uppercase tracking-widest">{d}</div>
              ))}
              {calendarDays.map((date, i) => {
                if (!date) return <div key={`pad-${i}`} className="aspect-square" />;
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const hasEv = hasEvents(date);

                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`relative aspect-square rounded-xl flex items-center justify-center transition-all text-xs font-mono font-black border ${
                      isSelected ? 'bg-oasis-cyan text-black border-oasis-cyan shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 
                      isToday ? 'bg-white/10 text-white border-oasis-cyan/40' : 
                      'bg-transparent text-gray-400 border-transparent hover:border-white/20'
                    }`}
                  >
                    {date.getDate()}
                    {hasEv && !isSelected && (
                      <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-oasis-cyan animate-pulse shadow-[0_0_4px_rgba(0,243,255,1)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Selected Day Events */}
        <section className="px-5 space-y-4">
           <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Schedule Log</h3>
                <div className="text-lg font-black italic tracking-tighter text-white uppercase">
                  {selectedDate.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-oasis-cyan/10 p-2.5 rounded-xl border border-oasis-cyan/30 text-oasis-cyan hover:bg-oasis-cyan hover:text-black transition-all shadow-lg active:scale-95"
              >
                <Plus size={20} />
              </button>
           </div>

           <div className="space-y-3">
              {selectedEvents.length === 0 ? (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 text-gray-600 grayscale opacity-40">
                  <Zap size={32} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Path Clear</span>
                </div>
              ) : (
                selectedEvents.map(event => (
                  <div key={event.id} className="bg-white/5 rounded-[1.8rem] p-5 border border-white/10 flex items-center gap-4 group transition-all hover:border-white/20">
                    <div className={`shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center border font-mono ${getCategoryColor(event.category)}`}>
                       <span className="text-[10px] font-black leading-none">{new Date(event.startTime).getHours().toString().padStart(2,'0')}</span>
                       <span className="text-[8px] opacity-60 font-bold">:</span>
                       <span className="text-[10px] font-black leading-none">{new Date(event.startTime).getMinutes().toString().padStart(2,'0')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 rounded border ${getCategoryColor(event.category)}`}>{event.category}</span>
                      </div>
                      <h4 className="text-sm font-black text-white uppercase italic tracking-tighter truncate">{event.title}</h4>
                    </div>
                    <button 
                      onClick={() => onDeleteEvent(event.id)}
                      className="p-2.5 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
           </div>
        </section>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
           <div className="relative bg-[#12121a] border border-white/20 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_30px_120px_rgba(0,243,255,0.2)]">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">New Sync Goal</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                 <div>
                   <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Task Identifier</label>
                   <input 
                      type="text" 
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Enter Goal..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-black outline-none focus:border-oasis-cyan transition-all"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Protocol Type</label>
                      <select 
                        value={newCategory} 
                        onChange={e => setNewCategory(e.target.value as any)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-black outline-none appearance-none text-oasis-cyan"
                      >
                         <option value="Quest">Quest</option>
                         <option value="Social">Social</option>
                         <option value="Biometric">Biometric</option>
                         <option value="Sync">Sync</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Target Time</label>
                      <input 
                        type="time" 
                        value={newTime}
                        onChange={e => setNewTime(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-black outline-none appearance-none text-white"
                      />
                    </div>
                 </div>

                 <button 
                   onClick={handleAddEvent}
                   className="w-full bg-oasis-cyan text-black font-black py-4 rounded-2xl shadow-xl shadow-oasis-cyan/20 active:scale-95 transition-all uppercase tracking-widest text-[10px] mt-4"
                 >
                    COMMIT SYNC
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
