
import React, { useState } from 'react';
import { UserProfile, ShopItem, ItemCategory } from '../types';
import { ArrowLeft, ShoppingBag, Check, Cpu, Zap, Shield, Sparkles, User, Briefcase, Eye } from 'lucide-react';

interface AvatarShopProps {
  user: UserProfile;
  onClose: () => void;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Outfits
  { id: 'outfit_casual', name: 'Casual Runner', category: 'Outfit', price: 0, rarity: 'Common', description: 'Standard issue streetwear.', image: 'https://picsum.photos/id/103/200/200', value: 'Casual Runner' },
  { id: 'outfit_samurai', name: 'Neon Samurai', category: 'Outfit', price: 500, rarity: 'Rare', description: 'Traditional armor with a cybernetic twist.', image: 'https://picsum.photos/id/234/200/200', value: 'Neon Samurai' },
  { id: 'outfit_void', name: 'Void Stalker', category: 'Outfit', price: 1200, rarity: 'Legendary', description: 'Stealth suit forged in the dark web.', image: 'https://picsum.photos/id/238/200/200', value: 'Void Stalker' },
  { id: 'outfit_pilot', name: 'Retro Pilot', category: 'Outfit', price: 300, rarity: 'Common', description: 'Vintage flight gear from 2077.', image: 'https://picsum.photos/id/239/200/200', value: 'Retro Pilot' },
  
  // Accessories
  { id: 'acc_visor', name: 'Holo Visor', category: 'Accessory', price: 200, rarity: 'Common', description: 'Displays HUD data in real-time.', image: 'https://picsum.photos/id/1/200/200', value: 'Holo Visor' },
  { id: 'acc_wings', name: 'Plasma Wings', category: 'Accessory', price: 2500, rarity: 'Legendary', description: 'Decorative holographic wings.', image: 'https://picsum.photos/id/21/200/200', value: 'Plasma Wings' },
  { id: 'acc_drone', name: 'Pet Drone', category: 'Accessory', price: 800, rarity: 'Rare', description: 'A small companion drone.', image: 'https://picsum.photos/id/111/200/200', value: 'Pet Drone' },
  { id: 'acc_mask', name: 'Oni Mask', category: 'Accessory', price: 400, rarity: 'Rare', description: 'Cyber-traditional demonic protection.', image: 'https://picsum.photos/id/102/200/200', value: 'Oni Mask' },

  // Hair Colors
  { id: 'hair_cyan', name: 'Cyan Pulse', category: 'Hair', price: 0, rarity: 'Common', description: 'Factory default luminescence.', image: 'https://picsum.photos/id/1011/200/200', value: '#00f3ff' },
  { id: 'hair_magenta', name: 'Vapor Pink', category: 'Hair', price: 200, rarity: 'Common', description: 'Hot magenta light stream.', image: 'https://picsum.photos/id/1012/200/200', value: '#ff00ff' },
  { id: 'hair_gold', name: 'Solar Flare', category: 'Hair', price: 600, rarity: 'Rare', description: 'High-intensity golden radiance.', image: 'https://picsum.photos/id/1013/200/200', value: '#fbbf24' },
  { id: 'hair_lime', name: 'Toxic Glow', category: 'Hair', price: 400, rarity: 'Common', description: 'Neon green energy flow.', image: 'https://picsum.photos/id/1014/200/200', value: '#22c55e' },
  { id: 'hair_rainbow', name: 'Prism Flux', category: 'Hair', price: 1500, rarity: 'Legendary', description: 'Multi-spectrum neural sync.', image: 'https://picsum.photos/id/1015/200/200', value: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)' },

  // Cybernetics
  { id: 'cyber_basic', name: 'Neural Link', category: 'Cybernetic', price: 100, rarity: 'Common', description: 'Basic interface for netrunning.', image: 'https://picsum.photos/id/532/200/200', value: 10 },
  { id: 'cyber_optics', name: 'Kiroshi Optics', category: 'Cybernetic', price: 250, rarity: 'Common', description: 'Enhanced zoom and night vision.', image: 'https://picsum.photos/id/870/200/200', value: 25 },
  { id: 'cyber_reflex', name: 'Synaptic Accelerator', category: 'Cybernetic', price: 450, rarity: 'Rare', description: 'Slows down time perception.', image: 'https://picsum.photos/id/134/200/200', value: 45 },
  { id: 'cyber_limbs', name: 'Titanium Limbs', category: 'Cybernetic', price: 800, rarity: 'Rare', description: 'Full limb replacement.', image: 'https://picsum.photos/id/900/200/200', value: 65 },
  { id: 'cyber_skin', name: 'Subdermal Armor', category: 'Cybernetic', price: 1200, rarity: 'Legendary', description: 'Bulletproof plating.', image: 'https://picsum.photos/id/500/200/200', value: 85 },
  { id: 'cyber_max', name: 'Project: DIVINITY', category: 'Cybernetic', price: 3000, rarity: 'Legendary', description: 'Full-body conversion.', image: 'https://picsum.photos/id/1076/200/200', value: 100 },
];

const AvatarShop: React.FC<AvatarShopProps> = ({ user, onClose, onBuy, onEquip }) => {
  const [view, setView] = useState<'MARKET' | 'WARDROBE'>('MARKET');
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('Outfit');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const displayItems = view === 'MARKET' 
    ? SHOP_ITEMS.filter(item => item.category === activeCategory)
    : SHOP_ITEMS.filter(item => item.category === activeCategory && user.inventory.includes(item.id));

  const isOwned = (itemId: string) => user.inventory.includes(itemId);
  const isEquipped = (item: ShopItem) => {
    if (item.category === 'Outfit') return user.avatar.outfit === item.value;
    if (item.category === 'Accessory') return user.avatar.accessory === item.value;
    if (item.category === 'Cybernetic') return user.avatar.cybernetics === item.value;
    if (item.category === 'Hair') return user.avatar.hairColor === item.value;
    return false;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 border-yellow-400';
      case 'Rare': return 'text-purple-400 border-purple-400';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  const isPhotoreal = user.avatar.style === 'photoreal';
  const cyberLevel = user.avatar.cybernetics;

  return (
    <div className={`flex flex-col h-full w-full bg-[#050508] text-white overflow-hidden transition-all duration-1000 ${isPhotoreal ? 'contrast-125 saturate-50' : ''}`}>
      {/* Header */}
      <header className="shrink-0 p-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full active:scale-90 transition-all"><ArrowLeft size={22} /></button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Avatar Hub</h1>
        </div>
        <div className="flex items-center gap-2 bg-oasis-cyan/15 px-4 py-2 rounded-2xl border border-oasis-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <span className="text-oasis-cyan font-mono font-black text-xs">{user.credits} CR</span>
        </div>
      </header>

      {/* Main Container - Ensuring it takes full remaining height */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        
        {/* Profile Area */}
        <section className="shrink-0 bg-black/40 p-6 flex flex-col items-center border-b border-white/5 relative">
          {/* Cybernetic Glitch Effect if High Cybernetics */}
          {cyberLevel > 70 && (
             <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[url('https://media.giphy.com/media/oYtMzktkQz4Jy/giphy.gif')] mix-blend-overlay" />
          )}

          <div className="relative group">
            {/* Neural Load Aura */}
            <div 
               className={`absolute inset-0 rounded-[2.5rem] blur-3xl opacity-30 animate-pulse transition-all duration-1000 ${cyberLevel > 50 ? 'scale-150' : 'scale-110'}`} 
               style={{ backgroundColor: user.avatar.hairColor }} 
            />
            
            <div 
              className={`w-36 h-36 rounded-[2.5rem] bg-gradient-to-b from-gray-800 to-gray-950 border-2 flex items-center justify-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ${isPhotoreal ? 'rounded-none border-gray-400' : 'border-oasis-cyan'}`}
              style={{ borderColor: user.avatar.hairColor }}
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
                     LOADOUT_SYNC
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 p-1 bg-white/[0.03] rounded-2xl border border-white/5 w-full max-w-[280px]">
             <button onClick={() => setView('MARKET')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'MARKET' ? 'bg-oasis-cyan text-black shadow-lg shadow-oasis-cyan/20' : 'text-gray-500 hover:text-gray-300'}`}>Market</button>
             <button onClick={() => setView('WARDROBE')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'WARDROBE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}>Wardrobe</button>
          </div>
        </section>

        {/* Content Area - THE SCROLLING FIX IS HERE */}
        <div className="flex-1 flex flex-col min-h-0 bg-black/20">
          {/* Category Tabs */}
          <div className="shrink-0 flex p-3 border-b border-white/5 bg-black/40 overflow-x-auto no-scrollbar gap-2">
            {(['Outfit', 'Accessory', 'Hair', 'Cybernetic'] as ItemCategory[]).map(cat => (
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

          {/* Scrollable Grid - min-h-0 allows this to scroll within its flex parent */}
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
                  const canAfford = user.credits >= item.price;

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

export default AvatarShop;
