
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gamepad2, Cpu, Type, Grid3X3, Layers, Hash, Star, Sparkles } from 'lucide-react';

interface ArcadeViewProps {
  onBack: () => void;
  onReward: (amount: number) => void;
}

type GameType = 'MENU' | 'TIC_TAC_TOE' | 'WORD_SCRAMBLE' | 'WORD_SYNC' | 'CHECKERS' | 'SOLITAIRE' | 'CRYSTAL_CRUSH';

const ArcadeView: React.FC<ArcadeViewProps> = ({ onBack, onReward }) => {
  const [activeGame, setActiveGame] = useState<GameType>('MENU');

  const renderStoreMenu = () => (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4">
        <div onClick={() => setActiveGame('CRYSTAL_CRUSH')} className="relative w-full h-44 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl">
          <img src="https://picsum.photos/id/1081/600/400" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" alt="Crystal Crush" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
            <span className="text-oasis-cyan text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
              <Sparkles size={10} fill="currentColor" /> Trending Now
            </span>
            <h2 className="text-2xl font-black text-white italic tracking-tighter">CRYSTAL CRUSH</h2>
            <p className="text-xs text-white/60 mb-3">Addictive match-3 neural-sync puzzle.</p>
            <div className="flex gap-2">
               <span className="bg-oasis-cyan text-black text-[9px] font-black px-3 py-1 rounded-full uppercase">Play Now</span>
               <span className="bg-white/10 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase border border-white/10">+100 CR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4 ml-1">Featured Modules</h3>
        <div className="grid grid-cols-4 gap-y-6 gap-x-3">
          <StoreApp title="Crush" icon={<Sparkles size={22} />} color="blue" rating="5.0" onClick={() => setActiveGame('CRYSTAL_CRUSH')} />
          <StoreApp title="Checkers" icon={<Cpu size={22} />} color="red" rating="4.9" onClick={() => setActiveGame('CHECKERS')} />
          <StoreApp title="Word Sync" icon={<Type size={22} />} color="blue" rating="4.5" onClick={() => setActiveGame('WORD_SYNC')} />
          <StoreApp title="Solitaire" icon={<Layers size={22} />} color="yellow" rating="4.8" onClick={() => setActiveGame('SOLITAIRE')} />
        </div>
      </div>

      <div className="px-4 py-8">
        <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4 ml-1">Legacy Games</h3>
        <div className="grid grid-cols-4 gap-y-6 gap-x-3">
          <StoreApp title="Tic-Tac" icon={<Grid3X3 size={22} />} color="purple" rating="4.7" onClick={() => setActiveGame('TIC_TAC_TOE')} />
          <StoreApp title="Scramble" icon={<Hash size={22} />} color="green" rating="4.2" onClick={() => setActiveGame('WORD_SCRAMBLE')} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-[#050508] text-white flex flex-col overflow-hidden">
      <div className="shrink-0 p-4 bg-[#050508]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => activeGame === 'MENU' ? onBack() : setActiveGame('MENU')} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
            {activeGame === 'MENU' ? 'App Store' : activeGame.replace('_', ' ')}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center">
          {activeGame === 'MENU' && renderStoreMenu()}
          <div className={`w-full h-full flex flex-col items-center justify-start p-4`}>
              {activeGame === 'TIC_TAC_TOE' && <TicTacToe onComplete={(win) => win && onReward(50)} />}
              {activeGame === 'WORD_SCRAMBLE' && <WordScramble onReward={onReward} />}
              {activeGame === 'WORD_SYNC' && <WordSync onReward={onReward} />}
              {activeGame === 'CHECKERS' && <Checkers onComplete={(win) => win && onReward(100)} />}
              {activeGame === 'SOLITAIRE' && <Solitaire onWin={() => onReward(75)} />}
              {activeGame === 'CRYSTAL_CRUSH' && <CrystalCrush onReward={onReward} />}
          </div>
      </div>
    </div>
  );
};

const StoreApp = ({ title, icon, color, rating, onClick }: any) => {
  const themes: any = {
    purple: 'from-purple-600/30 to-indigo-900/60 border-purple-500/30 text-purple-300 shadow-purple-500/10',
    green: 'from-green-600/30 to-emerald-900/60 border-green-500/30 text-green-300 shadow-green-500/10',
    blue: 'from-blue-600/30 to-indigo-900/60 border-blue-500/30 text-blue-300 shadow-blue-500/10',
    red: 'from-red-600/30 to-orange-900/60 border-red-500/30 text-red-300 shadow-red-500/10',
    yellow: 'from-yellow-600/30 to-amber-900/60 border-yellow-500/30 text-yellow-300 shadow-yellow-500/10',
  };
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group max-w-[80px]">
      <div className={`w-[17vw] h-[17vw] max-w-[68px] max-h-[68px] rounded-2xl bg-gradient-to-br border flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-90 shadow-xl overflow-hidden relative ${themes[color]}`}>
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none" />
        {icon}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold text-white text-center leading-tight line-clamp-1 group-hover:text-oasis-cyan transition-colors">{title}</span>
        <div className="flex items-center gap-1 mt-0.5">
           <Star size={7} fill="#fbbf24" className="text-amber-400" />
           <span className="text-[7px] text-gray-500 font-bold">{rating}</span>
        </div>
      </div>
    </button>
  );
};

// --- Sub-Game: Tic Tac Toe ---
const TicTacToe: React.FC<{ onComplete: (win: boolean) => void }> = ({ onComplete }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return squares.includes(null) ? null : 'Draw';
  };

  const winner = calculateWinner(board);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const nextBoard = board.slice();
    nextBoard[i] = 'X';
    
    const empty = nextBoard.map((v, idx) => v === null ? idx : null).filter(v => v !== null) as number[];
    if (empty.length > 0 && !calculateWinner(nextBoard)) {
      const aiIdx = empty[Math.floor(Math.random() * empty.length)];
      nextBoard[aiIdx] = 'O';
    }
    setBoard(nextBoard);
  };

  useEffect(() => {
    if (winner === 'X') onComplete(true);
  }, [winner]);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-2 bg-white/5 p-4 rounded-3xl border border-white/10">
        {board.map((v, i) => (
          <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 bg-black/60 rounded-2xl border border-white/5 text-2xl font-black text-oasis-cyan flex items-center justify-center">
            {v}
          </button>
        ))}
      </div>
      {winner && <div className="mt-4 font-black text-oasis-cyan uppercase italic tracking-widest">{winner === 'X' ? 'Sync Success!' : 'Sync Failed'}</div>}
    </div>
  );
};

// --- Sub-Game: Word Scramble ---
const WordScramble: React.FC<{ onReward: (amount: number) => void }> = ({ onReward }) => {
  const words = ['CYBERPUNK', 'METAVERSE', 'AVATAR', 'NEXUS', 'UPLINK'];
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');

  const nextWord = () => {
    const w = words[Math.floor(Math.random() * words.length)];
    setWord(w);
    setScrambled(w.split('').sort(() => Math.random() - 0.5).join(''));
    setInput('');
  };

  useEffect(() => nextWord(), []);

  const check = () => {
    if (input.toUpperCase() === word) {
      onReward(50);
      nextWord();
    }
  };

  return (
    <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 w-full max-w-sm">
      <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-4">Decrypting Data Flow</div>
      <div className="text-4xl font-black text-white italic tracking-tighter mb-8">{scrambled}</div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        className="w-full bg-black border border-white/10 rounded-2xl p-4 text-center font-black uppercase mb-4 focus:border-oasis-cyan outline-none" 
        placeholder="..."
      />
      <button onClick={check} className="w-full bg-oasis-cyan text-black p-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-transform">Decrypt</button>
    </div>
  );
};

// --- Sub-Game: Word Sync ---
const WordSync: React.FC<{ onReward: (amount: number) => void }> = ({ onReward }) => {
  const phrase = 'NEURAL_LINK_ESTABLISHED';
  const [input, setInput] = useState('');

  useEffect(() => {
    if (input.toUpperCase() === phrase) {
      onReward(30);
      setInput('');
    }
  }, [input]);

  return (
    <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 w-full max-w-sm">
      <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-4">Latency Sync Test</div>
      <div className="text-sm font-black text-oasis-cyan italic mb-8 select-none">{phrase}</div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        className="w-full bg-black border border-white/10 rounded-2xl p-4 text-center font-black uppercase focus:border-oasis-cyan outline-none" 
        placeholder="Type exactly..."
      />
    </div>
  );
};

// --- Sub-Game: Checkers ---
const Checkers: React.FC<{ onComplete: (win: boolean) => void }> = ({ onComplete }) => (
  <div className="text-center p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
    <Cpu className="mx-auto mb-6 text-red-500" size={48} />
    <h3 className="text-xl font-black italic mb-2 uppercase">Checkers 2099</h3>
    <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest">In Development</p>
    <button onClick={() => onComplete(true)} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Instant Win (+100 CR)</button>
  </div>
);

// --- Sub-Game: Solitaire ---
const Solitaire: React.FC<{ onWin: () => void }> = ({ onWin }) => (
  <div className="text-center p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
    <Layers className="mx-auto mb-6 text-yellow-500" size={48} />
    <h3 className="text-xl font-black italic mb-2 uppercase">Legacy Solitaire</h3>
    <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest">In Development</p>
    <button onClick={onWin} className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Instant Win (+75 CR)</button>
  </div>
);

// --- Sub-Game: Crystal Crush ---
const CrystalCrush: React.FC<{ onReward: (amount: number) => void }> = ({ onReward }) => {
  const GRID_SIZE = 7;
  const CRYSTALS = ['💎', '🔥', '🍀', '⭐', '🟣', '🧿'];
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(25);

  const initGrid = () => {
    let newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill('').map(() => CRYSTALS[Math.floor(Math.random() * CRYSTALS.length)]));
    setGrid(newGrid);
    setScore(0);
    setMoves(25);
  };

  useEffect(() => initGrid(), []);

  const checkMatches = (currentGrid: string[][]) => {
    let matches: { r: number, c: number }[] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        if (currentGrid[r][c] && currentGrid[r][c] === currentGrid[r][c+1] && currentGrid[r][c] === currentGrid[r][c+2]) {
          matches.push({r, c}, {r, c:c+1}, {r, c:c+2});
        }
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        if (currentGrid[r][c] && currentGrid[r][c] === currentGrid[r+1][c] && currentGrid[r][c] === currentGrid[r+2][c]) {
          matches.push({r, c}, {r:r+1, c}, {r:r+2, c});
        }
      }
    }
    return matches;
  };

  const processGrid = (currentGrid: string[][]) => {
    const matches = checkMatches(currentGrid);
    if (matches.length > 0) {
      const newGrid = currentGrid.map(row => [...row]);
      matches.forEach(({r, c}) => newGrid[r][c] = '');
      setScore(s => s + matches.length * 10);
      for (let c = 0; c < GRID_SIZE; c++) {
        let emptySpot = GRID_SIZE - 1;
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (newGrid[r][c] !== '') {
            let temp = newGrid[r][c];
            newGrid[r][c] = '';
            newGrid[emptySpot][c] = temp;
            emptySpot--;
          }
        }
        for (let r = emptySpot; r >= 0; r--) {
          newGrid[r][c] = CRYSTALS[Math.floor(Math.random() * CRYSTALS.length)];
        }
      }
      setGrid(newGrid);
      // Slowed down gravity processing to 800ms
      setTimeout(() => processGrid(newGrid), 800);
    }
  };

  const handleTileClick = (r: number, c: number) => {
    if (moves <= 0) return;
    if (!selected) {
      setSelected({r, c});
    } else {
      const dr = Math.abs(selected.r - r);
      const dc = Math.abs(selected.c - c);
      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        const newGrid = grid.map(row => [...row]);
        const temp = newGrid[r][c];
        newGrid[r][c] = newGrid[selected.r][selected.c];
        newGrid[selected.r][selected.c] = temp;
        const matches = checkMatches(newGrid);
        if (matches.length > 0) {
          setGrid(newGrid);
          setMoves(m => m - 1);
          processGrid(newGrid);
        }
      }
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      <div className="flex justify-between w-full mb-6 items-end">
        <div>
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">SCORE_SYNC</div>
          <div className="text-3xl font-black italic text-oasis-cyan tracking-tighter">{score}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">CYCLES</div>
          <div className={`text-3xl font-black italic tracking-tighter ${moves < 5 ? 'text-red-500' : 'text-white'}`}>{moves}</div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 bg-black/40 p-2 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
        {grid.map((row, r) => row.map((tile, c) => (
          <button key={`${r}-${c}`} onClick={() => handleTileClick(r, c)} className={`w-[11vw] h-[11vw] max-w-[45px] max-h-[45px] flex items-center justify-center text-xl rounded-lg transition-all duration-700 active:scale-90 border border-transparent ${selected?.r === r && selected?.c === c ? 'bg-oasis-cyan/20 border-oasis-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'hover:bg-white/5'}`}>
            <span className={`transition-all duration-700 ${tile === '' ? 'scale-0' : 'scale-100'}`}>{tile}</span>
          </button>
        )))}
      </div>
      {moves === 0 && (
        <div className="mt-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="text-xl font-black mb-4 italic tracking-tighter uppercase text-yellow-400">Sync Complete! +{Math.floor(score/10)} CR</div>
          <button onClick={() => { onReward(Math.floor(score/10)); initGrid(); }} className="bg-oasis-cyan text-black px-10 py-4 rounded-full font-black text-xs uppercase shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:scale-105 transition-transform">Claim & Reboot</button>
        </div>
      )}
    </div>
  );
};

export default ArcadeView;
