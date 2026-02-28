
import React, { useState, useEffect } from 'react';
import { UserProfile, AvatarConfig, AICompanionPersonality, CharacterStats, SubSystemType } from '../types';
import { Shield, Zap, User, ChevronRight, BookOpen, Cpu, Sparkles, Heart, Brain, Activity, MessageSquare, Eye, Scissors, Info, Check, Lock } from 'lucide-react';

interface AvatarCreatorProps {
  onComplete: (profile: UserProfile) => void;
  onOpenGuide?: () => void;
}

const BEGINNER_MODS = [
  { id: 'mod_neural', name: 'Neural Booster', desc: '+2 Neural Processing', icon: <Brain size={16} />, stat: 'neuralProcessing', value: 'NEURAL' },
  { id: 'mod_synaptic', name: 'Synaptic Overclock', desc: '+2 Synaptic Speed', icon: <Zap size={16} />, stat: 'synapticSpeed', value: 'SYNAPTIC' },
  { id: 'mod_guardian', name: 'Guardian Protocol', desc: '+2 System Integrity', icon: <Shield size={16} />, stat: 'systemIntegrity', value: 'GUARDIAN' },
  { id: 'mod_social', name: 'Social Infiltrator', desc: '+2 Digital Presence', icon: <MessageSquare size={16} />, stat: 'digitalPresence', value: 'SOCIAL' },
];

const BEGINNER_CYBER = [
  { id: 'cyber_basic', name: 'Neural Link', desc: 'Basic interface.', icon: <Cpu size={16} />, value: 10 },
  { id: 'cyber_optics', name: 'Kiroshi Optics', desc: 'Enhanced vision.', icon: <Eye size={16} />, value: 25 },
];

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onComplete, onOpenGuide }) => {
  const [step, setStep] = useState<'SPLASH' | 'IDENTITY' | 'APPEARANCE' | 'SUBSYSTEM' | 'NEURAL_LINK'>('SPLASH');
  
  // Identity
  const [name, setName] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [age, setAge] = useState(25);
  const [adminVerified, setAdminVerified] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Appearance
  const [style, setStyle] = useState<'photoreal' | 'stylized'>('stylized');
  const [eyeColor, setEyeColor] = useState('#00f3ff');

  // Subsystem
  const [subSystem, setSubSystem] = useState<SubSystemType>('OPERATOR');
  
  // Neural Link
  const [companionName, setCompanionName] = useState('AIDA');
  const [personality, setPersonality] = useState<AICompanionPersonality>(AICompanionPersonality.BASIC);
  const [selectedModId, setSelectedModId] = useState(BEGINNER_MODS[0].id);
  const [selectedCyberId, setSelectedCyberId] = useState(BEGINNER_CYBER[0].id);

  const isGeneralName = name.trim().toLowerCase() === 'general' && adminVerified;

  useEffect(() => {
    if (isGeneralName) {
      setPersonality(AICompanionPersonality.ROOK);
      setCompanionName('Rook the Magnificent');
    }
  }, [isGeneralName]);

  const handleAdminVerify = async () => {
    try {
      const res = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminVerified(true);
        setShowAdminPrompt(false);
        setAdminError('');
        setAdminPassword('');
      } else {
        setAdminError(data.error || 'Access denied. Invalid authorization code.');
        setAdminPassword('');
      }
    } catch {
      setAdminError('Connection error. Try again.');
      setAdminPassword('');
    }
  };

  const handleProceedFromIdentity = () => {
    if (!name.trim()) return;
    if (name.trim().toLowerCase() === 'general' && !adminVerified) {
      setShowAdminPrompt(true);
      return;
    }
    setStep('APPEARANCE');
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    
    const selectedMod = BEGINNER_MODS.find(m => m.id === selectedModId);
    const selectedCyber = BEGINNER_CYBER.find(c => c.id === selectedCyberId);
    const baseStats: CharacterStats = {
      neuralProcessing: 10,
      synapticSpeed: 10,
      systemIntegrity: 10,
      digitalPresence: 10
    };

    if (selectedMod) {
      (baseStats as any)[selectedMod.stat] += 2;
    }

    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      avatar: {
        name,
        style,
        sex,
        age,
        eyeColor,
        outfit: 'Basic Tee',
        cybernetics: selectedCyber?.value || 0,
        equippedModules: selectedMod ? [selectedMod.value as string] : []
      },
      credits: 250,
      level: 1,
      completedQuests: 0,
      inventory: ['outfit_tshirt', 'outfit_jeans', 'shoes_sneakers', 'acc_backpack_basic', selectedModId, selectedCyberId], 
      inventoryCapacity: 5,
      isSubscriber: false,
      lastLoginDate: new Date().toISOString().split('T')[0],
      dailyStreak: 0,
      dailyXPGoal: 100,
      stepGoal: 10000,
      currentSteps: 0,
      history: [],
      notifications: [],
      calendarEvents: [],
      stats: baseStats,
      availableStatPoints: 0,
      subSystem: subSystem,
      miningStats: {
        level: 1,
        lastCollected: Date.now()
      },
      activeMission: null,
      companion: {
        id: crypto.randomUUID(),
        name: companionName,
        personality: personality,
        level: 1
      },
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

  const renderSplash = () => (
    <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-tr from-oasis-cyan to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.3)] border border-white/20 animate-pulse">
          <Sparkles size={48} className="text-white" />
        </div>
        <div className="absolute -top-4 -right-4 bg-yellow-500 text-black text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">v2.5</div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
          Pocket <span className="text-oasis-cyan">Oasis</span>
        </h1>
        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.5em]">Your Digital Sanctuary</p>
      </div>

      <div className="max-w-xs text-gray-400 text-xs leading-relaxed space-y-4">
        <p>
          Welcome to a living story. Pocket Oasis is an immersive virtual world where you can escape reality and become the person you were always meant to be. 
        </p>
        <p>
          Like a great book you don't just read, but live—your journey through the Oasis is limited only by your imagination.
        </p>
        <p className="text-[10px] opacity-60 italic">
          "Neural-link technology active. Real-world asset synchronization pending."
        </p>
      </div>

      <button 
        onClick={() => setStep('IDENTITY')}
        className="group px-12 py-5 bg-white text-black font-black rounded-full uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-oasis-cyan transition-all shadow-xl active:scale-95"
      >
        Initialize Neural Link <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  const renderIdentity = () => (
    <div className="w-full space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-oasis-cyan/10 rounded-xl flex items-center justify-center border border-oasis-cyan/20">
          <User size={20} className="text-oasis-cyan" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Identity Protocol</h2>
          <p className="text-[8px] text-gray-500 font-mono uppercase tracking-widest">Step 1 of 4</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[8px] font-black text-oasis-cyan uppercase tracking-[0.3em] mb-3">Operator Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-oasis-cyan outline-none transition-all font-bold placeholder:text-gray-600"
            placeholder="Enter Name..."
            maxLength={12}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Biological Sex</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setSex('M')}
                className={`flex-1 py-3 rounded-xl border font-black text-xs transition-all ${sex === 'M' ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}
              >
                MALE
              </button>
              <button 
                onClick={() => setSex('F')}
                className={`flex-1 py-3 rounded-xl border font-black text-xs transition-all ${sex === 'F' ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-lg shadow-pink-500/10' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}
              >
                FEMALE
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Neural Age</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 18)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-oasis-cyan outline-none transition-all font-bold"
              min={18}
              max={99}
            />
          </div>
        </div>
      </div>

      {showAdminPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d0d15] border border-red-500/30 rounded-3xl p-8 max-w-xs w-full mx-4 shadow-[0_0_60px_rgba(255,0,0,0.15)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                <Lock size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-red-400">Restricted Name</h3>
                <p className="text-[7px] text-gray-500 font-mono uppercase tracking-widest">Admin Authorization Required</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mb-4">The name "General" is reserved. Enter the authorization code to proceed.</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminVerify()}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-red-400 outline-none transition-all font-mono placeholder:text-gray-600 mb-3"
              placeholder="Authorization code..."
              autoFocus
            />
            {adminError && <p className="text-[9px] text-red-400 font-bold mb-3">{adminError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAdminPrompt(false); setAdminPassword(''); setAdminError(''); setName(''); }}
                className="flex-1 bg-white/5 text-gray-400 font-black py-3 rounded-xl uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminVerify}
                className="flex-[2] bg-red-500 text-white font-black py-3 rounded-xl uppercase tracking-widest text-[9px] shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleProceedFromIdentity}
        disabled={!name.trim()}
        className="w-full bg-oasis-cyan text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-oasis-cyan/20 disabled:opacity-20 transition-all active:scale-95"
      >
        Proceed to Appearance <ChevronRight size={18} />
      </button>
    </div>
  );

  const renderAppearance = () => (
    <div className="w-full space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
          <Sparkles size={20} className="text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Visual Sync</h2>
          <p className="text-[8px] text-gray-500 font-mono uppercase tracking-widest">Step 2 of 4</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Render Style</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setStyle('stylized')}
              className={`flex-1 py-3 rounded-xl border font-black text-[10px] transition-all ${style === 'stylized' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-gray-500'}`}
            >
              STYLIZED
            </button>
            <button 
              onClick={() => setStyle('photoreal')}
              className={`flex-1 py-3 rounded-xl border font-black text-[10px] transition-all ${style === 'photoreal' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/5 text-gray-500'}`}
            >
              PHOTOREAL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Eye Color</label>
            <div className="flex flex-wrap gap-2">
              {['#00f3ff', '#ff00ff', '#22c55e', '#fbbf24', '#ffffff'].map(c => (
                <button 
                  key={c}
                  onClick={() => setEyeColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${eyeColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep('IDENTITY')} className="flex-1 bg-white/5 text-gray-400 font-black py-5 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Back</button>
        <button onClick={() => setStep('SUBSYSTEM')} className="flex-[2] bg-purple-500 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
          Subsystem <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderSubsystem = () => (
    <div className="w-full space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-oasis-cyan/10 rounded-xl flex items-center justify-center border border-oasis-cyan/20">
          <Cpu size={20} className="text-oasis-cyan" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Subsystem Protocol</h2>
          <p className="text-[8px] text-gray-500 font-mono uppercase tracking-widest">Step 3 of 4</p>
        </div>
      </div>

      <div className="space-y-4">
        {(['OPERATOR', 'VANGUARD', 'NETRUNNER', 'GHOST'] as SubSystemType[]).map(sub => (
          <button 
            key={sub}
            onClick={() => setSubSystem(sub)}
            className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
              subSystem === sub 
                ? 'bg-oasis-cyan/10 border-oasis-cyan text-oasis-cyan shadow-lg shadow-oasis-cyan/10' 
                : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-lg ${subSystem === sub ? 'bg-oasis-cyan text-black' : 'bg-white/5'}`}>
              {sub === 'OPERATOR' && <Activity size={18} />}
              {sub === 'VANGUARD' && <Shield size={18} />}
              {sub === 'NETRUNNER' && <Brain size={18} />}
              {sub === 'GHOST' && <Zap size={18} />}
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest">{sub}</div>
              <div className="text-[8px] opacity-60 font-mono">
                {sub === 'OPERATOR' && 'Balanced protocol for all environments.'}
                {sub === 'VANGUARD' && 'Frontline enforcer built for durability.'}
                {sub === 'NETRUNNER' && 'Neural specialist for data extraction.'}
                {sub === 'GHOST' && 'Stealth operative for covert syncs.'}
              </div>
            </div>
            {subSystem === sub && <Check size={14} />}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep('APPEARANCE')} className="flex-1 bg-white/5 text-gray-400 font-black py-5 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Back</button>
        <button onClick={() => setStep('NEURAL_LINK')} className="flex-[2] bg-oasis-cyan text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-oasis-cyan/20 transition-all active:scale-95">
          Neural Link <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderNeuralLink = () => (
    <div className="w-full space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
          <Cpu size={20} className="text-yellow-400" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Neural Link</h2>
          <p className="text-[8px] text-gray-500 font-mono uppercase tracking-widest">Step 4 of 4</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[8px] font-black text-oasis-cyan uppercase tracking-[0.3em] mb-3">Companion Name</label>
          <input 
            type="text" 
            value={companionName}
            onChange={(e) => setCompanionName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-oasis-cyan outline-none transition-all font-bold placeholder:text-gray-600"
            placeholder="Enter Companion Name..."
            maxLength={12}
          />
        </div>

        <div>
  <div className="flex items-center justify-between mb-3">
    <label className="text-[8px] font-black text-yellow-500 uppercase tracking-[0.3em]">AI Companion Personality</label>
    <div className="p-1 bg-yellow-500/10 rounded-lg text-yellow-500"><Info size={10} /></div>
  </div>

  <div className="grid grid-cols-2 gap-2">
    {Object.values(AICompanionPersonality).map((p) => (
      <button
        key={p}
        onClick={() => setPersonality(p)}
        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
          personality === p
            ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-lg shadow-yellow-500/10'
            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
        }`}
      >
        <span className="text-[10px] font-black uppercase tracking-widest">{p}</span>
        <span className="text-[7px] opacity-50 font-mono">Neural Profile {p.charAt(0)}</span>
      </button>
    ))}

    {/* Rook - the premium/locked card */}
    <button
      onClick={() => {
        if (isGeneralName) {
          setPersonality(AICompanionPersonality.ROOK);
          setCompanionName('Rook the Magnificent');
        } else {
          alert('Rook the Magnificent is a premium companion. Unlock for one-time payment?');
        }
      }}
      className={`relative p-3 rounded-xl border text-left flex flex-col gap-1 transition-all overflow-hidden ${
        isGeneralName
          ? personality === AICompanionPersonality.ROOK
            ? 'bg-yellow-600/20 border-yellow-400 text-yellow-400 shadow-lg shadow-yellow-500/30'
            : 'bg-white/5 border-white/10 text-yellow-400 hover:border-yellow-400/50'
          : 'bg-gray-800/60 border-gray-700 text-yellow-400/70 cursor-not-allowed'
      }`}
      disabled={!isGeneralName}
    >
      <span className="text-[10px] font-black uppercase tracking-widest">ROOK THE MAGNIFICENT</span>
      <span className="text-[7px] opacity-60 font-mono">Neural Profile R • Elite</span>

      {/* Yellow lock overlay for non-unlocked users */}
      {!isGeneralName && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
          <Lock size={28} className="text-yellow-400 drop-shadow-lg" />
          <span className="absolute bottom-2 text-[9px] font-black text-yellow-400">PREMIUM</span>
        </div>
      )}
    </button>
  </div>
</div>

        <div>
          <label className="block text-[8px] font-black text-oasis-cyan uppercase tracking-[0.3em] mb-3">Starting Cybernetic</label>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {BEGINNER_CYBER.map((cyber) => (
              <button 
                key={cyber.id}
                onClick={() => setSelectedCyberId(cyber.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  selectedCyberId === cyber.id 
                    ? 'bg-oasis-cyan/10 border-oasis-cyan text-oasis-cyan shadow-lg shadow-oasis-cyan/10' 
                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedCyberId === cyber.id ? 'bg-oasis-cyan text-black' : 'bg-white/5'}`}>
                  {cyber.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[9px] font-black uppercase tracking-widest">{cyber.name}</div>
                  <div className="text-[7px] opacity-60 font-mono">{cyber.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-black text-oasis-cyan uppercase tracking-[0.3em] mb-3">Starting Neural Mod</label>
          <div className="grid grid-cols-1 gap-2">
            {BEGINNER_MODS.map((mod) => (
              <button 
                key={mod.id}
                onClick={() => setSelectedModId(mod.id)}
                className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                  selectedModId === mod.id 
                    ? 'bg-oasis-cyan/10 border-oasis-cyan text-oasis-cyan shadow-lg shadow-oasis-cyan/10' 
                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedModId === mod.id ? 'bg-oasis-cyan text-black' : 'bg-white/5'}`}>
                  {mod.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-black uppercase tracking-widest">{mod.name}</div>
                  <div className="text-[8px] opacity-60 font-mono">{mod.desc}</div>
                </div>
                {selectedModId === mod.id && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep('SUBSYSTEM')} className="flex-1 bg-white/5 text-gray-400 font-black py-5 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Back</button>
        <button onClick={handleCreate} className="flex-[2] bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95">
          Establish Uplink <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#07070a] text-white p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover blur-[5px] opacity-20" alt="Oasis background" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Atmospheric Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-oasis-cyan/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-sm bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {step === 'SPLASH' && renderSplash()}
        {step === 'IDENTITY' && renderIdentity()}
        {step === 'APPEARANCE' && renderAppearance()}
        {step === 'SUBSYSTEM' && renderSubsystem()}
        {step === 'NEURAL_LINK' && renderNeuralLink()}
      </div>

      {step !== 'SPLASH' && (
        <div className="mt-8 text-center relative z-10">
          <p className="text-[7px] text-gray-500 font-mono uppercase tracking-[0.5em] animate-pulse">Neural Handshake in Progress...</p>
        </div>
      )}
    </div>
  );
};

export default AvatarCreator;
