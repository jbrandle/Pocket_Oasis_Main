
import React, { useState } from 'react';
import { ArrowLeft, BookOpen, User, Zap, Map, Briefcase, Gamepad2, Brain, Sparkles, ChevronRight, Shield, Cpu, Target, HeartPulse, Terminal, Activity } from 'lucide-react';

interface GuideViewProps {
  onBack: () => void;
}

type Chapter = 'WELCOME' | 'IDENTITY' | 'ECONOMY' | 'EXPLORATION' | 'ARCADE' | 'SYNC';

const GuideView: React.FC<GuideViewProps> = ({ onBack }) => {
  const [activeChapter, setActiveChapter] = useState<Chapter>('WELCOME');

  const chapters: { id: Chapter; label: string; icon: any; color: string }[] = [
    { id: 'WELCOME', label: 'Concept', icon: <Sparkles size={18}/>, color: 'text-oasis-cyan' },
    { id: 'IDENTITY', label: 'Identity', icon: <User size={18}/>, color: 'text-magenta-400' },
    { id: 'EXPLORATION', label: 'Sectors', icon: <Map size={18}/>, color: 'text-blue-400' },
    { id: 'ECONOMY', label: 'Economy', icon: <Briefcase size={18}/>, color: 'text-yellow-500' },
    { id: 'ARCADE', label: 'Arcade', icon: <Gamepad2 size={18}/>, color: 'text-orange-500' },
    { id: 'SYNC', label: 'Sync', icon: <Brain size={18}/>, color: 'text-indigo-400' },
  ];

  const renderContent = () => {
    switch (activeChapter) {
      case 'WELCOME':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-oasis-cyan/5 border border-oasis-cyan/20 p-6 rounded-[2rem]">
              <h2 className="text-xl font-black italic uppercase text-oasis-cyan mb-4">The Pocket Oasis</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Welcome, Operator. The Oasis is a persistent, generative metaverse accessible via your handheld terminal. 
                It is divided into unique sectors, each powered by a decentralized Narrative Engine.
              </p>
              <div className="flex gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                <Terminal size={24} className="text-oasis-cyan shrink-0" />
                <div className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed">
                  "Reality is limited. The Oasis is infinite. Your Ghost-ID is the key to every locked horizon."
                </div>
              </div>
            </div>
            
            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Core Philosophies</h3>
              <div className="grid grid-cols-1 gap-3">
                <PointItem icon={<Cpu size={14}/>} title="Generative Reality" desc="Every adventure is unique, generated in real-time by the Neural Architect." />
                <PointItem icon={<Shield size={14}/>} title="Persistent Profile" desc="Your credits, gear, and stats follow you across every game mode." />
                <PointItem icon={<Zap size={14}/>} title="Neural-Sync" desc="Your real-world steps and habits grant you XP and power-ups." />
              </div>
            </section>
          </div>
        );
      case 'IDENTITY':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-magenta-500/5 border border-magenta-500/20 p-6 rounded-[2rem]">
              <h2 className="text-xl font-black italic uppercase text-magenta-400 mb-4">Identity & Stats</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your Avatar is more than a skin; it is your technical loadout. Your stats directly impact your success in the AI-driven sectors.
              </p>
            </div>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Neural Build System</h3>
              <div className="space-y-3">
                <StatExplain label="Neural Processing" desc="Affects Hacking, Logic, and Information Gathering." icon={<Brain size={14}/>} color="text-blue-400" />
                <StatExplain label="Synaptic Speed" desc="Determines Reflexes, Combat success, and Dodging." icon={<Zap size={14}/>} color="text-yellow-400" />
                <StatExplain label="System Integrity" desc="Your physical health and defensive shielding." icon={<HeartPulse size={14}/>} color="text-green-400" />
                <StatExplain label="Digital Presence" desc="Used for Social Engineering and Influence." icon={<Target size={14}/>} color="text-pink-400" />
              </div>
            </section>

            <section className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="text-[10px] font-black uppercase text-white mb-2 tracking-widest">Subsystem Protocols</h4>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Choose a Subsystem (Operator, Vanguard, Shadow, Echo) to gain specialized bonuses. 
                  Switching requires a 500 CR Factory Reset.
                </p>
            </section>
          </div>
        );
      case 'EXPLORATION':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem]">
              <h2 className="text-xl font-black italic uppercase text-blue-400 mb-4">Oasis Sectors</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Sectors are interactive AI environments. Upon entry, you engage in a "Narrative Protocol."
              </p>
              <ul className="space-y-2 text-[11px] text-gray-400 font-mono list-disc pl-4">
                <li>SYNTHWAVE COAST: Retro investigations.</li>
                <li>NEON ARENA: Tactical tactical simulations.</li>
                <li>VOID LIBRARY: Forbidden knowledge scans.</li>
              </ul>
            </div>

            <section className="bg-black/40 p-5 rounded-3xl border border-white/5">
                <h3 className="text-xs font-black uppercase text-oasis-cyan mb-2">The Neural Architect</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  "The Architect watches your every move. If you tell the terminal 'I pick the lock', it checks your Neural Processing. 
                  If you say 'I draw my blade', it checks Synaptic Speed. Every action has a consequence."
                </p>
            </section>
          </div>
        );
      case 'ECONOMY':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-[2rem]">
              <h2 className="text-xl font-black italic uppercase text-yellow-500 mb-4">GIG NEXUS</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Credits (CR) are the lifeblood of the Oasis. Earn them through active work or passive infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <JobExplain title="Mixology Lab" type="ACTIVE" desc="A reflex-based game. The more accurate your mix, the higher the tip." />
              <JobExplain title="Neural Cluster" type="PASSIVE" desc="An idle miner. Upgrading hardware increases your hourly yield." />
              <JobExplain title="Drone Relay" type="TIME-BASED" desc="Send drones on automated missions. High reward, long wait times." />
            </div>
          </div>
        );
      case 'ARCADE':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-[2rem]">
              <h2 className="text-xl font-black italic uppercase text-orange-500 mb-4">The Arcade</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Classic neural simulations designed to sharpen your cognitive abilities while earning bonus CR.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h4 className="text-[10px] font-black text-white uppercase mb-1">Crystal Crush</h4>
                    <p className="text-[9px] text-gray-500">Match icons to sync energy flows. Infinite levels.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h4 className="text-[10px] font-black text-white uppercase mb-1">Word Scramble</h4>
                    <p className="text-[9px] text-gray-500">Decrypt scrambled data packets for XP.</p>
                </div>
            </div>
          </div>
        );
      case 'SYNC':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-[2rem]">
              <h2 className="text-xl font-black italic uppercase text-indigo-400 mb-4">Neural Sync</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The Oasis is linked to your physical biometric data. Your real-world vitality fuels your digital power.
              </p>
              <div className="flex items-center gap-3 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30">
                <Activity size={20} className="text-indigo-400" />
                <span className="text-[10px] font-mono text-white uppercase">Health Data -{'>'} Digital XP Conversion: ACTIVE</span>
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Reward Protocols</h3>
              <div className="space-y-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">Daily Login</span>
                    <span className="text-yellow-500 font-mono font-black text-[10px]">+50 CR + Bonus</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">Step Goal (10k)</span>
                    <span className="text-oasis-cyan font-mono font-black text-[10px]">+100 XP</span>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#08080c] text-white overflow-hidden relative">
      
      <header className="shrink-0 p-5 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-3xl z-30 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl active:scale-90 transition-all">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Neural Manual</h1>
            <p className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.3em] mt-1">System Documentation v2.9</p>
          </div>
        </div>
        <BookOpen className="text-oasis-cyan animate-pulse" size={24} />
      </header>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="shrink-0 flex p-3 border-b border-white/5 bg-black/40 overflow-x-auto no-scrollbar gap-2">
            {chapters.map(ch => (
            <button
                key={ch.id}
                onClick={() => setActiveChapter(ch.id)}
                className={`shrink-0 min-w-[100px] py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl border border-transparent flex items-center justify-center gap-2 ${
                activeChapter === ch.id ? `${ch.color} bg-white/5 border-white/20 shadow-inner` : 'text-gray-600 hover:text-gray-400'
                }`}
            >
                {ch.icon} {ch.label}
            </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-12 custom-scrollbar">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

const PointItem = ({ icon, title, desc }: any) => (
  <div className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl transition-all hover:bg-white/[0.06]">
    <div className="p-2.5 bg-black rounded-xl text-oasis-cyan border border-white/10">{icon}</div>
    <div>
      <h4 className="text-[11px] font-black uppercase tracking-tight text-white mb-0.5">{title}</h4>
      <p className="text-[10px] text-gray-500 leading-tight">{desc}</p>
    </div>
  </div>
);

const StatExplain = ({ label, desc, icon, color }: any) => (
  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
    <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>{icon}</div>
    <div className="flex-1">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{label}</h4>
      <p className="text-[9px] text-gray-500 leading-snug">{desc}</p>
    </div>
  </div>
);

const JobExplain = ({ title, type, desc }: any) => (
  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-yellow-500/30 transition-all">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-sm font-black uppercase tracking-tighter italic text-white group-hover:text-yellow-500">{title}</h4>
      <span className="text-[8px] font-mono font-black text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full">{type}</span>
    </div>
    <p className="text-[10px] text-gray-500 leading-relaxed italic">"{desc}"</p>
  </div>
);

export default GuideView;
