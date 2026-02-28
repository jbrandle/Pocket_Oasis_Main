
import React, { useState, useEffect } from 'react';
import { UserProfile, ShopItem, ItemCategory, SubSystemType, CharacterStats } from '../types';
import { ArrowLeft, ShoppingBag, Check, Cpu, Zap, Shield, Sparkles, User, Briefcase, Eye, Activity, Brain, MessageSquare, AlertCircle, RefreshCw, Lock, Terminal, Command, Code } from 'lucide-react';

interface AvatarShopProps {
  user: UserProfile;
  onClose: () => void;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

// Updated Shop Items with Starting Gear
export const SHOP_ITEMS: ShopItem[] = [
  // Starting / Basic Outfits
  { id: 'outfit_tshirt', name: 'Basic Tee', category: 'Outfit', price: 0, rarity: 'Common', description: 'Standard issue cotton t-shirt.', image: 'https://picsum.photos/id/1/200/200', value: 'Basic Tee' },
  { id: 'outfit_jeans', name: 'Utility Jeans', category: 'Outfit', price: 0, rarity: 'Common', description: 'Durable denim for everyday use.', image: 'https://picsum.photos/id/2/200/200', value: 'Utility Jeans' },
  { id: 'shoes_sneakers', name: 'Street Kicks', category: 'Accessory', price: 0, rarity: 'Common', description: 'Comfortable footwear.', image: 'https://picsum.photos/id/3/200/200', value: 'Street Kicks' },
  { id: 'acc_backpack_basic', name: 'Canvas Pack', category: 'Accessory', price: 0, rarity: 'Common', description: 'Small backpack. Holds 5 items.', image: 'https://picsum.photos/id/4/200/200', value: 'Canvas Pack' },

  // Shop Outfits
  { id: 'outfit_casual', name: 'Casual Runner', category: 'Outfit', price: 100, rarity: 'Common', description: 'Standard issue streetwear.', image: 'https://picsum.photos/id/103/200/200', value: 'Casual Runner' },
  { id: 'outfit_samurai', name: 'Neon Samurai', category: 'Outfit', price: 500, rarity: 'Rare', description: 'Traditional armor with a cybernetic twist.', image: 'https://picsum.photos/id/234/200/200', value: 'Neon Samurai' },
  { id: 'outfit_void', name: 'Void Stalker', category: 'Outfit', price: 1200, rarity: 'Legendary', description: 'Stealth suit forged in the dark web.', image: 'https://picsum.photos/id/238/200/200', value: 'Void Stalker' },
  { id: 'outfit_pilot', name: 'Retro Pilot', category: 'Outfit', price: 300, rarity: 'Common', description: 'Vintage flight gear from 2077.', image: 'https://picsum.photos/id/239/200/200', value: 'Retro Pilot' },
  
  // Accessories
  { id: 'acc_visor', name: 'Holo Visor', category: 'Accessory', price: 200, rarity: 'Common', description: 'Displays HUD data in real-time.', image: 'https://picsum.photos/id/1/200/200', value: 'Holo Visor' },
  { id: 'acc_wings', name: 'Plasma Wings', category: 'Accessory', price: 2500, rarity: 'Legendary', description: 'Decorative holographic wings.', image: 'https://picsum.photos/id/21/200/200', value: 'Plasma Wings' },
  { id: 'acc_drone', name: 'Pet Drone', category: 'Accessory', price: 800, rarity: 'Rare', description: 'A small companion drone.', image: 'https://picsum.photos/id/111/200/200', value: 'Pet Drone' },
  { id: 'acc_mask', name: 'Oni Mask', category: 'Accessory', price: 400, rarity: 'Rare', description: 'Cyber-traditional demonic protection.', image: 'https://picsum.photos/id/102/200/200', value: 'Oni Mask' },

  // Cybernetics
  { id: 'cyber_basic', name: 'Neural Link', category: 'Cybernetic', price: 100, rarity: 'Common', description: 'Basic interface for netrunning.', image: 'https://picsum.photos/id/532/200/200', value: 10 },
  { id: 'cyber_optics', name: 'Kiroshi Optics', category: 'Cybernetic', price: 250, rarity: 'Common', description: 'Enhanced zoom and night vision.', image: 'https://picsum.photos/id/870/200/200', value: 25 },
  { id: 'cyber_reflex', name: 'Synaptic Accelerator', category: 'Cybernetic', price: 450, rarity: 'Rare', description: 'Slows down time perception.', image: 'https://picsum.photos/id/134/200/200', value: 45 },
  { id: 'cyber_limbs', name: 'Titanium Limbs', category: 'Cybernetic', price: 800, rarity: 'Rare', description: 'Full limb replacement.', image: 'https://picsum.photos/id/900/200/200', value: 65 },
  { id: 'cyber_skin', name: 'Subdermal Armor', category: 'Cybernetic', price: 1200, rarity: 'Legendary', description: 'Bulletproof plating.', image: 'https://picsum.photos/id/500/200/200', value: 85 },
  { id: 'cyber_max', name: 'Project: DIVINITY', category: 'Cybernetic', price: 3000, rarity: 'Legendary', description: 'Full-body conversion.', image: 'https://picsum.photos/id/1076/200/200', value: 100 },

  // AI Companion Mods -> Neural Modules (User Mods)
  { id: 'ai_mod_empathy', name: 'Empathy Matrix', category: 'NeuralModule', price: 400, rarity: 'Rare', description: 'Enhances neural emotional intelligence.', image: 'https://picsum.photos/id/1027/200/200', value: 'EMPATHY' },
  { id: 'ai_mod_tactical', name: 'Tactical Overlay', category: 'NeuralModule', price: 600, rarity: 'Rare', description: 'Provides advanced tactical suggestions.', image: 'https://picsum.photos/id/1028/200/200', value: 'TACTICAL' },
  { id: 'ai_mod_sarcasm', name: 'Sarcasm Module', category: 'NeuralModule', price: 200, rarity: 'Common', description: 'Adds 200% more wit to neural responses.', image: 'https://picsum.photos/id/1029/200/200', value: 'SARCASM' },
  { id: 'ai_mod_quantum', name: 'Quantum Core', category: 'NeuralModule', price: 2000, rarity: 'Legendary', description: 'Vastly improves neural processing accuracy.', image: 'https://picsum.photos/id/1031/200/200', value: 'QUANTUM' },

  // Beginner Mods (Price 0, for display in inventory)
  { id: 'mod_neural', name: 'Neural Booster', category: 'NeuralModule', price: 0, rarity: 'Common', description: 'Enhances neural processing.', image: 'https://picsum.photos/id/1027/200/200', value: 'NEURAL' },
  { id: 'mod_synaptic', name: 'Synaptic Overclock', category: 'NeuralModule', price: 0, rarity: 'Common', description: 'Improves synaptic speed.', image: 'https://picsum.photos/id/1028/200/200', value: 'SYNAPTIC' },
  { id: 'mod_guardian', name: 'Guardian Protocol', category: 'NeuralModule', price: 0, rarity: 'Common', description: 'Strengthens system integrity.', image: 'https://picsum.photos/id/1029/200/200', value: 'GUARDIAN' },
  { id: 'mod_social', name: 'Social Infiltrator', category: 'NeuralModule', price: 0, rarity: 'Common', description: 'Boosts digital presence.', image: 'https://picsum.photos/id/1030/200/200', value: 'SOCIAL' },
];

const SUBSYSTEMS: { type: SubSystemType; label: string; icon: any; desc: string; pro: string; con: string; color: string }[] = [
    { 
        type: 'OPERATOR', 
        label: 'Operator', 
        icon: <Briefcase size={20}/>, 
        desc: 'Standard protocol. Balanced for all environments.',
        pro: 'No penalties. Versatile.',
        con: 'No specialized advantages.',
        color: 'text-oasis-cyan border-oasis-cyan' 
    },
    { 
        type: 'VANGUARD', 
        label: 'Vanguard', 
        icon: <Shield size={20}/>, 
        desc: 'Frontline enforcer built for combat durability.',
        pro: 'Damage Resistance & Combat Strength.',
        con: 'Slower hacking & low stealth.',
        color: 'text-orange-500 border-orange-500' 
    },
    { 
        type: 'NETRUNNER', 
        label: 'Netrunner', 
        icon: <Brain size={20}/>, 
        desc: 'Neural specialist and data infiltrator.',
        pro: 'High Hacking & Neural Processing.',
        con: 'Very low defense (Glass Cannon).',
        color: 'text-purple-500 border-purple-500' 
    },
    { 
        type: 'GHOST', 
        label: 'Ghost', 
        icon: <Zap size={20}/>, 
        desc: 'Stealth operative and social engineer.',
        pro: 'Unlocks dialogue options & high stealth.',
        con: 'Weak in physical combat.',
        color: 'text-pink-500 border-pink-500' 
    }
];

const AvatarShop: React.FC<AvatarShopProps> = ({ user, onClose, onBuy, onEquip }) => {
  const [view, setView] = useState<'MARKET' | 'WARDROBE' | 'NEURAL_CONFIG' | 'COMPANION'>('MARKET');
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('Outfit');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  // Stats Logic
  const [tempStats, setTempStats] = useState<CharacterStats>({ ...user.stats });
  const [tempSubSystem, setTempSubSystem] = useState<SubSystemType>(user.subSystem || 'OPERATOR');
  const [isStatsDirty, setIsStatsDirty] = useState(false);

  // Sync temp subsystem if user profile updates (e.g. after retrain)
  useEffect(() => {
    setTempSubSystem(user.subSystem || 'OPERATOR');
  }, [user.subSystem]);

  const displayItems = view === 'MARKET' 
    ? SHOP_ITEMS.filter(item => item.category === activeCategory)
    : SHOP_ITEMS.filter(item => item.category === activeCategory && user.inventory.includes(item.id));

  const isOwned = (itemId: string) => user.inventory.includes(itemId);
  const isEquipped = (item: ShopItem) => {
    if (item.category === 'Outfit') return user.avatar.outfit === item.value;
    if (item.category === 'Accessory') return user.avatar.accessory === item.value;
    if (item.category === 'Cybernetic') return user.avatar.cybernetics === item.value;
    if (item.category === 'NeuralModule') return user.avatar.equippedModules?.includes(item.value as string);
    return false;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 border-yellow-400';
      case 'Rare': return 'text-purple-400 border-purple-400';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  // Stat Manipulation
  // Fix: Object.values often returns unknown[], so we explicitly cast to number[] for reduction to avoid operator errors
  const totalPoints = (Object.values(user.stats) as number[]).reduce((a, b) => a + b, 0) + (user.availableStatPoints || 0);
  const currentUsedPoints = (Object.values(tempStats) as number[]).reduce((a, b) => a + b, 0);
  const pointsRemaining = totalPoints - currentUsedPoints;

  const handleStatChange = (key: keyof CharacterStats, delta: number) => {
      if (delta > 0 && pointsRemaining <= 0) return;
      if (delta < 0 && tempStats[key] <= 1) return;
      setTempStats(prev => ({ ...prev, [key]: prev[key] + delta }));
      setIsStatsDirty(true);
  };

  const handleApplyConfig = () => {
    (onEquip as any)({
        category: 'STAT_UPDATE', // signal
        value: { stats: tempStats, subSystem: tempSubSystem } // payload
    });
    setIsStatsDirty(false);
  };

  const isPhotoreal = user.avatar.style === 'photoreal';
  const cyberLevel = user.avatar.cybernetics;

  return (
    <div className={`flex flex-col h-full w-full bg-[#050508] text-white overflow-hidden transition-all duration-1000 ${isPhotoreal ? 'contrast-125 saturate-50' : ''}`}>
      {/* Header */}
      <header className="shrink-0 p-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full active:scale-90 transition-all"><ArrowLeft size={22} /></button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">Avatar Hub</h1>
        </div>
        <div className="flex items-center gap-2 bg-oasis-cyan/15 px-4 py-2 rounded-2xl border border-oasis-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <span className="text-oasis-cyan font-mono font-black text-xs">{user.credits} CR</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        
        {/* Profile Area */}
        <section className="shrink-0 bg-black/40 p-6 flex flex-col items-center border-b border-white/5 relative">
          

          <div className="relative group">
            {/* Neural Load Aura */}
            <div 
               className={`absolute inset-0 rounded-[2.5rem] blur-3xl opacity-30 animate-pulse transition-all duration-1000 ${cyberLevel > 50 ? 'scale-150' : 'scale-110'} bg-oasis-cyan`} 
            />
            
            <div 
              className={`w-36 h-36 rounded-[2.5rem] bg-gradient-to-b from-gray-800 to-gray-950 border-2 flex items-center justify-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ${isPhotoreal ? 'rounded-none border-gray-400' : 'border-oasis-cyan'}`}
            >
               <span className={`text-6xl text-white font-black transition-all ${isPhotoreal ? 'tracking-widest opacity-50' : 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'}`}>
                 {user.avatar.name.charAt(0).toUpperCase()}
               </span>
               
               {/* Cyber-HUD Layer */}
               <div className="absolute inset-0 border border-white/5 rounded-inner p-2 pointer-events-none">
                  <div className="w-4 h-4 border-t border-l border-white/20" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/20" />
               </div>

               <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  <div className="px-3 py-1 bg-black/80 rounded-full text-[7px] font-black text-oasis-cyan uppercase tracking-widest border border-oasis-cyan/20 backdrop-blur-md">
                     {user.subSystem || 'OPERATOR'}
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2 p-1 bg-white/[0.03] rounded-2xl border border-white/5 w-full max-w-sm">
             <button onClick={() => setView('MARKET')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'MARKET' ? 'bg-oasis-cyan text-black shadow-lg shadow-oasis-cyan/20' : 'text-gray-500 hover:text-gray-300'}`}>Market</button>
             <button onClick={() => setView('WARDROBE')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'WARDROBE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}>Wardrobe</button>
             <button onClick={() => setView('COMPANION')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'COMPANION' ? 'bg-magenta-500 text-white shadow-lg shadow-magenta-600/20' : 'text-gray-500 hover:text-gray-300'}`}>AIDA</button>
             <button onClick={() => setView('NEURAL_CONFIG')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'NEURAL_CONFIG' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-500 hover:text-gray-300'}`}>Build</button>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-black/20">
          
          {/* COMPANION VIEW */}
          {view === 'COMPANION' && (
              <div className="flex-1 overflow-y-auto p-5 pb-24 min-h-0 custom-scrollbar space-y-8 animate-in slide-in-from-left duration-300">
                  <section className="bg-magenta-500/10 border border-magenta-500/20 p-6 rounded-[2.5rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-20"><Cpu size={64} className="text-magenta-400" /></div>
                      <div className="relative z-10">
                          <h3 className="text-magenta-400 font-black italic uppercase tracking-tighter text-2xl mb-1">{user.companion?.name || 'AIDA'}</h3>
                          <p className="text-[10px] text-magenta-300/60 font-mono uppercase tracking-[0.2em] mb-4">Neural Companion v2.4</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                                  <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Personality</span>
                                  <div className="text-xs font-bold text-white mt-1">{user.companion?.personality}</div>
                              </div>
                              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                                  <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Level</span>
                                  <div className="text-xs font-bold text-white mt-1">LVL {user.companion?.level}</div>
                              </div>
                          </div>
                      </div>
                  </section>
              </div>
          )}

          {/* NEURAL CONFIG (BUILD) VIEW */}
          {view === 'NEURAL_CONFIG' && (
              <div className="flex-1 overflow-y-auto p-5 pb-24 min-h-0 custom-scrollbar space-y-8 animate-in slide-in-from-right duration-300">
                  {/* Active Modules */}
                  <section>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 px-2">Active Modules</h3>
                      <div className="grid grid-cols-1 gap-3">
                          {SHOP_ITEMS.filter(i => i.category === 'NeuralModule' && user.inventory.includes(i.id)).map(item => (
                              <div key={item.id} onClick={() => onEquip(item)} className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 ${user.avatar.equippedModules?.includes(item.value as string) ? 'border-magenta-500/50 bg-magenta-500/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                                  <div className="w-12 h-12 rounded-2xl bg-black/60 flex items-center justify-center border border-white/5 shrink-0 overflow-hidden">
                                      {item.image ? (
                                          <img src={item.image} className="w-full h-full object-cover opacity-50" alt={item.name} />
                                      ) : (
                                          <Cpu size={20} className="text-magenta-400/50" />
                                      )}
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="text-xs font-black uppercase text-white tracking-tight">{item.name}</h4>
                                      <p className="text-[9px] text-gray-500 italic">"{item.description}"</p>
                                  </div>
                                  <div className={`p-2 rounded-xl ${user.avatar.equippedModules?.includes(item.value as string) ? 'bg-magenta-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]' : 'bg-white/5 text-gray-600'}`}>
                                      <Zap size={14} fill={user.avatar.equippedModules?.includes(item.value as string) ? "currentColor" : "none"} />
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-3xl text-center">
                          <p className="text-[9px] text-gray-500 leading-relaxed">
                              Visit the <span className="text-oasis-cyan cursor-pointer font-bold" onClick={() => { setView('MARKET'); setActiveCategory('NeuralModule' as any); }}>Market</span> to acquire new neural modules.
                          </p>
                      </div>
                  </section>

                  {/* Stat Allocation */}
                  <section>
                      <div className="flex justify-between items-end mb-4 px-2">
                          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Allocation</h3>
                          <div className={`text-[10px] font-black uppercase tracking-widest ${pointsRemaining > 0 ? 'text-yellow-500 animate-pulse' : 'text-gray-600'}`}>
                             {pointsRemaining} Pts Available
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          <StatAllocator label="Neural Processing" val={tempStats.neuralProcessing} icon={<Brain size={14}/>} color="text-blue-400" onChange={(d) => handleStatChange('neuralProcessing', d)} />
                          <StatAllocator label="Synaptic Speed" val={tempStats.synapticSpeed} icon={<Zap size={14}/>} color="text-yellow-400" onChange={(d) => handleStatChange('synapticSpeed', d)} />
                          <StatAllocator label="System Integrity" val={tempStats.systemIntegrity} icon={<Shield size={14}/>} color="text-green-400" onChange={(d) => handleStatChange('systemIntegrity', d)} />
                          <StatAllocator label="Digital Presence" val={tempStats.digitalPresence} icon={<MessageSquare size={14}/>} color="text-pink-400" onChange={(d) => handleStatChange('digitalPresence', d)} />
                      </div>
                  </section>

                  {/* Cybernetics Section */}
                  <section>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 px-2">Cybernetic Augmentation</h3>
                      <div className="grid grid-cols-1 gap-3">
                          {SHOP_ITEMS.filter(i => i.category === 'Cybernetic' && user.inventory.includes(i.id)).map(item => (
                              <div key={item.id} onClick={() => onEquip(item)} className={`p-4 rounded-3xl border transition-all cursor-pointer ${user.avatar.cybernetics === item.value ? 'border-oasis-cyan bg-oasis-cyan/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
                                          <Cpu size={18} className={user.avatar.cybernetics === item.value ? 'text-oasis-cyan' : 'text-gray-500'} />
                                      </div>
                                      <div className="flex-1">
                                          <h4 className="text-xs font-black uppercase text-white">{item.name}</h4>
                                          <p className="text-[9px] text-gray-500">{item.description}</p>
                                      </div>
                                      {user.avatar.cybernetics === item.value && <Check size={16} className="text-oasis-cyan" />}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </section>

                  {/* Subsystem Selection */}
                  <section>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 px-2">Subsystem Protocol</h3>
                      <div className="space-y-4">
                          {SUBSYSTEMS.filter(sub => sub.type === user.subSystem).map(sub => {
                              return (
                              <div 
                                key={sub.type}
                                className={`p-4 rounded-3xl border transition-all relative overflow-hidden group bg-white/10 ${sub.color} shadow-lg`}
                              >
                                  <div className="flex items-start gap-4 relative z-10">
                                      <div className={`p-3 rounded-2xl bg-black/50 ${sub.color} border border-current`}>{sub.icon}</div>
                                      <div className="flex-1">
                                          <div className="flex justify-between items-center mb-1">
                                              <h4 className="text-sm font-black uppercase tracking-tight text-white">{sub.label}</h4>
                                              <Check size={16} />
                                          </div>
                                          <p className="text-[10px] text-gray-500 leading-snug mb-3">{sub.desc}</p>
                                          <div className="flex gap-2 text-[8px] font-mono uppercase">
                                              <span className="text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded">▲ {sub.pro}</span>
                                          </div>
                                          <div className="flex gap-2 text-[8px] font-mono uppercase mt-1">
                                              <span className="text-red-400 bg-red-900/20 px-1.5 py-0.5 rounded">▼ {sub.con}</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              );
                          })}
                      </div>
                  </section>

                  {isStatsDirty && (
                      <div className="sticky bottom-4 z-50">
                          <button 
                            onClick={handleApplyConfig}
                            disabled={pointsRemaining > 0}
                            className="w-full bg-oasis-cyan text-black py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-oasis-cyan/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                          >
                            <RefreshCw size={16} /> {pointsRemaining > 0 ? 'Allocate All Points' : 'Reboot System'}
                          </button>
                      </div>
                  )}
              </div>
          )}

          {/* MARKET VIEW */}
          {view === 'MARKET' && (
              <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500">
                  <TerminalMarket user={user} onBuy={onBuy} />
              </div>
          )}

          {/* WARDROBE VIEW */}
          {view === 'WARDROBE' && (
            <>
                {/* Category Tabs */}
                <div className="shrink-0 flex p-3 border-b border-white/5 bg-black/40 overflow-x-auto no-scrollbar gap-2">
                    {(['Outfit', 'Accessory'] as ItemCategory[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 min-w-[80px] py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl border border-transparent ${
                        activeCategory === cat ? 'text-oasis-cyan bg-oasis-cyan/10 border-oasis-cyan/30 shadow-inner' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                        }`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>

                {/* Scrollable Grid */}
                <div className="flex-1 overflow-y-auto p-4 pb-24 min-h-0 custom-scrollbar">
                    {displayItems.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-gray-700 space-y-4 opacity-50">
                        <div className="p-6 bg-white/5 rounded-full border border-white/5"><ShoppingBag size={32} /></div>
                        <p className="text-[10px] uppercase font-black tracking-[0.2em]">Inventory Offline</p>
                    </div>
                    ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {displayItems.map(item => {
                        const owned = isOwned(item.id);
                        const equipped = isEquipped(item);

                        return (
                            <div 
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`relative group p-4 rounded-3xl bg-white/[0.02] border transition-all duration-300 active:scale-95 ${
                                equipped ? 'border-oasis-cyan bg-oasis-cyan/[0.03] shadow-[0_10px_30px_-10px_rgba(0,243,255,0.2)]' : 'border-white/5 hover:border-white/20'
                            }`}
                            >
                            <div className="aspect-square rounded-2xl bg-black/60 overflow-hidden mb-4 relative shadow-inner">
                                <img src={item.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={item.name} />
                                <div className="absolute top-2 right-2">
                                {equipped ? (
                                    <div className="p-1.5 bg-oasis-cyan rounded-lg shadow-lg"><Check size={14} className="text-black" /></div>
                                ) : !owned && (
                                    <div className="px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-yellow-500/30 text-[9px] font-mono font-bold text-yellow-500">
                                    {item.price} CR
                                    </div>
                                )}
                                </div>
                            </div>
                            <h3 className="text-[11px] font-black text-white truncate mb-1 uppercase tracking-tight">{item.name}</h3>
                            <div className={`text-[8px] font-black uppercase inline-block border-b-2 px-1 ${getRarityColor(item.rarity)}`}>{item.rarity}</div>
                            </div>
                        );
                        })}
                    </div>
                    )}
                </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[110] bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300 flex items-center justify-center p-6" onClick={() => setSelectedItem(null)}>
          <div className="w-full max-w-sm bg-gray-950 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-oasis-cyan/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-white/10 mb-8 shadow-2xl">
                <img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-3 text-center leading-none">{selectedItem.name}</h2>
              <div className={`text-[10px] font-black px-4 py-1 rounded-full border mb-8 uppercase tracking-widest ${getRarityColor(selectedItem.rarity)}`}>
                {selectedItem.rarity} MODULE
              </div>
              <p className="text-gray-500 text-xs font-medium mb-10 text-center leading-relaxed italic">"{selectedItem.description}"</p>
              
              <div className="flex gap-3 w-full">
                <button onClick={() => setSelectedItem(null)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-gray-400 font-black text-[10px] rounded-3xl uppercase transition-colors">Cancel</button>
                {isOwned(selectedItem.id) ? (
                  <button 
                    onClick={() => { onEquip(selectedItem); setSelectedItem(null); }}
                    disabled={isEquipped(selectedItem)}
                    className="flex-[2] py-5 bg-oasis-cyan text-black font-black text-[10px] rounded-3xl uppercase shadow-[0_15px_40px_rgba(0,243,255,0.3)] disabled:opacity-50 transition-transform active:scale-95"
                  >
                    {isEquipped(selectedItem) ? 'ACTIVE' : 'INITIALIZE SYNC'}
                  </button>
                ) : (
                  <button 
                    onClick={() => { onBuy(selectedItem); setSelectedItem(null); }}
                    disabled={user.credits < selectedItem.price}
                    className="flex-[2] py-5 bg-yellow-500 text-black font-black text-[10px] rounded-3xl uppercase shadow-[0_15px_40px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:bg-gray-800 transition-transform active:scale-95"
                  >
                    DEPLOY: {selectedItem.price} CR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatAllocator = ({ label, val, icon, color, onChange }: any) => (
    <div className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5">
        <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>{icon}</div>
        <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-wide text-gray-400">{label}</span>
            <div className="flex items-center gap-1 mt-1">
                <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden">
                    <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{width: `${(val/20)*100}%`}} />
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => onChange(-1)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all">-</button>
            <span className={`text-lg font-black w-6 text-center ${color}`}>{val}</span>
            <button onClick={() => onChange(1)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all">+</button>
        </div>
    </div>
);

const TerminalMarket = ({ user, onBuy }: { user: UserProfile, onBuy: (item: ShopItem) => void }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['Oasis Market Terminal v4.0.2', 'Type "help" for commands.', '']);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);
    
    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        let newHistory = [...history, `> ${input}`];

        if (cmd === 'help') {
            newHistory.push('Available commands:', '  ls [category] - List items (outfit, accessory, cyber, mod)', '  buy [item_id] - Purchase item', '  clear - Clear terminal', '');
        } else if (cmd === 'clear') {
            newHistory = ['Oasis Market Terminal v4.0.2', ''];
        } else if (cmd.startsWith('ls')) {
            const parts = cmd.split(' ');
            const cat = parts[1];
            let items = SHOP_ITEMS;
            if (cat) {
                const categoryMap: any = {
                    outfit: 'Outfit',
                    accessory: 'Accessory',
                    cyber: 'Cybernetic',
                    mod: 'NeuralModule'
                };
                const targetCat = categoryMap[cat];
                if (targetCat) {
                    items = SHOP_ITEMS.filter(i => i.category === targetCat);
                } else {
                    newHistory.push(`Error: Unknown category "${cat}"`);
                    items = [];
                }
            }
            
            if (items.length > 0) {
                newHistory.push('ID'.padEnd(15) + ' | ' + 'NAME'.padEnd(15) + ' | ' + 'PRICE');
                newHistory.push('-------------------------------------------');
                items.forEach(i => {
                    newHistory.push(`${i.id.padEnd(15)} | ${i.name.padEnd(15)} | ${i.price} CR`);
                });
                newHistory.push('');
            }
        } else if (cmd.startsWith('buy')) {
            const id = cmd.split(' ')[1];
            const item = SHOP_ITEMS.find(i => i.id === id);
            if (!item) {
                newHistory.push(`Error: Item "${id}" not found.`);
            } else if (user.inventory.includes(item.id)) {
                newHistory.push(`Error: Item "${item.name}" already owned.`);
            } else if (user.credits < item.price) {
                newHistory.push(`Error: Insufficient credits. Need ${item.price} CR.`);
            } else {
                onBuy(item);
                newHistory.push(`Success: Purchased ${item.name}. Item sent to inventory.`);
            }
        } else {
            newHistory.push(`Command not found: ${cmd}`);
        }

        setHistory(newHistory);
        setInput('');
    };

    return (
        <div className="flex-1 bg-black/80 p-4 font-mono text-[10px] text-green-500 overflow-hidden flex flex-col border border-green-500/20 rounded-2xl m-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar mb-2">
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap mb-0.5">{line}</div>
                ))}
            </div>
            <form onSubmit={handleCommand} className="flex gap-2 items-center border-t border-green-500/20 pt-2">
                <span className="text-green-400 font-bold tracking-widest animate-pulse">SYSTEM@OASIS:~$</span>
                <input 
                    autoFocus
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none border-none text-green-400 caret-green-500"
                />
            </form>
        </div>
    );
};

export default AvatarShop;
