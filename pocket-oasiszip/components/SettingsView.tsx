
import React, { useState, useEffect } from 'react';
import { UserProfile, SystemPreferences } from '../types';
import { ArrowLeft, Save, LogOut, Bell, Smartphone, PenTool, Settings as SettingsIcon, Globe, Ruler, Sparkles, Check, MapPin, Shield, CheckCircle2, Target, Clock, Ghost, PlayCircle, AlertCircle, X } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onSave: (u: UserProfile) => void;
  onBack: () => void;
  onUpdateUsername: (newName: string) => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onSave, onBack, onUpdateUsername, onLogout }) => {
  const [formData, setFormData] = useState({
    height: user.height || 175,
    weight: user.weight || 70,
    idealWeight: user.idealWeight || 65,
    biologicalSex: user.biologicalSex || 'NB',
    stepGoal: user.stepGoal || 10000,
    dailyXPGoal: user.dailyXPGoal || 100,
    isSubscriber: user.isSubscriber || false,
    trialEndsAt: user.trialEndsAt,
    preferences: user.preferences || {
      unitSystem: 'Metric',
      timeFormat: '24h',
      notifications: true,
      haptics: true,
      stealth: false,
      animations: true,
      locationSync: false
    }
  });

  const [newName, setNewName] = useState(user.avatar.name);
  const [isChangingName, setIsChangingName] = useState(false);
  const [showSavedDialogue, setShowSavedDialogue] = useState(false);

  const handleSave = () => {
    onSave({
      ...user,
      ...formData
    });
    setShowSavedDialogue(true);
  };

  const handleUpdateNameSubmit = () => {
    if (newName.trim() && newName !== user.avatar.name && user.credits >= 500) {
      onUpdateUsername(newName);
      setIsChangingName(false);
    }
  };

  const toggleUnitSystem = () => {
    const isMetric = formData.preferences.unitSystem === 'Metric';
    const nextSystem = isMetric ? 'Imperial' : 'Metric';
    
    let nextHeight = formData.height;
    let nextWeight = formData.weight;
    let nextIdeal = formData.idealWeight;

    if (nextSystem === 'Imperial') {
      nextHeight = Math.round(formData.height / 2.54);
      nextWeight = Math.round(formData.weight * 2.20462);
      nextIdeal = Math.round(formData.idealWeight * 2.20462);
    } else {
      nextHeight = Math.round(formData.height * 2.54);
      nextWeight = Math.round(formData.weight / 2.20462);
      nextIdeal = Math.round(formData.idealWeight / 2.20462);
    }

    setFormData(prev => ({
      ...prev,
      height: nextHeight,
      weight: nextWeight,
      idealWeight: nextIdeal,
      preferences: { ...prev.preferences, unitSystem: nextSystem }
    }));
  };

  const handleUpdatePreference = (key: keyof SystemPreferences, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const isMetric = formData.preferences.unitSystem === 'Metric';
  const isTrialActive = formData.trialEndsAt && formData.trialEndsAt > Date.now();
  const daysRemaining = formData.trialEndsAt ? Math.ceil((formData.trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className={`h-full w-full bg-[#0c0c14] text-white flex flex-col overflow-hidden relative`}>
      <header className="shrink-0 p-5 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-3xl z-10 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl active:scale-90 transition-all"><ArrowLeft size={22} /></button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Bio-Sync Hub</h1>
        </div>
        <button 
          onClick={handleSave} 
          className="bg-oasis-cyan text-black px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-[0_5px_20px_rgba(0,243,255,0.3)] active:scale-95 transition-all"
        >
          <Save size={14}/> SYNC
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-32 no-scrollbar relative">
        {/* Profile Card */}
        <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 flex items-center gap-5">
           <div className={`w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-black shadow-[0_0_15px_rgba(99,102,241,0.3)]`}>
              {user.avatar.name.charAt(0)}
           </div>
           <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {isChangingName ? (
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                         <input 
                           type="text" 
                           value={newName} 
                           onChange={(e) => setNewName(e.target.value)}
                           className="bg-black/60 border border-oasis-cyan/50 text-white rounded-lg px-3 py-1.5 text-sm font-black italic outline-none w-full"
                           autoFocus
                           maxLength={10}
                         />
                         <button onClick={handleUpdateNameSubmit} className="p-2 bg-oasis-cyan text-black rounded-lg active:scale-90"><Check size={14}/></button>
                         <button onClick={() => { setIsChangingName(false); setNewName(user.avatar.name); }} className="p-2 bg-red-500/20 text-red-500 rounded-lg active:scale-90"><X size={14}/></button>
                       </div>
                       <p className="text-[7px] text-yellow-500 font-mono uppercase tracking-widest flex items-center gap-1">
                          <AlertCircle size={8}/> Cost: 500 CR | 10 Chars Max
                       </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-black tracking-tight uppercase italic truncate max-w-[200px] pr-1">{user.avatar.name}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className={`text-[9px] font-mono font-black uppercase tracking-widest ${(formData.isSubscriber || isTrialActive) ? 'text-yellow-500' : 'text-oasis-cyan'}`}>
                          {formData.isSubscriber ? 'PRIME LINKED' : isTrialActive ? `PRIME TRIAL (${daysRemaining}d)` : 'GUEST ACCESS'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {!isChangingName && (
                  <button onClick={() => setIsChangingName(true)} className="p-2 bg-white/5 rounded-lg text-oasis-cyan hover:bg-oasis-cyan hover:text-black transition-all">
                    <PenTool size={14}/>
                  </button>
                )}
              </div>
           </div>
        </div>

        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
             <Ruler size={14} className="text-oasis-cyan"/> Physical Scan
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <BioInput label="Height" suffix={isMetric ? 'cm' : 'in'} value={formData.height} onChange={(v) => setFormData({...formData, height: v})} />
              <BioInput label="Weight" suffix={isMetric ? 'kg' : 'lb'} value={formData.weight} onChange={(v) => setFormData({...formData, weight: v})} />
              <BioInput label="Ideal W." suffix={isMetric ? 'kg' : 'lb'} value={formData.idealWeight} onChange={(v) => setFormData({...formData, idealWeight: v})} />
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                 <div className="text-[8px] text-gray-500 font-black uppercase mb-2">Biological Sex</div>
                 <select 
                    value={formData.biologicalSex} 
                    onChange={(e) => setFormData({...formData, biologicalSex: e.target.value as any})}
                    className="w-full bg-transparent text-lg font-black text-white outline-none appearance-none"
                 >
                    <option value="M" className="bg-gray-900">Male</option>
                    <option value="F" className="bg-gray-900">Female</option>
                    <option value="NB" className="bg-gray-900">Non-Binary</option>
                    <option value="U" className="bg-gray-900">Undisclosed</option>
                 </select>
              </div>
           </div>
        </section>

        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2 px-1">
             <Target size={14} className="text-yellow-500"/> Goal Sync
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <BioInput label="Step Goal" suffix="Steps" value={formData.stepGoal} onChange={(v) => setFormData({...formData, stepGoal: v})} />
              <BioInput label="Daily XP" suffix="XP" value={formData.dailyXPGoal} onChange={(v) => setFormData({...formData, dailyXPGoal: v})} />
           </div>
        </section>

        <section className="space-y-3">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
             <SettingsIcon size={14} className="text-indigo-400"/> Preferences
           </h3>
           <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-oasis-cyan" />
                  <span className="text-[11px] font-black uppercase tracking-tight">Units System</span>
                </div>
                <button 
                  onClick={toggleUnitSystem}
                  className="bg-white/10 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border border-white/5 text-oasis-cyan"
                >
                  {formData.preferences.unitSystem}
                </button>
              </div>
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-oasis-cyan" />
                  <span className="text-[11px] font-black uppercase tracking-tight">Time Format</span>
                </div>
                <button 
                  onClick={() => handleUpdatePreference('timeFormat', formData.preferences.timeFormat === '12h' ? '24h' : '12h')}
                  className="bg-white/10 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border border-white/5 text-oasis-cyan"
                >
                  {formData.preferences.timeFormat === '12h' ? 'STANDARD' : 'MILITARY'}
                </button>
              </div>
              <PreferenceToggle 
                icon={<Bell size={16}/>} 
                label="Neural Notifications" 
                active={formData.preferences.notifications} 
                onToggle={() => handleUpdatePreference('notifications', !formData.preferences.notifications)} 
              />
              <PreferenceToggle 
                icon={<Smartphone size={16}/>} 
                label="Haptic Feedback" 
                active={formData.preferences.haptics} 
                onToggle={() => handleUpdatePreference('haptics', !formData.preferences.haptics)} 
              />
              <PreferenceToggle 
                icon={<Ghost size={16}/>} 
                label="Stealth Protocol" 
                active={formData.preferences.stealth} 
                onToggle={() => handleUpdatePreference('stealth', !formData.preferences.stealth)} 
              />
              <PreferenceToggle 
                icon={<PlayCircle size={16}/>} 
                label="Fluid UI Animations" 
                active={formData.preferences.animations} 
                onToggle={() => handleUpdatePreference('animations', !formData.preferences.animations)} 
              />
              <PreferenceToggle 
                icon={<MapPin size={16}/>} 
                label="Verified GPS Sync" 
                active={formData.preferences.locationSync} 
                onToggle={() => handleUpdatePreference('locationSync', !formData.preferences.locationSync)} 
              />
           </div>
        </section>

        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
             <Sparkles size={14} className="text-yellow-500"/> OASIS Prime
           </h3>
           <div className={`p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden ${(formData.isSubscriber || isTrialActive) ? 'bg-yellow-500/5 border-yellow-500/40 shadow-xl' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">PRIME UPLINK</h4>
                    <p className="text-gray-500 text-[8px] uppercase font-black tracking-widest mt-1">Unified Premium Access</p>
                 </div>
                 {formData.isSubscriber ? <Check className="text-yellow-400" size={24}/> : <div className="text-sm font-black text-white">9.99 CR</div>}
              </div>
              <button 
                onClick={() => setFormData({...formData, isSubscriber: !formData.isSubscriber})} 
                className={`w-full py-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${formData.isSubscriber ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-yellow-500 text-black shadow-lg shadow-yellow-600/20'}`}
              >
                {formData.isSubscriber ? 'TERMINATE LINK' : 'ESTABLISH PRIME'}
              </button>
           </div>
        </section>

        <button onClick={onLogout} className="w-full py-5 bg-red-900/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:bg-red-900/20 transition-all">
           <LogOut size={16}/> DOWNLOAD & DISCONNECT
        </button>
      </div>

      {/* Sync Success Dialogue */}
      {showSavedDialogue && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSavedDialogue(false)} />
           <div className="relative bg-[#12121a] border border-white/20 rounded-[2.5rem] p-10 max-w-xs w-full text-center shadow-[0_20px_80px_rgba(0,243,255,0.2)]">
              <div className="w-20 h-20 mx-auto bg-oasis-cyan/10 rounded-full flex items-center justify-center mb-6 border border-oasis-cyan/30">
                 <CheckCircle2 size={40} className="text-oasis-cyan animate-in zoom-in duration-500" />
              </div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Sync Verified</h2>
              <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-8 leading-relaxed">
                 Neural profile updated. Changes have been committed to the OASIS core.
              </p>
              <button 
                onClick={() => setShowSavedDialogue(false)}
                className="w-full bg-oasis-cyan text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-oasis-cyan/20 active:scale-95 transition-all"
              >
                 ACKNOWLEDGE
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const PreferenceToggle = ({ icon, label, active, onToggle }: { icon: any, label: string, active: boolean, onToggle: () => void }) => (
  <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`text-gray-400 ${active ? 'text-oasis-cyan' : ''}`}>{icon}</div>
      <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
    </div>
    <button onClick={onToggle} className={`w-10 h-5 rounded-full p-1 transition-colors ${active ? 'bg-oasis-cyan' : 'bg-white/10'}`}>
       <div className={`w-3 h-3 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const BioInput = ({ label, suffix, value, onChange }: { label: string, suffix: string, value: any, onChange: (v: number) => void }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
     <div className="text-[8px] text-gray-500 font-black uppercase mb-2 tracking-widest">{label} ({suffix})</div>
     <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full bg-transparent text-lg font-black text-white outline-none focus:text-oasis-cyan transition-colors"
     />
  </div>
);

export default SettingsView;
