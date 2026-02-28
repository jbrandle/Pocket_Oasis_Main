
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, ZoneType, ActivityLogItem } from '../types';
import { Map, Briefcase, ShoppingBag, Gamepad2, Bell, MessageCircle, Settings, Flame, Calendar, Footprints, Target, Palmtree, BookOpen, Rocket, Cloud, CheckCircle2, X, Trash2, Zap, Clock, Lock, Sparkles, ChevronRight, MapPin, TrendingUp, Trophy, CloudSun, ThermometerSun, AlertCircle, ArrowUpRight, Brain, Battery, Activity, Sword, Target as TargetIcon, Leaf, Building2, Ticket, Mail, Info, HelpCircle, ArrowDownRight, Package } from 'lucide-react';

interface HubProps {
  user: UserProfile;
  onEnterZone: (zone: ZoneType) => void;
  onOpenJob: () => void;
  onOpenShop: () => void;
  onOpenArcade: () => void;
  onOpenSocial: () => void;
  onOpenSettings: () => void;
  onOpenCalendar: () => void;
  onOpenGuide: () => void;
  onLogout: () => void;
  onClearNotifications: () => void;
  onReadNotification: (id: string) => void;
  onSetXPGoal: (goal: number) => void;
  onToggleTimeFormat: () => void;
  onPurchasePass: (zone: ZoneType) => void;
}

const Hub: React.FC<HubProps> = ({ 
  user, onEnterZone, onOpenJob, onOpenShop, onOpenArcade, onOpenSocial, onOpenSettings, onOpenCalendar, onOpenGuide, onLogout, onClearNotifications, onReadNotification, onSetXPGoal, onToggleTimeFormat, onPurchasePass
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [selectedActivityDate, setSelectedActivityDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(null);
  const [lockedZoneProposal, setLockedZoneProposal] = useState<ZoneType | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user.preferences.locationSync) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const response = await fetch(`https://wttr.in/${latitude},${longitude}?format=j1`);
          const data = await response.json();
          const tempC = parseInt(data.current_condition[0].temp_C);
          const tempF = parseInt(data.current_condition[0].temp_F);
          setWeather({
            temp: user.preferences.unitSystem === 'Metric' ? tempC : tempF,
            icon: data.current_condition[0].weatherDesc[0].value
          });
        } catch (e) {
          console.debug("Weather sync failed", e);
        }
      }, (err) => console.debug("Geo failed", err));
    }
  }, [user.preferences.locationSync, user.preferences.unitSystem]);

  const todayXP = useMemo(() => {
    const today = new Date().toDateString();
    return user.history.filter(h => h.dateString === today).reduce((acc, curr) => acc + curr.xpEarned, 0);
  }, [user.history]);

  const stepPercent = Math.min(100, Math.floor((user.currentSteps / (user.stepGoal || 10000)) * 100));
  const xpPercent = Math.min(100, Math.floor((todayXP / (user.dailyXPGoal || 100)) * 100));
  const isActuallySubscribed = user.isSubscriber || (user.trialEndsAt && user.trialEndsAt > Date.now());

  const checkZoneAccess = (zone: ZoneType) => {
    if (zone === ZoneType.SYNTHWAVE) return true;
    if (isActuallySubscribed) return true;
    if (user.temporaryZoneAccess && user.temporaryZoneAccess[zone] && user.temporaryZoneAccess[zone]! > Date.now()) return true;
    return false;
  };

  const formattedTime = useMemo(() => {
    const is12h = user.preferences.timeFormat === '12h';
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: is12h
    };
    return currentTime.toLocaleTimeString([], options).toUpperCase();
  }, [currentTime, user.preferences.timeFormat]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  }, [currentTime]);

  const weekHistory = useMemo(() => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    const currentDayOfWeek = today.getDay(); 
    const data = [];
    
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDayOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const dateStr = d.toDateString();
      const xpValue = user.history.filter(h => h.dateString === dateStr).reduce((acc, curr) => acc + curr.xpEarned, 0);
      const isToday = dateStr === today.toDateString();
      const hasPendingTasks = isToday && (xpValue < user.dailyXPGoal || user.currentSteps < user.stepGoal);
      
      data.push({ 
        name: dayNames[i], 
        fullDate: d,
        xp: xpValue,
        isToday,
        goalMet: xpValue >= user.dailyXPGoal,
        hasPendingTasks
      });
    }
    return data;
  }, [user.history, user.dailyXPGoal, user.currentSteps, user.stepGoal]);

  const unreadCount = user.notifications.filter(n => !n.read).length;

  const handleDayClick = (dayData: any) => {
    setSelectedActivityDate(dayData.fullDate);
    setShowActivities(true);
  };

  const handleSectorClick = (zone: ZoneType) => {
    if (checkZoneAccess(zone)) {
      onEnterZone(zone);
    } else {
      setLockedZoneProposal(zone);
    }
  };

  return (
    <div className={`h-full w-full bg-[#1c1c2b] text-white flex flex-col overflow-hidden relative transition-colors duration-1000 ${user.avatar.style === 'photoreal' ? 'contrast-125 saturate-50' : 'saturate-150 brightness-110'}`}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-magenta-500/10 pointer-events-none" />
      
      <header className="shrink-0 z-40 bg-white/5 backdrop-blur-3xl border-b border-white/10 px-4 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 relative shadow-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0" onClick={onOpenShop}>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr from-oasis-cyan via-indigo-400 to-indigo-600 flex items-center justify-center font-black text-base shadow-[0_0_15px_rgba(0,243,255,0.3)] active:scale-95 transition-transform`}>
              {user.avatar.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="font-black text-[11px] tracking-tight leading-none uppercase italic truncate max-w-[110px] mb-1 pr-1">{user.avatar.name}</h2>
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black text-oasis-cyan/60 uppercase tracking-tighter leading-none">{user.subSystem}</span>
              <span className="text-[8px] font-black text-white/40 uppercase tracking-tighter leading-none">LVL {user.level}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-w-0 px-2 overflow-hidden">
            <button 
              onClick={onOpenCalendar}
              className="group relative text-base font-black tracking-tighter text-white italic font-mono drop-shadow-[0_0_12px_rgba(0,243,255,0.4)] active:scale-95 transition-all leading-tight whitespace-nowrap truncate w-full text-center"
            >
                <span className="group-hover:text-oasis-cyan transition-colors">{formattedTime}</span>
                <Calendar size={10} className="absolute -right-3 top-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-oasis-cyan" />
            </button>
            <div className="flex items-center gap-1.5 text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mt-0.5 whitespace-nowrap">
                <button onClick={onToggleTimeFormat} className="opacity-80 hover:text-white transition-colors">
                  {formattedDate}
                </button>
                <span className="opacity-20">|</span>
                {user.preferences.locationSync && weather ? (
                   <span className="flex items-center gap-0.5 text-oasis-cyan font-mono animate-in fade-in duration-500">
                     <ThermometerSun size={7} /> {weather.temp}°
                   </span>
                ) : (
                   <button onClick={onOpenSettings} className="text-gray-600 hover:text-oasis-cyan transition-colors flex items-center gap-0.5 lowercase font-mono">
                     <MapPin size={7} /> sync loc
                   </button>
                )}
            </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button onClick={onOpenGuide} title="Neural Manual" className="text-gray-400 hover:text-oasis-cyan p-1.5 relative transition-all bg-white/5 rounded-full border border-white/10 active:scale-90">
              <HelpCircle size={16} />
          </button>
          <button onClick={() => setShowNotifs(true)} className="text-white hover:text-oasis-cyan p-1.5 relative transition-all bg-white/5 rounded-full border border-white/10 active:scale-90">
              <Bell size={16} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></span>}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32 scroll-smooth no-scrollbar relative z-10">
        <main className="p-5 space-y-6">
          <section className="bg-white/15 p-3 rounded-[1.5rem] border border-white/10 shadow-xl relative overflow-hidden group">
             <div className="flex justify-between items-center mb-1.5 px-1">
                <div className="flex items-center gap-1.5 text-[8px] font-black text-oasis-cyan uppercase tracking-[0.2em]">
                   <Footprints size={12} /> Daily Steps
                </div>
                <div className="text-[9px] font-mono font-black text-white/90">
                   {user.currentSteps.toLocaleString()} <span className="opacity-40">/ {user.stepGoal.toLocaleString()}</span>
                </div>
             </div>
             <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden border border-white/5 p-[0.5px]">
                <div className="h-full bg-gradient-to-r from-oasis-cyan via-indigo-400 shadow-[0_0_10px_rgba(0,243,255,0.6)] transition-all duration-1000 ease-out rounded-full" style={{width: `${stepPercent}%`}} />
             </div>
          </section>

          <section className="bg-white/10 rounded-[1.8rem] p-5 border border-white/20 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <h3 className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-1.5 mb-1">
                    <TrendingUp size={10} className="text-oasis-cyan" /> Progress Log
                  </h3>
                  <div className="text-lg font-black italic tracking-tighter text-white uppercase leading-none">Sync Log</div>
               </div>
               <div className="text-right">
                  <div className="text-base font-mono font-black text-oasis-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">{todayXP} XP</div>
               </div>
            </div>
            
            <div className="flex justify-between items-center gap-2">
              {weekHistory.map((day, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleDayClick(day)}
                  className="flex flex-col items-center flex-1 gap-2 group/day active:scale-95 transition-all"
                >
                  <div className={`relative w-full aspect-square rounded-lg border flex items-center justify-center transition-all ${
                    day.isToday 
                      ? 'border-oasis-cyan bg-oasis-cyan/20' 
                      : day.goalMet 
                        ? 'border-indigo-400/60 bg-indigo-500/20' 
                        : 'border-white/5 bg-white/5'
                  } ${day.hasPendingTasks ? 'animate-neural-pulse' : ''}`}>
                    {day.goalMet ? (
                      <CheckCircle2 size={12} className={day.isToday ? "text-oasis-cyan" : "text-indigo-200"} />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ${day.xp > 0 ? 'bg-indigo-400/60' : 'bg-gray-700'}`} />
                    )}
                    
                    {day.hasPendingTasks && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black shadow-[0_0_8px_red] animate-crit-pulse" />
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase ${day.isToday ? 'text-oasis-cyan' : 'text-gray-500'}`}>
                    {day.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3 px-1">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] flex items-center gap-2">
                 <Sparkles size={12} className="text-oasis-cyan" /> Oasis Sectors
               </h3>
               <span className="text-[7px] font-black text-oasis-cyan/60 uppercase tracking-widest">Premium Collection</span>
            </div>

            <div className="space-y-4">
              <SectorButton 
                zone={ZoneType.SYNTHWAVE} 
                icon={<Palmtree size={24}/>} 
                sub="Retro-Sunset Paradise" 
                color="magenta" 
                onClick={handleSectorClick} 
                imageUrl="https://picsum.photos/id/1067/800/400"
              />

              <div className="grid grid-cols-2 gap-3">
                <SectorButton 
                  zone={ZoneType.FPS} 
                  icon={<TargetIcon size={18}/>} 
                  sub="Tactical Arena" 
                  color="orange" 
                  onClick={handleSectorClick} 
                  isLocked={!checkZoneAccess(ZoneType.FPS)}
                  onSubscribe={onOpenSettings}
                  imageUrl="https://picsum.photos/id/75/400/400"
                  compact
                />
                <SectorButton 
                  zone={ZoneType.CYBER} 
                  icon={<Building2 size={18}/>} 
                  sub="Neon Metropolis" 
                  color="cyan" 
                  onClick={handleSectorClick} 
                  isLocked={!checkZoneAccess(ZoneType.CYBER)}
                  onSubscribe={onOpenSettings}
                  imageUrl="https://picsum.photos/id/1043/400/400"
                  compact
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SectorButton 
                  zone={ZoneType.MEDIEVAL} 
                  icon={<Sword size={18}/>} 
                  sub="Ancient Magic" 
                  color="indigo" 
                  onClick={handleSectorClick} 
                  isLocked={!checkZoneAccess(ZoneType.MEDIEVAL)}
                  onSubscribe={onOpenSettings}
                  imageUrl="https://picsum.photos/id/10/400/400"
                  compact
                />
                <SectorButton 
                  zone={ZoneType.CHILL} 
                  icon={<Leaf size={18}/>} 
                  sub="Peaceful Sanctuary" 
                  color="cyan" 
                  onClick={handleSectorClick} 
                  isLocked={!checkZoneAccess(ZoneType.CHILL)}
                  onSubscribe={onOpenSettings}
                  imageUrl="https://picsum.photos/id/54/400/400"
                  compact
                />
              </div>

              <SectorButton 
                zone={ZoneType.LIBRARY} 
                icon={<BookOpen size={24}/>} 
                sub="The Infinite Archives" 
                color="cyan" 
                onClick={handleSectorClick} 
                isLocked={!checkZoneAccess(ZoneType.LIBRARY)}
                onSubscribe={onOpenSettings}
                imageUrl="https://picsum.photos/id/1073/800/400"
              />

              <div className="grid grid-cols-2 gap-3">
                <SectorButton 
                  zone={ZoneType.MARS} 
                  icon={<Rocket size={18}/>} 
                  sub="Red Frontier" 
                  color="orange" 
                  onClick={handleSectorClick} 
                  isLocked={!checkZoneAccess(ZoneType.MARS)}
                  onSubscribe={onOpenSettings}
                  imageUrl="https://picsum.photos/id/1029/400/400"
                  compact
                />
                <SectorButton 
                  zone={ZoneType.SKYCITY} 
                  icon={<Cloud size={18}/>} 
                  sub="Aether Peaks" 
                  color="indigo" 
                  onClick={handleSectorClick} 
                  isLocked={!checkZoneAccess(ZoneType.SKYCITY)}
                  onSubscribe={onOpenSettings}
                  imageUrl="https://picsum.photos/id/1014/400/400"
                  compact
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-3 px-1">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] flex items-center gap-2">
                 <Zap size={12} className="text-yellow-400" /> Nexus
               </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <AppTile onClick={onOpenJob} icon={<Briefcase size={16}/>} label="GIG NEXUS" sub="Gigs" color="text-yellow-400" bgColor="bg-yellow-500/10" border="border-yellow-500/30" />
                <AppTile onClick={onOpenArcade} icon={<Gamepad2 size={16}/>} label="ARCADE" sub="Games" color="text-oasis-cyan" bgColor="bg-oasis-cyan/10" border="border-oasis-cyan/30" />
              </div>
              <AppTile onClick={onOpenGuide} icon={<BookOpen size={16}/>} label="NEURAL MANUAL" sub="Tutorial & Info" color="text-blue-400" bgColor="bg-blue-500/10" border="border-blue-500/30" />
            </div>
          </section>
        </main>
      </div>

      {/* Notifications Overlay */}
      {showNotifs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowNotifs(false)} />
           <div className="relative bg-[#12121a] border border-white/20 rounded-[2.5rem] w-full max-w-sm max-h-[75vh] flex flex-col overflow-hidden shadow-[0_20px_80px_rgba(0,243,255,0.25)]">
              <header className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">Neural Comms</h2>
                    <p className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.4em] mt-1">Direct Uplink Stream</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <button onClick={onClearNotifications} className="p-2 hover:bg-red-500/10 rounded-full text-red-500/60" title="Clear All"><Trash2 size={16}/></button>
                   <button onClick={() => setShowNotifs(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-400"><X size={20}/></button>
                 </div>
              </header>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                 {user.notifications.length === 0 ? (
                   <div className="h-48 flex flex-col items-center justify-center text-gray-700 opacity-40 space-y-4">
                      <div className="p-6 rounded-full bg-white/5 border border-white/5 shadow-inner"><Bell size={32} /></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Neural Stream Quiet</p>
                   </div>
                 ) : (
                   user.notifications.map((n) => (
                     <div 
                       key={n.id} 
                       onClick={() => onReadNotification(n.id)}
                       className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${n.read ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/[0.06] border-oasis-cyan/30 shadow-[0_4px_12px_rgba(0,243,255,0.1)]'}`}
                     >
                        <div className="flex items-start gap-3">
                           <div className={`p-2 rounded-xl shrink-0 ${
                             n.type === 'QUEST' ? 'bg-yellow-500/20 text-yellow-500' :
                             n.type === 'SOCIAL' ? 'bg-magenta-500/20 text-magenta-500' :
                             'bg-oasis-cyan/20 text-oasis-cyan'
                           }`}>
                             {n.type === 'QUEST' ? <Target size={14}/> : n.type === 'SOCIAL' ? <Mail size={14}/> : <Info size={14}/>}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-0.5">
                                 <h4 className="text-[11px] font-black uppercase text-white truncate">{n.title}</h4>
                                 <span className="text-[8px] text-gray-600 font-mono">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 leading-snug line-clamp-2">{n.message}</p>
                           </div>
                        </div>
                        {!n.read && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-oasis-cyan rounded-full animate-pulse" />}
                     </div>
                   ))
                 )}
              </div>
              
              <div className="p-4 bg-black/40 border-t border-white/5 flex justify-center items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-oasis-cyan animate-pulse" />
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Protocol Version: 2.5.9-LATEST</span>
              </div>
           </div>
        </div>
      )}

      {/* Access Proposal Dialog */}
      {lockedZoneProposal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setLockedZoneProposal(null)} />
           <div className="relative bg-[#12121a] border border-white/20 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-[0_30px_100px_rgba(0,243,255,0.2)]">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-tr from-oasis-cyan to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-12">
                 <Ticket size={40} className="text-black" />
              </div>
              
              <div className="mt-8 mb-8">
                 <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Unlock the Horizon</h2>
                 <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                   The <span className="text-oasis-cyan font-black">{lockedZoneProposal}</span> is currently exclusive to <span className="text-yellow-500 font-black">Oasis Prime</span> members.
                 </p>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8 text-left space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-oasis-cyan/10 rounded-lg text-oasis-cyan mt-1"><Sparkles size={14}/></div>
                    <div>
                       <h4 className="text-[11px] font-black uppercase text-white tracking-tight">One-Time Uplink</h4>
                       <p className="text-[9px] text-gray-500 leading-tight mt-1">Temporary 24-cycle access pass. Perfect for a quick mission.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-500 mt-1"><Trophy size={14}/></div>
                    <div>
                       <h4 className="text-[11px] font-black uppercase text-white tracking-tight">Permanent Prime</h4>
                       <p className="text-[9px] text-gray-500 leading-tight mt-1">Unlock ALL horizons forever, plus daily CR bonuses.</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => { onPurchasePass(lockedZoneProposal); setLockedZoneProposal(null); }}
                   disabled={user.credits < 150}
                   className="w-full bg-oasis-cyan hover:bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-oasis-cyan/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   CLAIM 24H PASS <span className="opacity-40">|</span> 150 CR
                 </button>
                 <button 
                   onClick={onOpenSettings}
                   className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-yellow-600/20 active:scale-95 transition-all"
                 >
                   UPGRADE TO PRIME
                 </button>
                 <button onClick={() => setLockedZoneProposal(null)} className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-2">Maybe later</button>
              </div>
           </div>
        </div>
      )}

      {/* Daily Activities / Historical Sync Log Overlay */}
      {showActivities && selectedActivityDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowActivities(false)} />
           <div className="relative bg-[#12121a] border border-white/20 rounded-[2.5rem] w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden shadow-[0_20px_80px_rgba(0,243,255,0.25)]">
              <header className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">Neural Feed</h2>
                    <p className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.4em] mt-1">
                      {selectedActivityDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                 </div>
                 <button onClick={() => setShowActivities(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-400"><X size={20}/></button>
              </header>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                 {selectedActivityDate.toDateString() === new Date().toDateString() ? (
                   // --- LIVE FEED VIEW ---
                   <>
                      <div className="bg-oasis-cyan/10 border border-oasis-cyan/30 p-5 rounded-3xl flex items-center gap-4 shadow-inner">
                         <div className="w-12 h-12 rounded-2xl bg-oasis-cyan/20 flex items-center justify-center text-oasis-cyan border border-oasis-cyan/20 shadow-lg"><Target size={24}/></div>
                         <div className="flex-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">XP Goal Progress</h4>
                            <div className="flex items-center gap-3">
                               <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                  <div className="h-full bg-gradient-to-r from-oasis-cyan to-indigo-500 transition-all duration-1000" style={{width: `${xpPercent}%`}} />
                               </div>
                               <span className="text-[11px] font-mono text-oasis-cyan font-black">{todayXP}/{user.dailyXPGoal}</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em] px-1 flex items-center gap-2">
                           <Activity size={10} className="text-oasis-cyan"/> Urgent Syncs
                         </h3>
                         
                         <OpportunityItem 
                            icon={<TargetIcon size={18}/>} 
                            title="Neon Arena Protocol" 
                            reward="40 XP • 150 CR" 
                            color="text-magenta-400" 
                            onClick={() => { setShowActivities(false); handleSectorClick(ZoneType.FPS); }} 
                         />
                         <OpportunityItem 
                            icon={<Briefcase size={18}/>} 
                            title="Neural Mixology" 
                            reward="80-300 CR" 
                            color="text-yellow-500" 
                            onClick={() => { setShowActivities(false); onOpenJob(); }} 
                         />
                         <OpportunityItem 
                            icon={<Building2 size={18}/>} 
                            title="Cyber City Maintenance" 
                            reward="Bonus XP x1.5" 
                            color="text-oasis-cyan" 
                            onClick={() => { setShowActivities(false); handleSectorClick(ZoneType.CYBER); }} 
                         />
                      </div>
                   </>
                 ) : (
                   // --- HISTORICAL AUDIT VIEW ---
                   <HistoricalAudit date={selectedActivityDate} user={user} onEnterZone={onEnterZone} />
                 )}
              </div>
              
              <div className="p-4 bg-black/40 border-t border-white/5 flex justify-center items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-oasis-cyan animate-pulse" />
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Real-time Connection: STABLE</span>
              </div>
           </div>
        </div>
      )}

      <nav className="shrink-0 bg-[#22223a]/95 backdrop-blur-3xl border-t border-white/20 px-6 py-4 flex justify-between items-center z-50 safe-area-bottom shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
        <NavBtn icon={<Map size={22}/>} label="HUD" active />
        <NavBtn icon={<MessageCircle size={22}/>} label="COMMS" onClick={onOpenSocial} />
        <NavBtn icon={<ShoppingBag size={22}/>} label="AVATAR" onClick={onOpenShop} />
        <NavBtn icon={<Settings size={22}/>} label="SYNC" onClick={onOpenSettings} />
      </nav>
    </div>
  );
};

const HistoricalAudit = ({ date, user, onEnterZone }: { date: Date, user: UserProfile, onEnterZone: any }) => {
    const dateStr = date.toDateString();
    const historyForDate = user.history.filter(h => h.dateString === dateStr);
    
    const totals = historyForDate.reduce((acc, curr) => ({
        xp: acc.xp + (curr.xpEarned || 0),
        cr: acc.cr + (curr.creditsEarned || 0),
        items: [...acc.items, ...(curr.itemsFound || [])],
        dmg: acc.dmg + (curr.integrityLost || 0)
    }), { xp: 0, cr: 0, items: [] as string[], dmg: 0 });

    const goalMet = totals.xp >= user.dailyXPGoal;

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-400">
            {/* Header Totals */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest block mb-1">Cycle Yield</span>
                    <div className="text-xl font-black text-oasis-cyan italic tracking-tighter">+{totals.xp} XP</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest block mb-1">Net Credits</span>
                    <div className={`text-xl font-black italic tracking-tighter ${totals.cr >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {totals.cr >= 0 ? '+' : ''}{totals.cr} CR
                    </div>
                </div>
            </div>

            {/* Performance Status */}
            <div className={`p-4 rounded-3xl border flex items-center justify-between ${goalMet ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                <div className="flex items-center gap-3">
                    {goalMet ? <Trophy size={20}/> : <AlertCircle size={20}/>}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Sync {goalMet ? 'OPTIMIZED' : 'PARTIAL'}
                    </span>
                </div>
                <span className="text-[8px] font-mono opacity-60">AUDIT_ID: {date.getTime().toString(16)}</span>
            </div>

            {/* Detailed Tactical Log */}
            <div className="space-y-3">
                <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] px-1 flex items-center gap-2">
                    <Target size={10} className="text-oasis-cyan"/> Tactical De-brief
                </h3>
                {historyForDate.length === 0 ? (
                    <div className="p-8 text-center text-gray-700 italic text-[10px] bg-black/20 rounded-2xl border border-white/5">
                        No significant neural activity logged for this cycle.
                    </div>
                ) : (
                    historyForDate.map(log => (
                        <div key={log.id} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                            <div className="flex-1">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-1">{log.description}</h4>
                                <div className="flex items-center gap-3 opacity-60">
                                    <span className="text-[8px] font-mono text-oasis-cyan">+{log.xpEarned} XP</span>
                                    {log.creditsEarned !== 0 && (
                                        <span className={`text-[8px] font-mono ${log.creditsEarned! > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {log.creditsEarned! > 0 ? '+' : ''}{log.creditsEarned} CR
                                        </span>
                                    )}
                                    {log.itemsFound && log.itemsFound.length > 0 && (
                                        <span className="text-[8px] font-mono text-magenta-400 flex items-center gap-1">
                                            <Package size={8}/> {log.itemsFound.length} items
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="text-[7px] text-gray-600 font-mono italic">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Missed Opportunities (Simulated/expired) */}
            {!goalMet && (
                <div className="space-y-3 pt-2">
                    <h3 className="text-[9px] font-black text-red-500/50 uppercase tracking-[0.4em] px-1 flex items-center gap-2">
                        <AlertCircle size={10}/> Missed Signals (EXPIRED)
                    </h3>
                    <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl opacity-40 grayscale space-y-3">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-500">
                             <span>Sector Bounty: Neon Arena</span>
                             <span className="font-mono text-red-400/50 line-through">+150 CR</span>
                         </div>
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-500">
                             <span>Neural Mixology Shift</span>
                             <span className="font-mono text-red-400/50 line-through">+120 XP</span>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const OpportunityItem = ({ icon, title, reward, color, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white/[0.03] border border-white/5 hover:border-oasis-cyan/40 p-4 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:bg-white/[0.06] shadow-sm">
     <div className="flex items-center gap-4">
        <div className={`${color} bg-black/50 p-2.5 rounded-xl border border-white/5 shadow-md group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className="text-left">
           <h5 className="text-[11px] font-black uppercase tracking-tight text-white group-hover:text-oasis-cyan transition-colors">{title}</h5>
           <p className={`text-[8px] font-mono font-black mt-0.5 ${color}`}>{reward}</p>
        </div>
     </div>
     <ArrowUpRight size={14} className="text-gray-700 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </button>
);

const SectorButton = ({ zone, icon, sub, color, onClick, isLocked, imageUrl, onSubscribe, compact }: any) => {
  const themes: any = {
    magenta: 'from-magenta-500/90 to-indigo-950 border-magenta-400/50',
    cyan: 'from-cyan-500/90 to-blue-950 border-cyan-400/50',
    orange: 'from-orange-500/90 to-red-950 border-orange-400/50',
    indigo: 'from-indigo-500/90 to-purple-950 border-indigo-400/50'
  };
  
  return (
    <button 
      onClick={() => onClick(zone)} 
      className={`group relative w-full rounded-[1.8rem] overflow-hidden border transition-all active:scale-[0.98] shadow-lg flex flex-col justify-end ${isLocked ? 'grayscale-[0.5] border-white/10' : themes[color]} ${compact ? 'h-32' : 'h-48'}`}
    >
       <img src={imageUrl} alt={zone} className={`absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110`} />
       <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 flex flex-col justify-end text-left z-10`}>
          <div className={`rounded-xl bg-white/20 backdrop-blur-xl w-fit mb-2 border border-white/30 flex items-center justify-center ${compact ? 'p-1.5 mb-1.5' : 'p-2.5'}`}>
            {icon}
          </div>
          <div className="w-full">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className={`${compact ? 'text-[11px]' : 'text-lg'} font-black uppercase tracking-tighter italic text-white drop-shadow-[0_2px_4px_black] line-clamp-1`}>
                {zone}
              </h4>
              {isLocked && <Lock size={compact ? 10 : 14} className="text-yellow-400 shadow-sm" />}
            </div>
            <p className={`${compact ? 'text-[7px]' : 'text-[9px]'} font-black uppercase tracking-widest text-white/80 line-clamp-1 drop-shadow-[0_1px_2px_black]`}>
              {sub}
            </p>
          </div>
       </div>
       {isLocked && (
         <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-oasis-cyan text-black px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-2xl flex items-center gap-2">
               <Ticket size={12}/> GET ACCESS
            </div>
         </div>
       )}
    </button>
  );
};

const AppTile = ({ onClick, icon, label, sub, color, bgColor, border }: any) => (
  <button onClick={onClick} className={`${bgColor} ${border} border p-3 rounded-[1.2rem] flex items-center gap-3 text-left hover:brightness-110 active:scale-[0.98] transition-all shadow-md group overflow-hidden h-14`}>
     <div className={`${color} bg-black/40 p-1.5 rounded-lg border border-white/10 flex items-center justify-center`}>{icon}</div>
     <div className="flex flex-col">
       <div className="text-[10px] font-black uppercase tracking-widest text-white leading-tight mb-0.5">{label}</div>
       <div className="text-[7px] text-gray-500 font-mono uppercase leading-none">{sub}</div>
     </div>
  </button>
);

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-oasis-cyan' : 'text-gray-500 hover:text-white'}`}>
    <div className={`${active ? 'bg-oasis-cyan/10 p-1.5 rounded-xl border border-oasis-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]' : ''}`}>
      {icon}
    </div>
    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default Hub;
