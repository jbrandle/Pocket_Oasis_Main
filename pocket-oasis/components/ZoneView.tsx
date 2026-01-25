import React, { useState, useEffect } from 'react';
import { ZoneType, Quest, AppState } from '../types';
import { generateQuest, generateNPCResponse } from '../services/geminiService';
import { ArrowLeft, MessageSquare, Shield, Zap, RefreshCw } from 'lucide-react';

interface ZoneViewProps {
  zone: ZoneType;
  playerLevel: number;
  onBack: () => void;
  onCompleteQuest: (reward: number) => void;
}

const ZoneView: React.FC<ZoneViewProps> = ({ zone, playerLevel, onBack, onCompleteQuest }) => {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState<{sender: string, text: string}[]>([]);
  const [input, setInput] = useState('');

  // Zone specific aesthetics
  const getZoneStyle = () => {
    switch (zone) {
      case ZoneType.MEDIEVAL: return { bg: "bg-stone-900", accent: "text-amber-500", img: "https://picsum.photos/id/10/800/600" }; // Forest/Dark
      case ZoneType.FPS: return { bg: "bg-slate-900", accent: "text-red-500", img: "https://picsum.photos/id/75/800/600" }; // Tech
      case ZoneType.CHILL: return { bg: "bg-teal-950", accent: "text-teal-300", img: "https://picsum.photos/id/54/800/600" }; // Nature
      default: return { bg: "bg-black", accent: "text-white", img: "https://picsum.photos/800/600" };
    }
  };

  const style = getZoneStyle();

  const handleGenerateQuest = async () => {
    setLoading(true);
    const newQuest = await generateQuest(zone, playerLevel);
    setQuest(newQuest);
    setLoading(false);
    
    // Initial NPC message
    setChatLog(prev => [...prev, { sender: 'System', text: `Entered ${zone}. Quest Uplink Established.` }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    setChatLog(prev => [...prev, { sender: 'You', text: msg }]);
    
    // Simulate NPC response in the context of the zone/quest
    const context = quest ? `Current Quest: ${quest.title} - ${quest.objective}` : `Wandering the ${zone}`;
    const response = await generateNPCResponse(zone, msg, context);
    setChatLog(prev => [...prev, { sender: 'Guide', text: response }]);
  };

  const handleCompleteQuest = () => {
    if (quest) {
      onCompleteQuest(quest.reward);
      setQuest(null);
      setChatLog(prev => [...prev, { sender: 'System', text: `Quest Completed! Received ${quest.reward} credits.` }]);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${style.bg} text-white relative`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
         <img src={style.img} alt={zone} className="w-full h-full object-cover opacity-30" />
         <div className={`absolute inset-0 bg-gradient-to-t from-${style.bg.replace('bg-', '')} to-transparent`}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center p-4 bg-black/40 backdrop-blur-md border-b border-white/10">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-bold ${style.accent} uppercase tracking-widest`}>{zone}</h1>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Quest Card */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-4 backdrop-blur-md shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center h-24 text-gray-400 animate-pulse">
              <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
              Generating procedural quest...
            </div>
          ) : quest ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start mb-2">
                <h2 className={`text-lg font-bold ${style.accent}`}>{quest.title}</h2>
                <span className="text-xs px-2 py-1 bg-white/10 rounded border border-white/20">{quest.difficulty}</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">{quest.description}</p>
              <div className="flex items-center gap-2 mb-4 text-sm text-green-400">
                <Shield className="w-4 h-4" />
                <span>Objective: {quest.objective}</span>
              </div>
              <button 
                onClick={handleCompleteQuest}
                className={`w-full py-3 rounded-lg font-bold bg-opacity-80 hover:bg-opacity-100 transition-all flex items-center justify-center gap-2 ${zone === ZoneType.FPS ? 'bg-red-600' : 'bg-blue-600'}`}
              >
                <Zap className="w-4 h-4" /> COMPLETE ({quest.reward} CR)
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No active quest uplink.</p>
              <button 
                onClick={handleGenerateQuest}
                className={`px-6 py-2 rounded-full border border-${style.accent.replace('text-', '')} ${style.accent} hover:bg-white/10 transition`}
              >
                Scan for Adventure
              </button>
            </div>
          )}
        </div>

        {/* Chat / Log */}
        <div className="flex-1 min-h-[200px] flex flex-col justify-end">
          <div className="space-y-3 mb-4">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'You' ? 'bg-blue-600/50' : 'bg-gray-800/80 border border-gray-700'}`}>
                  <span className="text-xs opacity-50 block mb-1 font-mono">{msg.sender}</span>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 bg-black/80 backdrop-blur-md border-t border-white/10 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to NPCs..." 
          className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 text-sm focus:outline-none focus:border-white/50"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ZoneView;