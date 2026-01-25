import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Users, Globe, MessageCircle, Send, Plus, Circle } from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';

interface SocialViewProps {
  user: UserProfile;
  onBack: () => void;
  onLogActivity: (desc: string, xp: number) => void;
}

type Tab = 'FRIENDS' | 'FORUM';

// Mock Data
const MOCK_FRIENDS = [
  { id: 'f1', name: 'CyberWolf', status: 'online', avatar: 'https://picsum.photos/id/237/50/50' },
  { id: 'f2', name: 'NeonRider', status: 'offline', avatar: 'https://picsum.photos/id/100/50/50' },
  { id: 'f3', name: 'PixelMage', status: 'busy', avatar: 'https://picsum.photos/id/1025/50/50' },
];

const MOCK_FORUM_POSTS: ChatMessage[] = [
  { id: 'p1', sender: 'Admin_Zero', text: 'Welcome to the OASIS Public Nexus. Be civil.', timestamp: Date.now() - 100000, isSystem: true },
  { id: 'p2', sender: 'GlitchHunter', text: 'Anyone want to raid the Medieval zone boss?', timestamp: Date.now() - 50000 },
  { id: 'p3', sender: 'TraderJoe', text: 'Selling Rare Plasma Wings! DM me.', timestamp: Date.now() - 20000 },
];

const SocialView: React.FC<SocialViewProps> = ({ user, onBack, onLogActivity }) => {
  const [activeTab, setActiveTab] = useState<Tab>('FORUM');
  const [forumPosts, setForumPosts] = useState<ChatMessage[]>(MOCK_FORUM_POSTS);
  const [input, setInput] = useState('');
  const [activeDM, setActiveDM] = useState<string | null>(null); // Friend ID
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [forumPosts, activeDM]);

  const handlePost = () => {
    if (!input.trim()) return;

    if (activeTab === 'FORUM') {
      const newPost: ChatMessage = {
        id: crypto.randomUUID(),
        sender: user.avatar.name,
        text: input,
        timestamp: Date.now(),
        avatar: 'user'
      };
      setForumPosts([...forumPosts, newPost]);
      onLogActivity('Posted in Public Nexus', 5);
      
      // Simulate reply
      setTimeout(() => {
        setForumPosts(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'AutoMod_Bot',
          text: 'Message received. +5 Social Credit.',
          timestamp: Date.now(),
          isSystem: true
        }]);
      }, 2000);
    } else if (activeDM) {
        // DM Logic (Visual only for prototype)
        alert(`Sent to ${MOCK_FRIENDS.find(f => f.id === activeDM)?.name}: "${input}"`);
    }

    setInput('');
  };

  const renderStatus = (status: string) => {
    const color = status === 'online' ? 'bg-green-500' : status === 'busy' ? 'bg-red-500' : 'bg-gray-500';
    return <div className={`w-2 h-2 rounded-full ${color}`} />;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-widest text-green-400 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> COMMS_LINK
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-black/20">
        <button 
          onClick={() => { setActiveTab('FORUM'); setActiveDM(null); }}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${activeTab === 'FORUM' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500'}`}
        >
          <Globe size={18} /> NEXUS (PUBLIC)
        </button>
        <button 
          onClick={() => setActiveTab('FRIENDS')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${activeTab === 'FRIENDS' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
        >
          <Users size={18} /> CONTACTS
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* Forum View */}
        {activeTab === 'FORUM' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {forumPosts.map(post => (
                <div key={post.id} className={`flex gap-3 ${post.sender === user.avatar.name ? 'flex-row-reverse' : ''}`}>
                  {!post.isSystem && (
                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                       {post.sender === user.avatar.name ? user.avatar.name[0] : post.sender[0]}
                     </div>
                  )}
                  <div className={`max-w-[80%] ${post.isSystem ? 'w-full flex justify-center' : ''}`}>
                    {post.isSystem ? (
                      <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{post.text}</span>
                    ) : (
                      <div className={`p-3 rounded-2xl ${post.sender === user.avatar.name ? 'bg-green-900/50 border border-green-500/30' : 'bg-gray-800 border border-gray-700'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-bold ${post.sender === user.avatar.name ? 'text-green-400' : 'text-blue-400'}`}>{post.sender}</span>
                          <span className="text-[10px] text-gray-500 ml-2">{new Date(post.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-sm text-gray-200">{post.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePost()}
                placeholder="Broadcast to Nexus..."
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-700"
              />
              <button onClick={handlePost} className="p-3 bg-green-600 rounded-full hover:bg-green-500 text-black">
                <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Friends View */}
        {activeTab === 'FRIENDS' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-500">ONLINE ({MOCK_FRIENDS.filter(f => f.status === 'online').length})</h3>
              <button className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-500/50 flex items-center gap-1">
                <Plus size={12}/> ADD ID
              </button>
            </div>
            
            <div className="space-y-2">
              {MOCK_FRIENDS.map(friend => (
                <div key={friend.id} onClick={() => setActiveDM(friend.id)} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-500 transition cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={friend.avatar} className="w-10 h-10 rounded-full bg-gray-700" />
                      <div className="absolute bottom-0 right-0 border-2 border-gray-800 rounded-full">
                        {renderStatus(friend.status)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-200">{friend.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{friend.status}</p>
                    </div>
                  </div>
                  <button className="p-2 bg-gray-700 rounded-full text-gray-400 group-hover:text-white group-hover:bg-blue-600 transition">
                    <MessageCircle size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Simulated DM Modal if Active */}
            {activeDM && (
               <div className="absolute inset-0 bg-gray-900 z-20 flex flex-col animate-in slide-in-from-right">
                  <div className="p-4 border-b border-gray-700 flex items-center gap-3 bg-gray-800">
                    <button onClick={() => setActiveDM(null)}><ArrowLeft /></button>
                    <span className="font-bold">{MOCK_FRIENDS.find(f => f.id === activeDM)?.name}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-gray-500 italic">
                    Start of encrypted channel.
                  </div>
                  <div className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
                    <input 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handlePost()}
                      placeholder="Secure message..."
                      className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-full focus:outline-none border border-gray-700"
                    />
                    <button onClick={handlePost} className="p-3 bg-blue-600 rounded-full hover:bg-blue-500 text-white">
                      <Send size={20} />
                    </button>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialView;