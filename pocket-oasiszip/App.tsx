
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserProfile, ZoneType, ShopItem, ActivityLogItem, Notification, CalendarEvent, AdventureSession, AdventureRewards } from './types';
import AvatarCreator from './components/AvatarCreator';
import Hub from './components/Hub';
import ZoneView from './components/ZoneView';
import JobMinigame from './components/JobMinigame';
import AvatarShop, { SHOP_ITEMS } from './components/AvatarShop';
import ArcadeView from './components/ArcadeView';
import SocialView from './components/SocialView';
import SettingsView from './components/SettingsView';
import CalendarView from './components/CalendarView';
import GuideView from './components/GuideView';
import { Gift, Flame, Sparkles, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentZone, setCurrentZone] = useState<ZoneType | null>(null);
  const [dailyReward, setDailyReward] = useState<{amount: number, streak: number} | null>(null);

  const notifTimeout = useRef<number>(0);

  useEffect(() => {
    const savedUserStr = localStorage.getItem('oasis_user');
    if (savedUserStr) {
      let savedUser: UserProfile = JSON.parse(savedUserStr);
      // Migration & Defaults
      if (savedUser.isSubscriber === undefined) savedUser.isSubscriber = false;
      if (!savedUser.stepGoal) savedUser.stepGoal = 10000;
      if (savedUser.currentSteps === undefined) savedUser.currentSteps = 4231;
      if (!savedUser.dailyXPGoal) savedUser.dailyXPGoal = 100;
      if (!savedUser.preferences) savedUser.preferences = { notifications: true, haptics: true, stealth: false, animations: true, unitSystem: 'Metric', timeFormat: '24h', locationSync: false };
      if (!savedUser.preferences.unitSystem) savedUser.preferences.unitSystem = 'Metric';
      if (!savedUser.preferences.timeFormat) savedUser.preferences.timeFormat = '24h';
      if (!savedUser.miningStats) savedUser.miningStats = { level: 1, lastCollected: Date.now(), lastUpgradeTime: 0 };
      if (!savedUser.calendarEvents) savedUser.calendarEvents = [];
      if (!savedUser.temporaryZoneAccess) savedUser.temporaryZoneAccess = {};
      if (!savedUser.activeAdventure) savedUser.activeAdventure = null;
      // New RPG Stats Migration
      if (!savedUser.stats) {
        savedUser.stats = {
          neuralProcessing: 10,
          synapticSpeed: 10,
          systemIntegrity: 10,
          digitalPresence: 10
        };
        savedUser.availableStatPoints = 0;
      }
      // Subsystem Migration
      if (!savedUser.subSystem) {
        savedUser.subSystem = 'OPERATOR';
      }
      // Neural Module Migration
      if (!savedUser.avatar.equippedModules) {
          savedUser.avatar.equippedModules = [];
      }
      // Inventory Capacity Migration
      if (!savedUser.inventoryCapacity) {
          savedUser.inventoryCapacity = 5;
      }

      setUser(savedUser);
      setAppState(AppState.HUB);
      checkDailyLogin(savedUser);
    }
    startNotificationLoop();
    return () => { if (notifTimeout.current) window.clearTimeout(notifTimeout.current); }
  }, []);

  const saveUser = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('oasis_user', JSON.stringify(u));
  };

  const logActivity = (description: string, xpEarned: number, creditsEarned: number = 0, itemsFound: string[] = [], integrityLost: number = 0) => {
    if (!user) return;
    const now = new Date();
    const newLog: ActivityLogItem = {
      id: crypto.randomUUID(),
      timestamp: now.getTime(),
      dateString: now.toDateString(),
      description,
      xpEarned,
      creditsEarned,
      itemsFound,
      integrityLost
    };
    const newHistory = [newLog, ...user.history].slice(0, 100);
    const updatedUser = { ...user, history: newHistory };
    saveUser(updatedUser);
  };

  const handleAdventureReward = (rewards: AdventureRewards) => {
      if (!user) return;

      // 1. Add Credits
      let newCredits = user.credits + (rewards.credits || 0);

      // 2. Add Items (if space)
      if (rewards.items && rewards.items.length > 0) {
          const junkValue = 10;
          newCredits += rewards.items.length * junkValue;
      }

      // Update User
      const updatedUser = { 
          ...user, 
          credits: newCredits 
      };
      saveUser(updatedUser);
      
      // Log it
      logActivity(`Adventure Yield`, rewards.xp, rewards.credits, rewards.items);
      
      // Trigger Level Up check if XP was high
      if (rewards.xp >= 50) {
          handleQuestComplete(0); // 0 extra credits, just trigger level logic
      }
  };

  const handleAbortAdventure = (accumulatedRewards: AdventureRewards) => {
    if (!user) return;

    // Calculate total gained value to reverse
    const junkValue = 10;
    const totalCreditGain = accumulatedRewards.credits + (accumulatedRewards.items.length * junkValue);
    const ABORT_PENALTY = 50;
    const totalDeduction = totalCreditGain + ABORT_PENALTY;

    const newCredits = Math.max(0, user.credits - totalDeduction);

    saveUser({
      ...user,
      credits: newCredits,
      activeAdventure: null
    });

    logActivity(`Mission Aborted`, 0, -totalDeduction, [], 20);
  };

  const handleClearNotifications = () => {
    if (!user) return;
    saveUser({ ...user, notifications: [] });
  };

  const handleReadNotification = (id: string) => {
    if (!user) return;
    const updatedNotifs = user.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveUser({ ...user, notifications: updatedNotifs });
  };

  const handleToggleTimeFormat = () => {
    if (!user) return;
    const nextFormat = user.preferences.timeFormat === '12h' ? '24h' : '12h';
    saveUser({
      ...user,
      preferences: { ...user.preferences, timeFormat: nextFormat }
    });
    logActivity(`Clock format set to ${nextFormat}`, 0);
  };

  const handlePurchasePass = (zone: ZoneType) => {
    if (!user || user.credits < 150) return;
    const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 Hours
    const updatedAccess = { ...(user.temporaryZoneAccess || {}), [zone]: expiry };
    saveUser({
      ...user,
      credits: user.credits - 150,
      temporaryZoneAccess: updatedAccess
    });
    logActivity(`Access Pass: ${zone}`, 15, -150);
  };

  const handleAddCalendarEvent = (event: CalendarEvent) => {
    if (!user) return;
    saveUser({
      ...user,
      calendarEvents: [...user.calendarEvents, event]
    });
    logActivity(`Sync Goal Set: ${event.title}`, 10);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    if (!user) return;
    saveUser({
      ...user,
      calendarEvents: user.calendarEvents.filter(e => e.id !== id)
    });
  };

  const handleUpdateAdventure = (session: AdventureSession | null) => {
    if (!user) return;
    saveUser({
        ...user,
        activeAdventure: session
    });
  };

  const startNotificationLoop = () => {
    const loop = () => {
      const delay = Math.random() * 60000 + 45000;
      notifTimeout.current = window.setTimeout(() => {
        const currentUserStr = localStorage.getItem('oasis_user');
        if (!currentUserStr) return;
        const u: UserProfile = JSON.parse(currentUserStr);

        const events = [
            { t: 'QUEST', title: 'New Bounty', msg: 'A glitch detected in Synthwave Coast.' },
            { t: 'SOCIAL', title: 'Friend Request', msg: 'MarsMiner2099 wants to connect.' },
            { t: 'SYSTEM', title: 'Sync Alert', msg: 'Neural Sync data successfully uploaded.' },
            { t: 'SYSTEM', title: 'Incoming Bonus', msg: `Login tomorrow for Day ${u.dailyStreak + 1} rewards!` }
        ];

        const COOLDOWN = 24 * 60 * 60 * 1000;
        if (Date.now() - (u.miningStats?.lastUpgradeTime || 0) >= COOLDOWN) {
            events.push({ t: 'SYSTEM', title: 'Hardware Alert', msg: 'Neural Cluster upgrade protocol is now READY.' });
        }
        
        const evt = events[Math.floor(Math.random() * events.length)];
        const newNotif: Notification = {
          id: crypto.randomUUID(),
          title: evt.title,
          message: evt.msg,
          read: false,
          timestamp: Date.now(),
          type: evt.t as any
        };
        const updatedUser = { ...u, notifications: [newNotif, ...u.notifications] };
        localStorage.setItem('oasis_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        loop();
      }, delay);
    };
    loop();
  };

  const checkDailyLogin = (u: UserProfile) => {
    const today = new Date().toISOString().split('T')[0];
    if (u.lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = 1;
        if (u.lastLoginDate === yesterdayStr) {
          newStreak = u.dailyStreak + 1;
        } else if (u.dailyStreak > 0) {
           newStreak = 1;
        }
        
        const rewardAmount = 50 + (newStreak * 15);
        const updatedUser = { 
          ...u, 
          lastLoginDate: today, 
          dailyStreak: newStreak, 
          credits: u.credits + rewardAmount, 
          currentSteps: 0 
        };
        
        saveUser(updatedUser);
        setDailyReward({amount: rewardAmount, streak: newStreak});
        logActivity(`Daily Login Streak: Day ${newStreak}`, 25, rewardAmount);
    }
  };

  const handleAvatarCreated = (profile: UserProfile) => {
    saveUser(profile);
    setAppState(AppState.HUB);
    logActivity('Neural Link Established', 50, 250);
  };

  const handleEnterZone = (zone: ZoneType) => {
    setCurrentZone(zone);
    setAppState(AppState.ZONE);
    logActivity(`Entered ${zone}`, 5);
  };

  const handleBackToHub = () => {
    setCurrentZone(null);
    setAppState(AppState.HUB);
  };

  const handleReward = (earnings: number) => {
    if (user) {
        saveUser({ ...user, credits: user.credits + earnings });
        logActivity('Arcade Win', 5, earnings);
    }
  };

  const handleQuestComplete = (reward: number) => {
     if (user) {
      const newLevel = Math.floor((user.completedQuests + 1) / 3) + 1;
      const leveledUp = newLevel > user.level;
      
      const updatedUser = { 
        ...user, 
        credits: user.credits + reward, 
        completedQuests: user.completedQuests + 1,
        level: newLevel,
        availableStatPoints: leveledUp ? (user.availableStatPoints || 0) + 1 : (user.availableStatPoints || 0)
      };
      
      saveUser(updatedUser);
      logActivity(`Quest Completed${leveledUp ? ' - LEVEL UP!' : ''}`, 50, reward);
    }
  };

  const handleUpdateUsername = (newName: string) => {
    if (user && user.credits >= 500) {
      saveUser({
        ...user,
        credits: user.credits - 500,
        avatar: { ...user.avatar, name: newName }
      });
      logActivity(`ID Modified to ${newName}`, 0, -500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('oasis_user');
    setUser(null);
    setAppState(AppState.ONBOARDING);
  };

  let content = null;
  switch (appState) {
    case AppState.ONBOARDING:
      content = <AvatarCreator onComplete={handleAvatarCreated} onOpenGuide={() => setAppState(AppState.GUIDE)} />;
      break;
    case AppState.ZONE:
      if (!currentZone || !user) break;
      content = <ZoneView 
        zone={currentZone} 
        playerLevel={user.level}
        playerStats={user.stats || { neuralProcessing: 10, synapticSpeed: 10, systemIntegrity: 10, digitalPresence: 10 }}
        playerSubSystem={user.subSystem}
        playerCompanion={user.companion}
        onBack={handleBackToHub} 
        onCompleteQuest={handleQuestComplete}
        activeAdventure={user.activeAdventure && user.activeAdventure.zone === currentZone ? user.activeAdventure : null}
        onUpdateAdventure={handleUpdateAdventure}
        onAdventureReward={handleAdventureReward}
        onAbortAdventure={handleAbortAdventure}
      />;
      break;
    case AppState.JOB:
      if (!user) break;
      content = <JobMinigame user={user} onUpdateUser={(u) => saveUser(u)} onLogActivity={logActivity} onExit={() => setAppState(AppState.HUB)} />;
      break;
    case AppState.SHOP:
      if (!user) break;
      content = <AvatarShop 
        user={user} 
        onClose={handleBackToHub} 
        onBuy={(item) => {
          if (user.credits >= item.price && !user.inventory.includes(item.id)) {
              saveUser({ ...user, credits: user.credits - item.price, inventory: [...user.inventory, item.id] });
              logActivity(`Market Purchase: ${item.name}`, 10, -item.price);
          }
        }} 
        onEquip={(item) => {
          // Check for special Stat/Subsystem update payload
          if (item.category === 'STAT_UPDATE' as any) {
              const payload = item.value as any;
              const cost = payload.cost || 0;
              
              if (user.credits < cost) return;

              saveUser({ 
                  ...user, 
                  stats: payload.stats, 
                  subSystem: payload.subSystem,
                  credits: user.credits - cost 
              });
              
              if (cost > 0) logActivity(`System Retrain`, 0, -cost);
              else logActivity(`Neural Configuration Updated`, 0);
          } else {
              // Standard item equip logic
              const updatedAvatar = { ...user.avatar };
              if (item.category === 'Outfit') updatedAvatar.outfit = item.value as string;
              else if (item.category === 'Accessory') updatedAvatar.accessory = item.value as string;
              else if (item.category === 'Cybernetic') updatedAvatar.cybernetics = item.value as number;
              
              if (item.category === 'NeuralModule') {
                  const currentMods = user.avatar.equippedModules || [];
                  const isEquipped = currentMods.includes(item.value as string);
                  let newMods;
                  if (isEquipped) {
                      newMods = currentMods.filter(m => m !== item.value);
                  } else {
                      newMods = [...currentMods, item.value as string];
                  }
                  saveUser({ 
                      ...user, 
                      avatar: { ...user.avatar, equippedModules: newMods } 
                  });
                  logActivity(`${isEquipped ? 'Removed' : 'Equipped'} ${item.name}`, 0);
              } else {
                  saveUser({ ...user, avatar: updatedAvatar });
                  logActivity(`Equipped ${item.name}`, 0);
              }
          }
        }} 
      />;
      break;
    case AppState.ARCADE:
      content = <ArcadeView onBack={handleBackToHub} onReward={handleReward} />;
      break;
    case AppState.SOCIAL:
      if (!user) break;
      content = <SocialView user={user} onBack={handleBackToHub} onLogActivity={logActivity} />;
      break;
    case AppState.SETTINGS:
      if (!user) break;
      content = <SettingsView 
        user={user} 
        onSave={(u) => { saveUser(u); }} 
        onBack={() => setAppState(AppState.HUB)} 
        onUpdateUsername={handleUpdateUsername}
        onLogout={handleLogout}
      />;
      break;
    case AppState.CALENDAR:
      if (!user) break;
      content = <CalendarView user={user} onBack={handleBackToHub} onAddEvent={handleAddCalendarEvent} onDeleteEvent={handleDeleteCalendarEvent} />;
      break;
    case AppState.GUIDE:
      content = <GuideView onBack={() => {
          // If we have a user, go to HUB. Otherwise, go to ONBOARDING
          if (user) setAppState(AppState.HUB);
          else setAppState(AppState.ONBOARDING);
      }} />;
      break;
    case AppState.HUB:
    default:
      if (!user) { content = <AvatarCreator onComplete={handleAvatarCreated} onOpenGuide={() => setAppState(AppState.GUIDE)} />; break; }
      content = <Hub 
        user={user} 
        onEnterZone={handleEnterZone} 
        onOpenJob={() => setAppState(AppState.JOB)} 
        onOpenShop={() => setAppState(AppState.SHOP)} 
        onOpenArcade={() => setAppState(AppState.ARCADE)} 
        onOpenSocial={() => setAppState(AppState.SOCIAL)} 
        onOpenSettings={() => setAppState(AppState.SETTINGS)} 
        onOpenCalendar={() => setAppState(AppState.CALENDAR)}
        onOpenGuide={() => setAppState(AppState.GUIDE)}
        onLogout={handleLogout} 
        onClearNotifications={handleClearNotifications} 
        onReadNotification={handleReadNotification}
        onSetXPGoal={(g) => saveUser({...user, dailyXPGoal: g})} 
        onToggleTimeFormat={handleToggleTimeFormat}
        onPurchasePass={handlePurchasePass}
      />;
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-[#0c0c14]">
      {content}
      {dailyReward !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500 p-6">
           <div className="bg-[#12121a] border border-white/20 rounded-[3.5rem] p-12 max-w-sm w-full text-center shadow-[0_30px_120px_rgba(234,179,8,0.4)] relative overflow-hidden group">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-500/20 blur-[100px] rounded-full group-hover:bg-yellow-500/30 transition-all duration-1000" />
              
              <div className="relative z-10">
                <div className="w-28 h-28 mx-auto bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-yellow-900/50 rotate-6 animate-bounce">
                  <Gift size={48} className="text-black" />
                </div>
                
                <h2 className="text-4xl font-black text-white mb-3 italic tracking-tighter uppercase leading-none">Loyalty Sync</h2>
                <p className="text-gray-400 text-[11px] mb-10 font-mono uppercase tracking-[0.4em]">Neural Connection Verified</p>

                <div className="space-y-10 mb-12">
                  <div className="flex flex-col items-center">
                    <div className="text-7xl font-black text-yellow-400 mb-2 flex items-center gap-3 italic drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                       {dailyReward.amount} <span className="text-2xl text-yellow-600/80 not-italic uppercase font-mono tracking-normal ml-1">CR</span>
                    </div>
                    <div className="text-[11px] text-gray-300 font-black uppercase tracking-[0.3em]">Protocol Yield Distributed</div>
                  </div>

                  <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 shadow-inner">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-2.5 text-orange-400 font-black text-xs uppercase tracking-widest">
                        <Flame size={18} fill="currentColor" /> Link Streak: {dailyReward.streak}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono tracking-tighter">Next Milestone: Day {dailyReward.streak + 1}</div>
                    </div>
                    <div className="flex gap-2.5">
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <div 
                          key={d} 
                          className={`flex-1 h-3 rounded-full transition-all duration-1000 ${
                            d <= (dailyReward.streak % 7 || 7) 
                              ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,1)]' 
                              : 'bg-white/10'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setDailyReward(null)} 
                  className="w-full bg-yellow-500 hover:bg-white text-black font-black py-6 rounded-[2rem] shadow-2xl shadow-yellow-600/40 flex items-center justify-center gap-3 transition-all active:scale-95 text-sm uppercase tracking-widest"
                >
                  ESTABLISH UPLINK <ChevronRight size={22} />
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
