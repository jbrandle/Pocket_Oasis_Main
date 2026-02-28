
import React, { useState, useEffect, useRef } from 'react';
import { Play, DollarSign, XCircle, Briefcase, Cpu, Truck, Clock, Zap, ArrowUpCircle, ShieldCheck, AlertCircle, Lock, Wallet, Thermometer, Database, Atom, Star } from 'lucide-react';
import { UserProfile, MiningStats, DroneMission } from '../types';

interface JobMinigameProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onExit: () => void;
  onLogActivity: (desc: string, xp: number) => void;
}

type JobTab = 'MENU' | 'BARTENDER' | 'MINER' | 'DRONE';

const JobMinigame: React.FC<JobMinigameProps> = ({ user, onUpdateUser, onExit, onLogActivity }) => {
  const [activeTab, setActiveTab] = useState<JobTab>('MENU');

  const renderMenu = () => (
    <div className="grid grid-cols-1 gap-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => setActiveTab('BARTENDER')}
        className="bg-gray-800/40 backdrop-blur hover:bg-yellow-900/10 border border-yellow-600/30 rounded-2xl p-6 flex items-center gap-4 group transition-all"
      >
        <div className="bg-yellow-600 p-4 rounded-xl text-black group-hover:scale-110 transition-transform"><DollarSign size={24} /></div>
        <div className="text-left">
          <h3 className="font-bold text-lg text-yellow-500 uppercase tracking-tighter">Mixology Lab</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Active Work • Skill Based</p>
        </div>
      </button>

      <button 
        onClick={() => setActiveTab('MINER')}
        className="bg-gray-800/40 backdrop-blur hover:bg-blue-900/10 border border-blue-600/30 rounded-2xl p-6 flex items-center gap-4 group transition-all"
      >
        <div className="bg-blue-600 p-4 rounded-xl text-black group-hover:scale-110 transition-transform"><Cpu size={24} /></div>
        <div className="text-left">
          <h3 className="font-bold text-lg text-blue-500 uppercase tracking-tighter">Server Cluster</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Passive Income • Hard-Mode Idle</p>
        </div>
      </button>

      <button 
        onClick={() => setActiveTab('DRONE')}
        className="bg-gray-800/40 backdrop-blur hover:bg-green-900/10 border border-green-600/30 rounded-2xl p-6 flex items-center gap-4 group transition-all"
      >
        <div className="bg-green-600 p-4 rounded-xl text-black group-hover:scale-110 transition-transform"><Truck size={24} /></div>
        <div className="text-left">
          <h3 className="font-bold text-lg text-green-500 uppercase tracking-tighter">Drone Relay</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Time Missions • Auto</p>
        </div>
      </button>
    </div>
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#050508] text-white overflow-hidden">
      

      <div className="relative z-10 p-5 bg-black/80 backdrop-blur-2xl border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-oasis-cyan/10 rounded-lg text-oasis-cyan"><Briefcase size={20} /></div>
            <div className="flex flex-col">
                <span className="font-black italic text-sm tracking-tighter uppercase leading-none">GIG_NEXUS</span>
                <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Access Point: {activeTab}</span>
            </div>
        </div>
        <button onClick={onExit} className="p-2.5 hover:bg-white/5 rounded-full transition-colors text-gray-500"><XCircle size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        {activeTab === 'MENU' && renderMenu()}
        {activeTab === 'BARTENDER' && (
            <BartenderGame 
                onComplete={(amount) => {
                    onUpdateUser({ ...user, credits: user.credits + amount });
                    onLogActivity('Bartending Shift', 10);
                    setActiveTab('MENU');
                }} 
                onBack={() => setActiveTab('MENU')} 
            />
        )}
        {activeTab === 'MINER' && (
            <CryptoMiner 
                user={user} 
                onUpdate={onUpdateUser} 
                onLogActivity={onLogActivity}
                onBack={() => setActiveTab('MENU')}
            />
        )}
        {activeTab === 'DRONE' && (
            <DroneLogistics 
                user={user} 
                onUpdate={onUpdateUser} 
                onLogActivity={onLogActivity}
                onBack={() => setActiveTab('MENU')}
            />
        )}
      </div>
    </div>
  );
};

// --- Sub-Game: Bartender (Active) ---
const BartenderGame: React.FC<{ onComplete: (s: number) => void, onBack: () => void }> = ({ onComplete, onBack }) => {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const requestRef = useRef<number>(0);

  const TARGET_START = 40, TARGET_END = 60;
  const SPEED = 2.0; 
  const MAX_ATTEMPTS = 5;

  const animate = () => {
    setPosition(prev => {
      let next = prev + (SPEED * direction);
      if (next > 100 || next < 0) {
        setDirection(d => d * -1);
        next = prev;
      }
      return next;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (playing) requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [playing, direction]);

  const handleAction = () => {
    if (!playing) { setPlaying(true); return; }
    setPlaying(false);
    setAttempts(a => a + 1);

    if (position >= TARGET_START && position <= TARGET_END) {
      setScore(s => s + 25);
      setFeedback('PERFECT! +25 CR');
    } else {
      setFeedback('MISS! 0 CR');
    }

    setTimeout(() => {
      if (attempts + 1 >= MAX_ATTEMPTS) {
        onComplete(score + (position >= TARGET_START && position <= TARGET_END ? 25 : 0));
      } else {
        setPlaying(true);
        setFeedback('');
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center animate-in zoom-in duration-300">
      <div className="w-full bg-white/[0.02] border border-yellow-600/30 rounded-[2rem] p-8 shadow-2xl relative backdrop-blur-3xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full" />
        <h2 className="text-xl font-black italic text-yellow-500 mb-8 uppercase flex items-center gap-2"><DollarSign size={20}/> Neural Tap</h2>
        <div className="relative h-14 bg-black/60 rounded-2xl mb-10 overflow-hidden border border-white/5">
          <div className="absolute top-0 bottom-0 bg-yellow-500/20 border-x border-yellow-500/50" style={{ left: `${TARGET_START}%`, width: `${TARGET_END - TARGET_START}%` }} />
          <div className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_15px_white]" style={{ left: `${position}%` }} />
        </div>
        <div className="text-center h-8 mb-6 font-mono font-black text-yellow-400 text-sm tracking-widest">{feedback}</div>
        <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Protocol Attempt</span>
                <span className="text-xl font-black text-white">{attempts} / {MAX_ATTEMPTS}</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Tip Yield</span>
                <span className="text-xl font-black text-yellow-500">{score} CR</span>
            </div>
        </div>
        <button onClick={handleAction} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 ${playing ? 'bg-red-600' : 'bg-yellow-600 text-black'}`}>
          {playing ? 'HALT_MIX' : attempts >= MAX_ATTEMPTS ? 'UPLINK_DATA' : 'INITIALIZE'}
        </button>
      </div>
    </div>
  );
};

// --- Sub-Game: Crypto Miner (Idle Hard-Mode) ---
const CryptoMiner: React.FC<{ user: UserProfile, onUpdate: (u: UserProfile) => void, onLogActivity: any, onBack: () => void }> = ({ user, onUpdate, onLogActivity, onBack }) => {
  const stats = user.miningStats || { level: 1, lastCollected: Date.now(), lastUpgradeTime: 0 };
  const ratePerSec = stats.level * 0.2;
  const [pending, setPending] = useState(0);
  const [nextUpgradeCountdown, setNextUpgradeCountdown] = useState('');

  const COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const canUpgradeTime = (stats.lastUpgradeTime || 0) + COOLDOWN_MS;
  const isCooldownActive = Date.now() < canUpgradeTime;

  const AVAILABLE_UPGRADES = [
    { name: 'Thermal Paste', boost: 1, cost: 500, icon: <Thermometer size={16}/>, desc: 'Better cooling allows minor CPU overclock.', premium: false },
    { name: 'Storage Array', boost: 5, cost: 2500, icon: <Database size={16}/>, desc: 'Increases parallel node processing efficiency.', premium: false },
    { name: 'GPU Cluster', boost: 15, cost: 12000, icon: <Zap size={16}/>, desc: 'Industrial grade mining rigs.', premium: true },
    { name: 'Quantum Core', boost: 50, cost: 45000, icon: <Atom size={16}/>, desc: 'Entangled processing for maximum yield.', premium: true },
  ];

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const diffSec = (now - stats.lastCollected) / 1000;
      setPending(Math.floor(diffSec * ratePerSec));

      if (isCooldownActive) {
        const remaining = canUpgradeTime - now;
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setNextUpgradeCountdown(`${h}h ${m}m ${s}s`);
      } else {
        setNextUpgradeCountdown('READY');
      }
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [stats, isCooldownActive]);

  const handleCollect = () => {
    onUpdate({
      ...user,
      credits: user.credits + pending,
      miningStats: { ...stats, lastCollected: Date.now() }
    });
    setPending(0);
    onLogActivity(`Collected ${pending} CR from Farm`, 5);
  };

  const handleUpgrade = (boost: number, cost: number, isPremium: boolean) => {
    if (isPremium && !user.isSubscriber) return;
    if (user.credits >= cost && !isCooldownActive) {
      onUpdate({
        ...user,
        credits: user.credits - cost,
        miningStats: { 
          ...stats, 
          level: stats.level + boost, 
          lastUpgradeTime: Date.now(),
          lastCollected: Date.now() 
        }
      });
      onLogActivity(`Purchased Cluster Hardware (+${boost} Lvl)`, 50);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/[0.02] border border-blue-900/30 rounded-[2.5rem] p-6 relative overflow-hidden backdrop-blur-3xl animate-in zoom-in duration-300">
      
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20"><Cpu size={24}/></div>
             <div>
                <h2 className="text-lg font-black italic tracking-tighter uppercase text-white leading-none mb-1">Neural Cluster</h2>
                <div className="flex items-center gap-1.5">
                    <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Active Level {stats.level}</span>
                    {isCooldownActive && <span className="text-[7px] text-red-500 font-mono font-black uppercase">Lock: {nextUpgradeCountdown}</span>}
                </div>
             </div>
          </div>
          <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Wallet size={12} className="text-oasis-cyan" />
            <span className="text-[10px] font-mono font-black text-white">{user.credits.toLocaleString()} <span className="text-[8px] opacity-40">CR</span></span>
          </div>
        </div>

        {/* Claim Section */}
        <div className="text-center mb-6 bg-blue-500/[0.03] border border-blue-500/10 p-6 rounded-[2rem] shadow-inner">
            <div className="text-[8px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">Unclaimed Revenue</div>
            <div className="text-4xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                {pending} <span className="text-[10px] font-mono text-gray-600 tracking-normal">CR</span>
            </div>
            <button 
                onClick={handleCollect}
                disabled={pending < 1}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-700 text-black font-black py-3 rounded-xl transition-all active:scale-95 uppercase text-[10px] tracking-widest"
            >
                Extract
            </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
            <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Hardware Catalog</h3>
                <span className="text-[8px] text-blue-400 font-mono uppercase">Sync Rate: {(ratePerSec * 60).toFixed(1)}/min</span>
            </div>
            
            {AVAILABLE_UPGRADES.map((u, i) => {
                const locked = (u.premium && !user.isSubscriber) || isCooldownActive || user.credits < u.cost;
                return (
                    <div 
                        key={i} 
                        className={`p-4 rounded-2xl border transition-all relative ${locked ? 'bg-white/[0.01] border-white/5' : 'bg-white/[0.04] border-white/10 hover:border-blue-500/50 cursor-pointer active:scale-[0.98]'}`}
                        onClick={() => !locked && handleUpgrade(u.boost, u.cost, u.premium)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${u.premium ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'}`}>{u.icon}</div>
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-tight text-white flex items-center gap-2">
                                        {u.name}
                                        {u.premium && <Star size={10} fill="currentColor" className="text-yellow-500"/>}
                                    </h4>
                                    <p className="text-[8px] text-gray-500 leading-none mt-1">Boost: +{u.boost} Node Levels</p>
                                </div>
                            </div>
                            <div className={`text-[10px] font-mono font-black ${user.credits < u.cost ? 'text-red-500' : 'text-blue-400'}`}>{u.cost.toLocaleString()} CR</div>
                        </div>
                        <p className="text-[9px] text-gray-600 italic leading-tight">"{u.desc}"</p>
                        
                        {(u.premium && !user.isSubscriber) && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center gap-2 text-yellow-500">
                                <Lock size={14}/>
                                <span className="text-[9px] font-black uppercase tracking-widest">Prime Req.</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        <div className="mt-4 flex items-center gap-2 justify-center text-[7px] text-gray-600 font-black uppercase tracking-widest opacity-60">
            <ShieldCheck size={10}/> Neural Safety: 1 Hardware Load per 24h
        </div>
      </div>
    </div>
  );
};

// --- Sub-Game: Drone Logistics ---
const DroneLogistics: React.FC<{ user: UserProfile, onUpdate: (u: UserProfile) => void, onLogActivity: any, onBack: () => void }> = ({ user, onUpdate, onLogActivity, onBack }) => {
  const active = user.activeMission;
  const [timeLeft, setTimeLeft] = useState<string>('--:--');
  const [isDone, setIsDone] = useState(false);

  const MISSIONS = [
    { id: 'm1', name: 'Local Drop', duration: 1 * 60 * 1000, reward: 50, desc: 'Quick delivery to Medieval Zone.' },
    { id: 'm2', name: 'Sector Haul', duration: 10 * 60 * 1000, reward: 250, desc: 'Transport supplies to FPS Arena.' },
    { id: 'm3', name: 'Smuggling Run', duration: 60 * 60 * 1000, reward: 1000, desc: 'High risk data courier job.' },
  ];

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const remaining = active.endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft('00:00');
        setIsDone(true);
        clearInterval(interval);
      } else {
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const startMission = (m: any) => {
    onUpdate({
      ...user,
      activeMission: {
        id: m.id,
        name: m.name,
        duration: m.duration,
        endTime: Date.now() + m.duration,
        reward: m.reward,
        description: m.desc
      }
    });
  };

  const claimMission = () => {
    if (!active) return;
    onUpdate({
      ...user,
      credits: user.credits + active.reward,
      activeMission: null
    });
    onLogActivity(`Drone Mission: ${active.name}`, 20);
  };

  return (
    <div className="w-full max-w-md bg-white/[0.02] border border-green-900/30 rounded-[2.5rem] p-8 relative backdrop-blur-3xl animate-in zoom-in duration-300 overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-green-500/5 blur-3xl rounded-full" />
      <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600/20 text-green-400 rounded-2xl border border-green-500/20"><Truck size={28}/></div>
              <div className="flex flex-col">
                 <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">Relay Command</h2>
                 <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Protocol: Autonomous Supply</span>
              </div>
          </div>
          <button onClick={onBack} className="p-2 text-gray-600 hover:text-white transition-colors"><XCircle size={20}/></button>
      </div>

      {active ? (
        <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto bg-green-900/10 rounded-full flex items-center justify-center mb-8 relative border border-white/5">
                <Truck className={`w-12 h-12 text-green-500 ${!isDone ? 'animate-bounce' : ''}`} />
                {!isDone && <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>}
            </div>
            <h3 className="text-2xl font-black text-white mb-2 italic tracking-tighter uppercase">{active.name}</h3>
            <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest font-medium">"{active.description}"</p>
            <div className="text-6xl font-mono font-black text-white italic tracking-tighter mb-12 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">{timeLeft}</div>
            {isDone ? (
                <button onClick={claimMission} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl animate-pulse shadow-[0_15px_30px_rgba(34,197,94,0.3)] uppercase text-xs tracking-widest transition-transform active:scale-95">
                    Claim Revenue ({active.reward} CR)
                </button>
            ) : (
                <button disabled className="w-full bg-white/5 text-gray-600 font-black py-5 rounded-2xl cursor-not-allowed uppercase text-[10px] tracking-[0.2em] border border-white/5">
                    Drone in Transit...
                </button>
            )}
        </div>
      ) : (
        <div className="space-y-4">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-4">Available Supply Routes:</p>
            {MISSIONS.map(m => (
                <div key={m.id} className="bg-black/40 p-5 rounded-3xl border border-white/5 hover:border-green-500/50 transition-all flex justify-between items-center group cursor-pointer shadow-inner" onClick={() => startMission(m)}>
                    <div className="flex-1">
                        <h4 className="font-black text-white uppercase tracking-tighter group-hover:text-green-400 transition-colors mb-1">{m.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium italic mb-3 line-clamp-1">{m.desc}</p>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1 text-[10px] font-mono font-black text-blue-400/80"><Clock size={12}/> {m.duration / 60000}m</span>
                            <span className="flex items-center gap-1 text-[10px] font-mono font-black text-yellow-500/80"><Zap size={12}/> {m.reward} CR</span>
                        </div>
                    </div>
                    <button className="bg-white/5 group-hover:bg-green-600 group-hover:text-black text-green-500 p-3 rounded-2xl transition-all border border-white/5 group-hover:border-green-500 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        <Zap size={20} fill="currentColor" />
                    </button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default JobMinigame;
