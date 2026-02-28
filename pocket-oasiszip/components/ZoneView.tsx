
import React, { useState, useEffect, useRef } from 'react';
import { ZoneType, AppState, AdventureSession, AdventureMessage, CharacterStats, AdventureRewards, SubSystemType, AICompanion } from '../types';
import { startAdventure, continueAdventure, generateSpeech, stopSpeech } from '../services/geminiService';
import { ArrowLeft, MessageSquare, Shield, Zap, RefreshCw, Send, Mic, Play, PauseCircle, Terminal, HeartPulse, MoreVertical, Save, Power, AlertTriangle, X, Volume2, Square, Loader2, Map as MapIcon, Info, Sparkles } from 'lucide-react';

// Add global definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ZoneViewProps {
  zone: ZoneType;
  playerLevel: number;
  playerStats: CharacterStats;
  playerSubSystem?: SubSystemType;
  playerCompanion?: AICompanion;
  onBack: () => void;
  onCompleteQuest: (reward: number) => void;
  // We need a way to update the user state in the parent to save the adventure progress
  activeAdventure?: AdventureSession | null;
  onUpdateAdventure: (session: AdventureSession | null) => void;
  onAdventureReward: (rewards: AdventureRewards) => void; // New prop for generic rewards
  onAbortAdventure: (rewards: AdventureRewards) => void; // New prop for abort logic
}

const ZoneView: React.FC<ZoneViewProps> = ({ zone, playerLevel, playerStats, playerSubSystem, playerCompanion, onBack, onCompleteQuest, activeAdventure, onUpdateAdventure, onAdventureReward, onAbortAdventure }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [session, setSession] = useState<AdventureSession | null>(activeAdventure || null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  
  // Track accumulated rewards for this session to calculate penalties on abort
  const [sessionRewards, setSessionRewards] = useState<AdventureRewards>(activeAdventure?.accumulatedRewards || { xp: 0, credits: 0, items: [] });
  
  // TTS State
  const [playingMessageIdx, setPlayingMessageIdx] = useState<number | null>(null);
  const [isSpeechLoading, setIsSpeechLoading] = useState(false);

  // STT (Voice Input) State - Using specific statuses for better UI feedback
  const [micStatus, setMicStatus] = useState<'idle' | 'initializing' | 'listening' | 'error'>('idle');
  const recognitionRef = useRef<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Stop speech and recognition when unmounting
  useEffect(() => {
      return () => {
          stopSpeech();
          if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch(e) {}
          }
      }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.history, loading]);

  // Determine Zone Aesthetics
  const getZoneTheme = () => {
    switch (zone) {
      case ZoneType.SYNTHWAVE: return { 
        bg: "bg-gradient-to-b from-indigo-950 to-purple-900", 
        accent: "text-magenta-400", 
        border: "border-magenta-500/30",
        img: "https://picsum.photos/id/1067/800/800",
        font: "font-mono"
      };
      case ZoneType.FPS: return { 
        bg: "bg-slate-950", 
        accent: "text-orange-500", 
        border: "border-orange-500/30",
        img: "https://picsum.photos/id/75/800/800",
        font: "font-sans"
      };
      case ZoneType.MEDIEVAL: return { 
        bg: "bg-stone-950", 
        accent: "text-amber-500", 
        border: "border-amber-500/30",
        img: "https://picsum.photos/id/10/800/800",
        font: "font-serif"
      };
      default: return { 
        bg: "bg-black", 
        accent: "text-oasis-cyan", 
        border: "border-oasis-cyan/30",
        img: "https://picsum.photos/800/800",
        font: "font-mono"
      };
    }
  };
  const theme = getZoneTheme();

  // Initialize Adventure
  const handleStartAdventure = async () => {
    setLoading(true);
    try {
      const result = await startAdventure(zone, playerLevel, playerStats, playerSubSystem, playerCompanion);
      
      const newSession: AdventureSession = {
        zone: zone,
        isActive: true,
        integrity: 100,
        status: 'PLAYING',
        summary: result.summary,
        lastUpdated: Date.now(),
        mapHUD: result.mapHUD,
        missionBriefing: result.missionBriefing,
        history: [
          { sender: 'AI', text: result.narrative, timestamp: Date.now() },
          { sender: 'COMPANION', text: result.companionSuggestion || "Ready when you are.", timestamp: Date.now() }
        ],
        accumulatedRewards: { xp: 0, credits: 0, items: [] }
      };

      setSession(newSession);
      setSessionRewards({ xp: 0, credits: 0, items: [] });
      setShowBriefing(true);
      onUpdateAdventure(newSession);
    } catch (e) {
      console.error("Start adventure failed", e);
    } finally {
      setLoading(false);
    }
  };

  // Process Turn
  const handleSend = async () => {
    if (!input.trim() || !session || loading) return;
    
    // Stop any speech if user types/sends
    stopSpeech();
    setPlayingMessageIdx(null);
    if (micStatus === 'listening' || micStatus === 'initializing') {
        if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
        setMicStatus('idle');
    }

    const userMsg: AdventureMessage = { sender: 'USER', text: input, timestamp: Date.now() };
    const updatedHistory = [...session.history, userMsg];
    
    // Optimistic Update
    setSession({ ...session, history: updatedHistory });
    setInput('');
    setLoading(true);

    try {
      const result = await continueAdventure(zone, updatedHistory, session.summary, userMsg.text, playerStats, playerSubSystem, playerCompanion);
      
      let newIntegrity = Math.min(100, Math.max(0, session.integrity + result.integrityChange));
      let newStatus = result.status;

      // Hard check for integrity loss
      if (newIntegrity <= 0) {
          newStatus = 'LOST';
      }

      const aiMsg: AdventureMessage = { sender: 'AI', text: result.narrative, timestamp: Date.now() };
      const companionMsg: AdventureMessage = { sender: 'COMPANION', text: result.companionSuggestion || "", timestamp: Date.now() };
      
      const finalHistory = [...updatedHistory, aiMsg];
      if (result.companionSuggestion) {
          finalHistory.push(companionMsg);
      }

      // Handle Rewards (Loot/XP/Credits)
      if (result.rewards && (result.rewards.xp > 0 || result.rewards.credits > 0 || (result.rewards.items && result.rewards.items.length > 0))) {
          // Immediately apply rewards to user profile (standard gameplay loop)
          onAdventureReward(result.rewards);
          
          // Accumulate locally for potential abort reversal
          const updatedRewards = {
            xp: sessionRewards.xp + (result.rewards.xp || 0),
            credits: sessionRewards.credits + (result.rewards.credits || 0),
            items: [...sessionRewards.items, ...(result.rewards.items || [])]
          };
          setSessionRewards(updatedRewards);

          // Construct visual feedback for loot
          const lootParts = [];
          if (result.rewards.xp > 0) lootParts.push(`+${result.rewards.xp} XP`);
          if (result.rewards.credits > 0) lootParts.push(`+${result.rewards.credits} CR`);
          if (result.rewards.items && result.rewards.items.length > 0) lootParts.push(`Items: ${result.rewards.items.join(', ')}`);
          
          if (lootParts.length > 0) {
              finalHistory.push({ sender: 'SYSTEM', text: `OBTAINED: ${lootParts.join(' | ')}`, timestamp: Date.now() });
          }
      }

      // Handle Win/Loss system messages
      if (newStatus === 'WON') {
          finalHistory.push({ sender: 'SYSTEM', text: 'MISSION ACCOMPLISHED. REWARD: 300 CR.', timestamp: Date.now() });
          onCompleteQuest(300); // Trigger generic quest completion logic
      } else if (newStatus === 'LOST') {
          finalHistory.push({ sender: 'SYSTEM', text: 'CRITICAL FAILURE. SIMULATION TERMINATED.', timestamp: Date.now() });
      }

      const updatedSession: AdventureSession = {
          ...session,
          history: finalHistory,
          integrity: newIntegrity,
          status: newStatus as any,
          summary: result.summary,
          mapHUD: result.mapHUD || session.mapHUD,
          lastUpdated: Date.now(),
          isActive: newStatus === 'PLAYING',
          // Save the running total of rewards in the session state
          accumulatedRewards: {
             xp: sessionRewards.xp + (result.rewards.xp || 0),
             credits: sessionRewards.credits + (result.rewards.credits || 0),
             items: [...sessionRewards.items, ...(result.rewards.items || [])]
          }
      };

      setSession(updatedSession);
      // Persist the session (unless ended)
      onUpdateAdventure(newStatus === 'PLAYING' ? updatedSession : null); 
    } catch (e) {
      console.error("Adventure turn failed", e);
      // Fallback message so user isn't left hanging
      setSession(prev => prev ? ({
        ...prev,
        history: [...prev.history, { sender: 'SYSTEM', text: 'UPLINK ERROR. PLEASE RETRY.', timestamp: Date.now() }]
      }) : null);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    stopSpeech();
    onBack(); 
  };

  const handleSaveAndSuspend = () => {
      stopSpeech();
      if (session) {
          onUpdateAdventure({
              ...session,
              accumulatedRewards: sessionRewards
          });
      }
      onBack();
  };

  const handleAbort = () => {
      stopSpeech();
      onAbortAdventure(sessionRewards);
      setSession(null); 
      setShowMenu(false);
      onBack(); 
  };

  const handlePlaySpeech = async (idx: number, text: string) => {
      if (playingMessageIdx === idx) {
          stopSpeech();
          setPlayingMessageIdx(null);
          return;
      }
      
      setPlayingMessageIdx(idx);
      setIsSpeechLoading(true);
      try {
          await generateSpeech(text);
          setPlayingMessageIdx(null); // Reset icon when done
      } catch (e) {
          console.error("Playback error", e);
          setPlayingMessageIdx(null);
      } finally {
          setIsSpeechLoading(false);
      }
  };

  const toggleVoiceInput = () => {
    // If already active, stop it
    if (micStatus === 'listening' || micStatus === 'initializing') {
      if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch (e) { console.error(e); }
      }
      setMicStatus('idle');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    try {
        // Optimistic UI update to show something is happening
        setMicStatus('initializing');
        
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        // recognition.continuous = false; // Only one sentence at a time for this RPG style

        recognition.onstart = () => {
            console.log("Voice recognition started");
            setMicStatus('listening');
        };
        
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            console.log("Voice result:", text);
            setInput(prev => prev ? `${prev} ${text}` : text);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error:", event.error);
            setMicStatus('error');
            setTimeout(() => setMicStatus('idle'), 2000); // Reset after showing error state
            
            if (event.error === 'not-allowed') {
                alert("Microphone access blocked. Please enable permissions in your settings.");
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors, just stop listening state
            } else {
                // console.log(`Voice Error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            console.log("Voice recognition ended");
            // If we weren't in error state, go back to idle
            setMicStatus(prev => prev === 'error' ? 'error' : 'idle');
        };

        recognitionRef.current = recognition;
        recognition.start();
    } catch (e) {
        console.error("Failed to initialize speech recognition", e);
        setMicStatus('error');
        alert("Failed to initialize voice input.");
    }
  };

  // Render Start Screen if no session
  if (!session) {
    return (
      <div className={`flex flex-col h-full w-full ${theme.bg} relative overflow-hidden`}>
         <div className="absolute inset-0 opacity-40">
             <img src={theme.img} className="w-full h-full object-cover blur-sm scale-110" />
             <div className="absolute inset-0 bg-black/60" />
         </div>
         
         <div className="relative z-10 flex flex-col h-full">
            <header className="p-6 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full text-white"><ArrowLeft /></button>
                <div className="text-right">
                    <h1 className={`text-2xl font-black italic uppercase tracking-tighter ${theme.accent}`}>{zone}</h1>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.3em]">Simulation Ready</p>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                <div className={`w-32 h-32 rounded-full border-4 ${theme.border} flex items-center justify-center bg-black/50 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
                    <Terminal size={48} className={theme.accent} />
                </div>
                
                <div className="max-w-xs">
                    <h2 className="text-white font-bold text-lg mb-2">Initialize Narrative Protocol</h2>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        Enter a generative, text-based simulation. Your choices determine the outcome. 
                        The Neural Architect will adapt to your actions in real-time. 
                        <br/><br/>
                        <span className="text-red-400">Warning: Decisions have consequences.</span>
                    </p>
                </div>

                <button 
                    onClick={handleStartAdventure}
                    disabled={loading}
                    className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all active:scale-95 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-xl'}`}
                >
                    {loading ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}
                    {loading ? 'GENERATING...' : 'START SIMULATION'}
                </button>
            </div>
         </div>
      </div>
    );
  }

  // Render Adventure Interface
  return (
    <div className={`flex flex-col h-full w-full bg-black text-white relative`}>
       {/* Ambient Background Layer */}
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src={theme.img} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent`} />
       </div>

       {/* Header */}
       <header className={`relative z-20 p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md`}>
          <div className="flex items-center gap-3">
             <button onClick={handleLeave} className="p-2 hover:bg-white/10 rounded-full text-gray-400"><ArrowLeft size={20}/></button>
             <div className="flex flex-col">
                <span className={`text-sm font-black uppercase italic tracking-tight ${theme.accent}`}>{zone}</span>
                <div className="flex items-center gap-2">
                    <MapIcon size={10} className="text-oasis-cyan" />
                    <span className="text-[8px] text-oasis-cyan font-mono uppercase tracking-widest">{session.mapHUD || 'Unknown Sector'}</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowBriefing(true)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400"
                title="Mission Briefing"
            >
                <Info size={20} />
            </button>

            {/* Integrity Meter */}
            <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1">
                   <HeartPulse size={10} className={session.integrity < 30 ? "text-red-500 animate-pulse" : "text-green-500"} /> Integrity
                </span>
                <div className="w-20 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                   <div 
                      className={`h-full transition-all duration-500 ${session.integrity > 60 ? 'bg-green-500' : session.integrity > 30 ? 'bg-yellow-500' : 'bg-red-600'}`} 
                      style={{ width: `${session.integrity}%` }}
                   />
                </div>
            </div>

            {/* System Menu Button */}
            <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors relative"
            >
                <MoreVertical size={20} />
            </button>
          </div>
       </header>

       {/* Mission Briefing Overlay */}
       {showBriefing && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
               <div className="bg-[#0a0a12] border border-white/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-oasis-cyan to-magenta-500" />
                   <h3 className="text-oasis-cyan font-black italic uppercase tracking-tighter text-xl mb-4 flex items-center gap-2">
                       <Terminal size={20} /> Mission Briefing
                   </h3>
                   <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-mono">
                       {session.missionBriefing?.split('\n').map((line, i) => (
                           <p key={i}>{line}</p>
                       )) || "No briefing available."}
                   </div>
                   <button 
                       onClick={() => setShowBriefing(false)}
                       className="mt-8 w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-oasis-cyan transition-colors"
                   >
                       Acknowledge
                   </button>
               </div>
           </div>
       )}

       {/* System Menu Overlay */}
       {showMenu && (
           <>
            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowMenu(false)} />
            <div className="absolute top-16 right-4 z-50 bg-[#12121a] border border-white/20 rounded-2xl shadow-2xl w-56 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-white/10 bg-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Controls</span>
                </div>
                <div className="p-2 flex flex-col gap-1">
                    <button 
                        onClick={handleSaveAndSuspend}
                        className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl text-left transition-colors group"
                    >
                        <div className="p-1.5 bg-green-500/20 text-green-400 rounded-lg group-hover:text-green-300"><Save size={16} /></div>
                        <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">Save & Exit</div>
                            <div className="text-[8px] text-gray-500">Suspend simulation state</div>
                        </div>
                    </button>

                    <button 
                        onClick={() => { 
                           if(confirm("WARNING: Aborting will forfeit ALL credits, XP, and items gained in this session, plus a 50 CR penalty. Proceed?")) {
                               handleAbort(); 
                           }
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl text-left transition-colors group"
                    >
                        <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg group-hover:text-red-300"><Power size={16} /></div>
                        <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">Abort Mission</div>
                            <div className="text-[8px] text-gray-500 text-red-400/80">Loss of gains + Penalty</div>
                        </div>
                    </button>
                </div>
            </div>
           </>
       )}

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10" ref={scrollRef}>
          {session.history.map((msg, idx) => {
              if (msg.sender === 'SYSTEM') {
                  return (
                      <div key={idx} className="flex justify-center my-4">
                          <span className={`text-[10px] font-mono border px-3 py-1 rounded-full uppercase tracking-widest ${msg.text.includes('FAILURE') ? 'border-red-500/50 text-red-400 bg-red-900/20' : 'border-green-500/50 text-green-400 bg-green-900/20'}`}>
                             {msg.text}
                          </span>
                      </div>
                  );
              }

              const isUser = msg.sender === 'USER';
              const isCompanion = msg.sender === 'COMPANION';
              const isPlaying = playingMessageIdx === idx;

              if (isCompanion) {
                  return (
                      <div key={idx} className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                          <div className="flex items-start gap-2 max-w-[80%] bg-oasis-cyan/5 border border-oasis-cyan/20 p-3 rounded-2xl rounded-tl-sm">
                              <Sparkles size={14} className="text-oasis-cyan shrink-0 mt-1" />
                              <div className="flex flex-col">
                                  <span className="text-[8px] font-black uppercase text-oasis-cyan tracking-widest mb-1">{playerCompanion?.name || 'AIDA'} Suggestion</span>
                                  <p className="text-xs italic text-oasis-cyan/80">{msg.text}</p>
                              </div>
                          </div>
                      </div>
                  );
              }

              return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className="flex items-end gap-2 max-w-[85%]">
                        {!isUser && (
                           <button 
                               onClick={() => handlePlaySpeech(idx, msg.text)}
                               disabled={isSpeechLoading && !isPlaying}
                               className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-oasis-cyan text-black animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                           >
                               {isPlaying ? <Square size={14} fill="currentColor"/> : (isSpeechLoading && playingMessageIdx === idx) ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                           </button>
                        )}
                        <div 
                            className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                                isUser 
                                ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' 
                                : `bg-black/60 backdrop-blur-md ${theme.border} border rounded-tl-sm ${theme.accent} ${theme.font}`
                            }`}
                        >
                            {!isUser && <div className="text-[8px] opacity-50 font-black uppercase tracking-widest mb-2">Neural Architect</div>}
                            {msg.text}
                        </div>
                      </div>
                  </div>
              );
          })}
          {loading && (
             <div className="flex justify-start">
                <div className={`px-4 py-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-2`}>
                   <RefreshCw size={14} className={`animate-spin ${theme.accent}`} />
                   <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Generating Outcome...</span>
                </div>
             </div>
          )}
          {session.status !== 'PLAYING' && (
             <div className="p-8 flex flex-col items-center justify-center opacity-50">
                <div className="w-16 h-0.5 bg-white/20 mb-4" />
                <p className="text-xs text-gray-500 uppercase tracking-widest">End of Line</p>
                {/* Option to clear session after end */}
                <button onClick={() => { onUpdateAdventure(null); onBack(); }} className="mt-4 px-4 py-2 bg-white/10 rounded-full text-[10px] uppercase font-bold hover:bg-white/20">
                    Close Terminal
                </button>
             </div>
          )}
       </div>

       {/* Input Area */}
       {session.status === 'PLAYING' && (
           <div className="relative z-20 p-3 bg-black/90 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
              <div className="flex gap-2">
                 <button 
                     onClick={toggleVoiceInput}
                     disabled={loading}
                     className={`p-3 rounded-full transition-all border border-transparent ${
                         micStatus === 'initializing' ? 'bg-yellow-500/20 text-yellow-500 animate-pulse border-yellow-500/50' :
                         micStatus === 'listening' ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500' :
                         micStatus === 'error' ? 'bg-red-900/50 text-red-500 border-red-500' :
                         'bg-white/5 text-gray-400 hover:text-white'
                     }`}
                 >
                    {micStatus === 'listening' ? <Square size={20} fill="currentColor" /> : 
                     micStatus === 'initializing' ? <Loader2 size={20} className="animate-spin" /> : 
                     micStatus === 'error' ? <AlertTriangle size={20} /> :
                     <Mic size={20} />}
                 </button>
                 <div className="flex-1 relative">
                    <input 
                       type="text" 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                       placeholder={
                           micStatus === 'listening' ? "Listening..." : 
                           micStatus === 'initializing' ? "Initializing..." :
                           "What do you do?"
                       }
                       disabled={loading}
                       className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:border-oasis-cyan outline-none transition-all placeholder:text-gray-600"
                       autoFocus
                    />
                    <button 
                       onClick={handleSend}
                       disabled={!input.trim() || loading}
                       className={`absolute right-1 top-1 p-2 rounded-full transition-all ${!input.trim() ? 'text-gray-600' : 'bg-oasis-cyan text-black hover:scale-105'}`}
                    >
                       <Send size={18} />
                    </button>
                 </div>
              </div>
           </div>
       )}
    </div>
  );
};

export default ZoneView;
