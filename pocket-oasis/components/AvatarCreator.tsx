
import React, { useState } from 'react';
import { UserProfile, AvatarConfig, AppState } from '../types';
import { Shield, Zap, User, ChevronRight } from 'lucide-react';

interface AvatarCreatorProps {
  onComplete: (profile: UserProfile) => void;
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [outfit, setOutfit] = useState('Casual Runner');

  const handleCreate = () => {
    if (!name.trim()) return;
    
    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      avatar: {
        name,
        style: 'stylized',
        hairColor: '#00f3ff',
        outfit,
        cybernetics: 0
      },
      credits: 250,
      level: 1,
      completedQuests: 0,
      inventory: ['outfit_casual', 'hair_cyan'], 
      isSubscriber: false,
      lastLoginDate: new Date().toISOString().split('T')[0],
      dailyStreak: 0,
      dailyXPGoal: 100,
      stepGoal: 10000,
      currentSteps: 0,
      history: [],
      notifications: [],
      calendarEvents: [],
      miningStats: {
        level: 1,
        lastCollected: Date.now()
      },
      activeMission: null,
      preferences: {
        notifications: true,
        haptics: true,
        stealth: false,
        animations: true,
        unitSystem: 'Metric',
        timeFormat: '24h',
        locationSync: false
      }
    };
    onComplete(newProfile);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <img src="https://picsum.photos/id/169/800/1200?grayscale" className="w-full h-full object-cover blur-sm" alt="Oasis background" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      
      <div className="z-10 w-full max-w-sm bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-oasis-cyan/10 blur-[80px] rounded-full animate-pulse" />
        
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-oasis-cyan to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.3)]">
            <User size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">
            POCKET_OASIS
          </h1>
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.3em]">Identity Link Initializing</p>
        </header>

        <div className="space-y-8">
          <div>
            <label className="block text-[8px] font-black text-oasis-cyan uppercase tracking-[0.3em] mb-3">User Identifier</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-oasis-cyan focus:bg-white/[0.06] outline-none transition-all font-bold placeholder:text-gray-700"
              placeholder="Enter Ghost Name..."
              maxLength={15}
            />
          </div>

          <div>
            <label className="block text-[8px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-3">Starting Loadout</label>
            <div className="grid grid-cols-1 gap-2">
              {['Casual Runner', 'Neon Samurai', 'Retro Pilot'].map((o) => (
                <button 
                  key={o}
                  onClick={() => setOutfit(o)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    outfit === o 
                      ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">{o}</span>
                  {outfit === o && <Zap size={14} className="fill-current" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-oasis-cyan/5 border border-oasis-cyan/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3 text-oasis-cyan">
              <Shield size={16} />
              <p className="text-[9px] font-medium leading-relaxed opacity-80">
                Genetic sync and neural style preferences can be modified post-uplink in the <span className="font-black text-white">BIO-SYNC</span> terminal.
              </p>
            </div>
          </div>

          <button 
            onClick={handleCreate}
            disabled={!name.trim()}
            className="group w-full bg-oasis-cyan hover:bg-white text-black font-black py-5 rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
          >
            JACK IN <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;
