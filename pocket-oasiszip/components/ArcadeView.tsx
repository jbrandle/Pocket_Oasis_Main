import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Gamepad2, Cpu, Grid3X3, Layers, Star, Sparkles, CheckCircle2, RefreshCw, Zap, Brain, Key, Binary, RotateCcw, Target as TargetIcon, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface ArcadeViewProps {
  onBack: () => void;
  onReward: (amount: number) => void;
}

type GameType = 'MENU' | 'TIC_TAC_TOE' | 'NEURAL_CIPHER' | 'NEURAL_PATTERN' | 'CHECKERS' | 'SOLITAIRE' | 'CRYSTAL_CRUSH' | 'WORD_SCRAMBLE';

const ArcadeView: React.FC<ArcadeViewProps> = ({ onBack, onReward }) => {
  const [activeGame, setActiveGame] = useState<GameType>('MENU');

  const renderStoreMenu = () => (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="p-4">
        <div onClick={() => setActiveGame('CRYSTAL_CRUSH')} className="relative w-full h-44 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-white/5">
          <img src="https://picsum.photos/id/1081/600/400" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" alt="Crystal Crush" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
            <span className="text-oasis-cyan text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
              <span className="animate-pulse">💎</span> Trending Now
            </span>
            <h2 className="text-2xl font-black text-white italic tracking-tighter text-shadow-lg leading-none mb-2">CRYSTAL CRUSH</h2>
            <p className="text-xs text-white/60 mb-3 drop-shadow-md">Addictive match-3 neural-sync puzzle.</p>
            <div className="flex gap-2">
               <span className="bg-oasis-cyan text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg">Play Now</span>
               <span className="bg-white/10 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase border border-white/10">+100 CR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.4em] mb-6 ml-1">Featured Modules</h3>
        <div className="grid grid-cols-4 gap-y-10 gap-x-4">
          <StoreApp title="Crystal Crush" icon={<Sparkles size={24} />} color="blue" rating="5.0" onClick={() => setActiveGame('CRYSTAL_CRUSH')} />
          <StoreApp title="Checkers 2099" icon={<Cpu size={24} />} color="red" rating="4.9" onClick={() => setActiveGame('CHECKERS')} />
          <StoreApp title="Neural Pattern" icon={<Brain size={24} />} color="purple" rating="4.8" onClick={() => setActiveGame('NEURAL_PATTERN')} />
          <StoreApp title="Neural Cipher" icon={<Key size={24} />} color="green" rating="4.9" onClick={() => setActiveGame('NEURAL_CIPHER')} />
        </div>
      </div>

      <div className="px-4 py-12">
        <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.4em] mb-6 ml-1">Legacy Games</h3>
        <div className="grid grid-cols-4 gap-y-10 gap-x-4">
          <StoreApp title="Tic-Tac-Toe" icon={<Grid3X3 size={24} />} color="purple" rating="4.7" onClick={() => setActiveGame('TIC_TAC_TOE')} />
          <StoreApp title="Solitaire" icon={<Layers size={24} />} color="yellow" rating="4.8" onClick={() => setActiveGame('SOLITAIRE')} />
          <StoreApp title="Word Scramble" icon={<Binary size={24} />} color="green" rating="4.2" onClick={() => setActiveGame('WORD_SCRAMBLE')} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-[#050508] text-white flex flex-col overflow-hidden font-sans">
      <div className="shrink-0 p-4 bg-[#050508]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10 shadow-2xl">
        <div className="flex items-center gap-3">
          <button onClick={() => activeGame === 'MENU' ? onBack() : setActiveGame('MENU')} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black italic tracking-tighter text-white uppercase whitespace-nowrap">
            {activeGame === 'MENU' ? 'App Store' : activeGame.split('_').join(' ')}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center no-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-indigo-950/10">
          {activeGame === 'MENU' && renderStoreMenu()}
          <div className="w-full h-full flex flex-col items-center justify-start p-2 sm:p-4">
              {activeGame === 'TIC_TAC_TOE' && <TicTacToe onComplete={(win) => win && onReward(25)} />}
              {activeGame === 'NEURAL_CIPHER' && <NeuralCipher onReward={onReward} />}
              {activeGame === 'NEURAL_PATTERN' && <NeuralPattern onReward={onReward} />}
              {activeGame === 'WORD_SCRAMBLE' && <WordScramble onReward={onReward} />}
              {activeGame === 'CHECKERS' && <Checkers onComplete={(win) => win && onReward(100)} />}
              {activeGame === 'SOLITAIRE' && <Solitaire onWin={() => onReward(80)} />}
              {activeGame === 'CRYSTAL_CRUSH' && <CrystalCrush onReward={onReward} />}
          </div>
      </div>
    </div>
  );
};

const StoreApp = ({ title, icon, color, rating, onClick }: any) => {
  const themes: any = {
    purple: 'from-purple-600/40 to-indigo-950 border-purple-500/30 text-purple-300 shadow-purple-500/10',
    green: 'from-green-600/40 to-emerald-950 border-green-500/30 text-green-300 shadow-green-500/10',
    blue: 'from-blue-600/40 to-indigo-950 border-blue-500/30 text-blue-300 shadow-blue-500/10',
    red: 'from-red-600/40 to-orange-950 border-red-500/30 text-red-300 shadow-red-500/10',
    yellow: 'from-yellow-600/40 to-amber-950 border-yellow-500/30 text-yellow-300 shadow-yellow-500/10',
  };
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-3 group max-w-[85px] w-full">
      <div className={`w-[17vw] h-[17vw] max-w-[72px] max-h-[72px] rounded-2xl bg-gradient-to-br border flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-90 shadow-2xl overflow-hidden relative ${themes[color]}`}>
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none" />
        {icon}
      </div>
      <div className="flex flex-col items-center h-10 w-full overflow-hidden">
        <span className="text-[9px] font-black text-white text-center leading-tight uppercase tracking-tighter group-hover:text-oasis-cyan transition-colors whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">
          {title}
        </span>
        <div className="flex items-center gap-1 mt-1 opacity-60">
           <Star size={8} fill="#fbbf24" className="text-amber-400" />
           <span className="text-[8px] text-gray-400 font-bold">{rating}</span>
        </div>
      </div>
    </button>
  );
};

// --- Sub-Game: Checkers 2099 ---
const Checkers: React.FC<{ onComplete: (win: boolean) => void }> = ({ onComplete }) => {
  type Piece = { player: 1 | 2; isKing: boolean };
  type Board = (Piece | null)[][];
  const [board, setBoard] = useState<Board>([]);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [isAiMoving, setIsAiMoving] = useState(false);
  const [status, setStatus] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');

  const getValidMoves = useCallback((b: Board, r: number, c: number) => {
    const piece = b[r][c];
    if (!piece) return [];
    const moves: { toR: number; toC: number; capturedR?: number; capturedC?: number }[] = [];
    const directions = piece.isKing ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : (piece.player === 1 ? [[-1, 1], [-1, -1]] : [[1, 1], [1, -1]]);

    for (const [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!b[nr][nc]) {
          moves.push({ toR: nr, toC: nc });
        } else if (b[nr][nc]?.player !== piece.player) {
          const jr = nr + dr, jc = nc + dc;
          if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !b[jr][jc]) {
            moves.push({ toR: jr, toC: jc, capturedR: nr, capturedC: nc });
          }
        }
      }
    }
    return moves;
  }, []);

  const hasAnyValidMoves = useCallback((b: Board, player: 1 | 2) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c]?.player === player) {
          if (getValidMoves(b, r, c).length > 0) return true;
        }
      }
    }
    return false;
  }, [getValidMoves]);

  const initBoard = useCallback(() => {
    const newBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 !== 0) {
          if (r < 3) newBoard[r][c] = { player: 2, isKing: false };
          else if (r > 4) newBoard[r][c] = { player: 1, isKing: false };
        }
      }
    }
    setBoard(newBoard);
    setSelected(null);
    setTurn(1);
    setIsAiMoving(false);
    setStatus('PLAYING');
  }, []);

  useEffect(() => initBoard(), [initBoard]);

  const executeMove = (fromR: number, fromC: number, toR: number, toC: number, capR?: number, capC?: number) => {
    const newBoard = board.map(row => [...row]);
    let p = { ...newBoard[fromR][fromC]! };
    if ((p.player === 1 && toR === 0) || (p.player === 2 && toR === 7)) p.isKing = true;
    newBoard[toR][toC] = p;
    newBoard[fromR][fromC] = null;
    if (capR !== undefined) newBoard[capR][capC!] = null;
    
    setBoard(newBoard);
    setSelected(null);
    
    const nextTurn = turn === 1 ? 2 : 1;
    const hasNextPlayerPieces = newBoard.flat().some(p => p?.player === nextTurn);
    const hasNextPlayerMoves = hasAnyValidMoves(newBoard, nextTurn as 1 | 2);

    if (!hasNextPlayerPieces || !hasNextPlayerMoves) {
      if (turn === 1) {
        setStatus('WON');
        onComplete(true);
      } else {
        setStatus('LOST');
        onComplete(false);
      }
      return;
    }
    setTurn(nextTurn as 1 | 2);
  };

  const handleSquareClick = (r: number, c: number) => {
    if (isAiMoving || turn !== 1 || status !== 'PLAYING') return;
    const piece = board[r][c];
    if (selected) {
      if (piece && piece.player === 1) {
        setSelected({ r, c });
        return;
      }
      const move = getValidMoves(board, selected.r, selected.c).find(m => m.toR === r && m.toC === c);
      if (move) executeMove(selected.r, selected.c, r, c, move.capturedR, move.capturedC);
      else setSelected(null);
    } else if (piece && piece.player === 1) {
      setSelected({ r, c });
    }
  };

  useEffect(() => {
    if (turn === 2 && !isAiMoving && status === 'PLAYING') {
      setIsAiMoving(true);
      const timer = setTimeout(() => {
        const allPossibleMoves: any[] = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (board[r][c]?.player === 2) {
              getValidMoves(board, r, c).forEach(m => allPossibleMoves.push({ ...m, fromR: r, fromC: c }));
            }
          }
        }
        if (allPossibleMoves.length > 0) {
          const jumps = allPossibleMoves.filter(m => m.capturedR !== undefined);
          const bestMove = jumps.length > 0 ? jumps[Math.floor(Math.random() * jumps.length)] : allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
          executeMove(bestMove.fromR, bestMove.fromC, bestMove.toR, bestMove.toC, bestMove.capturedR, bestMove.capturedC);
        } else {
          setStatus('WON');
          onComplete(true);
        }
        setIsAiMoving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turn, board, status, getValidMoves]);

  return (
    <div className="flex flex-col items-center animate-in zoom-in duration-500 w-full max-w-sm">
      <div className="w-full flex justify-between items-end mb-6 px-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Neural Relay</span>
          <div className={`text-xl font-black italic uppercase tracking-tighter transition-colors ${status === 'WON' ? 'text-green-400' : status === 'LOST' ? 'text-red-500' : turn === 1 ? 'text-oasis-cyan' : 'text-magenta-500 animate-pulse'}`}>
            {status === 'WON' ? 'NODE_SECURED' : status === 'LOST' ? 'LINK_COLLAPSED' : turn === 1 ? 'OPERATOR_ACTIVE' : 'AI_COMPUTING...'}
          </div>
        </div>
        <button onClick={initBoard} className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 shadow-lg">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="aspect-square w-full grid grid-cols-8 grid-rows-8 bg-[#0a0a0c] border-[6px] border-white/5 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        {board.map((row, r) => row.map((piece, c) => (
          <div key={`${r}-${c}`} onClick={() => handleSquareClick(r, c)} className={`aspect-square flex items-center justify-center relative cursor-pointer group transition-colors duration-300 ${(r + c) % 2 === 0 ? 'bg-[#121218]' : 'bg-[#0a0a0e]'}`}>
            {selected?.r === r && selected?.c === c && (
               <div className="absolute inset-0 border-2 border-oasis-cyan/60 rounded-lg animate-pulse z-10 pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-oasis-cyan" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-oasis-cyan" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-oasis-cyan" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-oasis-cyan" />
               </div>
            )}
            {piece && (
              <div className={`w-[82%] h-[82%] rounded-full border-2 shadow-2xl flex items-center justify-center transition-all duration-500 relative ${piece.player === 1 ? 'bg-gradient-to-br from-oasis-cyan via-indigo-900 to-black border-white/30' : 'bg-gradient-to-br from-magenta-500 via-purple-950 to-black border-white/30'} ${selected?.r === r && selected?.c === c ? 'scale-110 shadow-[0_0_25px_rgba(0,243,255,0.5)]' : 'scale-90'}`}>
                <div className="w-1/2 h-1/2 rounded-full border border-white/10 flex items-center justify-center bg-black/40 overflow-hidden">
                   {piece.isKing ? <Star size={12} fill="white" className="text-white drop-shadow-md animate-pulse" /> : <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-40" />}
                </div>
                <div className="absolute inset-1 rounded-full border border-white/5 pointer-events-none" />
              </div>
            )}
          </div>
        )))}
        {status !== 'PLAYING' && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 z-50">
              <h3 className={`text-4xl font-black italic tracking-tighter uppercase mb-4 ${status === 'WON' ? 'text-oasis-cyan' : 'text-magenta-500'}`}>{status === 'WON' ? 'NEURAL_VICTORY' : 'AI_DOMINANCE'}</h3>
              <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.3em] mb-8 leading-relaxed">{status === 'WON' ? 'Opponent trapped in neural blockade.' : 'Link severed by defensive subroutines.'}</p>
              <button onClick={initBoard} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 active:scale-95 transition-all">Reset Simulation</button>
           </div>
        )}
      </div>
      <div className="mt-8 flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
        <TargetIcon size={12} className="text-oasis-cyan" />
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Lock: {status === 'PLAYING' ? 'ACTIVE' : 'IDLE'}</span>
      </div>
    </div>
  );
};

// --- Sub-Game: Tic Tac Toe (Refined Difficulty & Winnings) ---
const TicTacToe: React.FC<{ onComplete: (win: boolean) => void }> = ({ onComplete }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isAiMoving, setIsAiMoving] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState<'X' | 'O'>('X'); 
  const [turn, setTurn] = useState<'X' | 'O'>('X');

  const calculateWinner = useCallback((squares: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) { 
      const [a, b, c] = lines[i]; 
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a]; 
    }
    return squares.includes(null) ? null : 'Draw';
  }, []);

  const minimax = useCallback((squares: (string | null)[], depth: number, isMaximizing: boolean): number => {
    const winner = calculateWinner(squares);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, [calculateWinner]);

  const findBestMove = useCallback((squares: (string | null)[]) => {
    // Neural Noise: 12% chance to play poorly (88% efficiency requested)
    if (Math.random() < 0.12) {
      const available = squares.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
      if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
    }

    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }, [minimax]);

  const resetGame = () => {
    const nextStart = startingPlayer === 'X' ? 'O' : 'X';
    setStartingPlayer(nextStart);
    setBoard(Array(9).fill(null));
    setTurn(nextStart);
    setIsAiMoving(false);
  };

  const handleClick = (i: number) => {
    if (calculateWinner(board) || board[i] || isAiMoving || turn !== 'X') return;
    const nextBoard = [...board];
    nextBoard[i] = 'X';
    setBoard(nextBoard);
    
    // Only pass turn if no winner yet
    if (!calculateWinner(nextBoard)) {
      setTurn('O');
    }
  };

  useEffect(() => {
    let timeoutId: number;
    if (turn === 'O' && !calculateWinner(board)) {
      setIsAiMoving(true);
      timeoutId = window.setTimeout(() => {
        setBoard(currentBoard => {
          const aiIdx = findBestMove(currentBoard);
          if (aiIdx !== -1) {
            const nextBoard = [...currentBoard];
            nextBoard[aiIdx] = 'O';
            setTurn('X');
            setIsAiMoving(false);
            return nextBoard;
          }
          setIsAiMoving(false);
          return currentBoard;
        });
      }, 700);
    }
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [turn]);

  const winner = calculateWinner(board);
  useEffect(() => { if (winner === 'X') onComplete(true); }, [winner, onComplete]);

  return (
    <div className="flex flex-col items-center p-6 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-2xl animate-in zoom-in duration-500 w-full max-w-sm">
      <header className="w-full flex justify-between items-center mb-8 px-2">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Neural Initiative</span>
            <div className={`text-xl font-black italic uppercase tracking-tighter ${isAiMoving ? 'text-magenta-500 animate-pulse' : 'text-oasis-cyan'}`}>
              {isAiMoving ? 'AI_COMPUTING' : winner ? 'SYNC_COMPLETE' : turn === 'X' ? 'OPERATOR_TURN' : 'AI_TURN'}
            </div>
            <span className="text-[7px] text-gray-600 font-mono mt-1 uppercase tracking-widest">Phase Offset: {startingPlayer === 'X' ? '01_User' : '02_AI'}</span>
         </div>
         {(winner || calculateWinner(board)) && (
           <button onClick={resetGame} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-oasis-cyan hover:text-black transition-all shadow-lg active:scale-90">
             <RotateCcw size={18} />
           </button>
         )}
      </header>

      <div className="grid grid-cols-3 gap-4 bg-black/60 p-4 rounded-[2rem] border border-white/5 shadow-inner">
        {board.map((v, i) => ( 
          <button 
            key={i} 
            onClick={() => handleClick(i)} 
            disabled={!!winner || isAiMoving || turn === 'O'}
            className={`w-[24vw] h-[24vw] max-w-[85px] max-h-[85px] bg-[#0c0c14] rounded-2xl border-2 transition-all duration-300 flex items-center justify-center active:scale-95 ${
              v === 'X' ? 'border-oasis-cyan text-oasis-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]' : 
              v === 'O' ? 'border-magenta-500 text-magenta-500 drop-shadow-[0_0_15px_rgba(255,0,255,0.6)]' : 
              'border-white/5 hover:border-white/20'
            }`}
          >
            <span className="text-4xl font-black italic">{v}</span>
          </button> 
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 w-full">
         <div className={`text-xs font-black uppercase tracking-[0.4em] transition-all flex flex-col items-center ${winner === 'X' ? 'text-oasis-cyan' : winner === 'Draw' ? 'text-gray-500' : winner === 'O' ? 'text-magenta-500' : 'text-white/20'}`}>
            {winner === 'X' ? (
              <div className="flex flex-col items-center animate-bounce">
                <span className="mb-2">Decryption Success</span>
                <span className="text-xl font-black italic bg-oasis-cyan text-black px-4 py-1 rounded-full">+25 CR</span>
              </div>
            ) : winner === 'Draw' ? 'Signal Collision' : winner === 'O' ? 'AI Domain Override' : 'Awaiting Input...'}
         </div>
         {winner && (
            <button onClick={resetGame} className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-white/10 transition-all shadow-xl">
               Invert Initiative
            </button>
         )}
      </div>
    </div>
  );
};

// --- Sub-Game: Solitaire ---
const Solitaire: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
  type Card = { suit: Suit; value: number; color: 'red' | 'black'; isFaceUp: boolean; id: string };
  const [deck, setDeck] = useState<Card[]>([]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [selection, setSelection] = useState<{ type: 'tableau' | 'waste' | 'foundation'; pileIndex: number; cardIndex: number } | null>(null);
  const initGame = useCallback(() => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const newDeck: Card[] = [];
    suits.forEach(suit => { for (let i = 1; i <= 13; i++) { newDeck.push({ suit, value: i, color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black', isFaceUp: false, id: `${suit}-${i}-${Math.random()}` }); } });
    for (let i = newDeck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]; }
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    let cardIdx = 0;
    for (let i = 0; i < 7; i++) { for (let j = 0; j <= i; j++) { const card = newDeck[cardIdx++]; if (j === i) card.isFaceUp = true; newTableau[i].push(card); } }
    setTableau(newTableau); setStock(newDeck.slice(cardIdx)); setWaste([]); setFoundations([[], [], [], []]); setSelection(null);
  }, []);
  useEffect(() => initGame(), [initGame]);
  const drawCard = () => {
    if (stock.length === 0) { if (waste.length === 0) return; setStock([...waste].reverse().map(c => ({ ...c, isFaceUp: false }))); setWaste([]); }
    else { const numToDraw = Math.min(stock.length, 3); const drawn = stock.slice(-numToDraw).reverse().map(c => ({ ...c, isFaceUp: true })); setWaste([...waste, ...drawn]); setStock(stock.slice(0, -numToDraw)); }
    setSelection(null);
  };
  const handleTableauClick = (pIdx: number, cIdx?: number) => {
    const pile = tableau[pIdx];
    if (selection) {
      const sourceCards = getSelectedCards(); const sourceTopCard = sourceCards[0]; const targetCard = pile.length > 0 ? pile[pile.length - 1] : null;
      const canMove = !targetCard ? sourceTopCard.value === 13 : targetCard.isFaceUp && targetCard.color !== sourceTopCard.color && targetCard.value === sourceTopCard.value + 1;
      if (canMove) executeMove('tableau', pIdx); else setSelection(null);
    } else if (cIdx !== undefined && pile[cIdx].isFaceUp) { setSelection({ type: 'tableau', pileIndex: pIdx, cardIndex: cIdx }); }
  };
  const handleFoundationClick = (i: number) => {
    if (selection) {
      const sourceCards = getSelectedCards();
      if (sourceCards.length === 1) {
        const sourceCard = sourceCards[0]; const pile = foundations[i]; const targetCard = pile.length > 0 ? pile[pile.length - 1] : null;
        const canMove = !targetCard ? sourceCard.value === 1 : sourceCard.suit === targetCard.suit && sourceCard.value === targetCard.value + 1;
        if (canMove) executeMove('foundation', i); else setSelection(null);
      } else { setSelection(null); }
    }
  };
  const getSelectedCards = (): Card[] => {
    if (!selection) return [];
    if (selection.type === 'waste') return [waste[waste.length - 1]];
    if (selection.type === 'tableau') return tableau[selection.pileIndex].slice(selection.cardIndex);
    if (selection.type === 'foundation') return [foundations[selection.pileIndex][foundations[selection.pileIndex].length - 1]];
    return [];
  };
  const executeMove = (targetType: 'tableau' | 'foundation', targetPileIndex: number) => {
    let movingCards: Card[] = []; const newTableau = tableau.map(p => [...p]); const newWaste = [...waste]; const newFoundations = foundations.map(p => [...p]);
    if (selection!.type === 'waste') { movingCards = [newWaste.pop()!]; }
    else if (selection!.type === 'tableau') { movingCards = newTableau[selection!.pileIndex].splice(selection!.cardIndex); if (newTableau[selection!.pileIndex].length > 0) { newTableau[selection!.pileIndex][newTableau[selection!.pileIndex].length - 1].isFaceUp = true; } }
    else if (selection!.type === 'foundation') { movingCards = [newFoundations[selection!.pileIndex].pop()!]; }
    if (targetType === 'tableau') newTableau[targetPileIndex].push(...movingCards); else newFoundations[targetPileIndex].push(...movingCards);
    setTableau(newTableau); setWaste(newWaste); setFoundations(newFoundations); setSelection(null);
    if (newFoundations.every(f => f.length === 13)) onWin();
  };
  const renderCard = (card: Card, isSelected: boolean, extraClasses: string = "") => {
    const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    const valMap: any = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
    const displayVal = valMap[card.value] || card.value;
    return (
      <div className={`w-[12.5vw] h-[18.5vw] max-w-[55px] max-h-[82px] rounded-lg flex flex-col items-center justify-center text-sm font-black transition-all border shadow-lg overflow-hidden shrink-0 ${!card.isFaceUp ? 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-black border-oasis-cyan/30' : `bg-white border-gray-200 ${card.color === 'red' ? 'text-red-600' : 'text-black'}`} ${isSelected ? 'ring-4 ring-oasis-cyan scale-110 z-[100] shadow-[0_0_20px_rgba(0,243,255,0.6)]' : ''} ${extraClasses}`}>
        {card.isFaceUp ? ( <> <div className="absolute top-1 left-1.5 leading-none text-[10px]">{displayVal}</div> <div className="text-xl leading-none mt-1">{suitSymbols[card.suit]}</div> <div className="absolute bottom-1 right-1.5 leading-none text-[10px] rotate-180">{displayVal}</div> </> ) : ( <div className="w-full h-full flex items-center justify-center opacity-30"> <Layers size={14} className="text-oasis-cyan" /> </div> )}
      </div>
    );
  };
  const lastThreeWaste = waste.slice(-3);
  return (
    <div className="w-full flex flex-col items-center select-none animate-in fade-in duration-500 max-w-2xl px-1">
      <header className="w-full grid grid-cols-[1fr_auto_1fr] items-start mb-6 px-1">
         <div className="flex gap-1.5">
            {foundations.map((f, i) => ( <div key={i} onClick={() => handleFoundationClick(i)} className="w-[12.5vw] h-[18.5vw] max-w-[55px] max-h-[82px] rounded-lg border-2 border-dashed border-white/5 bg-black/40 flex items-center justify-center relative group"> {f.length > 0 ? renderCard(f[f.length-1], selection?.type === 'foundation' && selection.pileIndex === i) : ( <div className="opacity-10 group-hover:opacity-20 transition-opacity"> {i === 0 && '♥'} {i === 1 && '♦'} {i === 2 && '♣'} {i === 3 && '♠'} </div> )} </div> ))}
         </div>
         <div className="w-4 sm:w-8" />
         <div className="flex gap-2 justify-end">
            <div className="relative w-[30vw] h-[18.5vw] max-w-[130px] flex items-center justify-end">
               {lastThreeWaste.map((card, idx) => ( <div key={card.id} onClick={() => idx === lastThreeWaste.length - 1 && setSelection({ type: 'waste', pileIndex: 0, cardIndex: waste.length - 1 })} className="absolute transition-all duration-300" style={{ right: `${(lastThreeWaste.length - 1 - idx) * 26}px`, zIndex: idx, transform: `translateX(${(lastThreeWaste.length - 1 - idx) * -4}px)` }}> {renderCard(card, selection?.type === 'waste' && idx === lastThreeWaste.length - 1)} </div> ))}
            </div>
            <div onClick={drawCard} className={`w-[12.5vw] h-[18.5vw] max-w-[55px] max-h-[82px] rounded-lg border-2 border-oasis-cyan/20 bg-oasis-cyan/10 flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-inner relative group`}> {stock.length > 0 ? ( <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-black rounded-md flex items-center justify-center border border-oasis-cyan/30"> <RefreshCw size={14} className="text-oasis-cyan opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all" /> </div> ) : ( <RefreshCw size={14} className="text-oasis-cyan/20" /> )} </div>
         </div>
      </header>
      <div className="grid grid-cols-7 gap-1.5 w-full min-h-[50vh] pb-20">
        {tableau.map((pile, pIdx) => ( <div key={pIdx} onClick={() => handleTableauClick(pIdx)} className="flex flex-col items-center relative h-full bg-white/[0.01] rounded-lg border-t border-white/5 min-h-[150px]"> {pile.map((card, cIdx) => { const isPartSelected = selection?.type === 'tableau' && selection.pileIndex === pIdx && cIdx >= selection.cardIndex; return ( <div key={card.id} className="absolute w-full flex justify-center" style={{ top: `${cIdx * (card.isFaceUp ? 24 : 12)}px` }} onClick={(e) => { e.stopPropagation(); handleTableauClick(pIdx, cIdx); }}> {renderCard(card, isPartSelected)} </div> ); })} </div> ))}
      </div>
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2"> <button onClick={initGame} className="px-8 py-3 bg-[#050508]/80 backdrop-blur-xl rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-oasis-cyan hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95"> New Simulation </button> </div>
    </div>
  );
};

// --- Sub-Game: Neural Cipher (Wordle Clone) ---
const NeuralCipher: React.FC<{ onReward: (amount: number) => void }> = ({ onReward }) => {
  const WORDS = ['GHOST', 'SHELL', 'PROXY', 'LINKED', 'CYBER', 'NEXUS', 'UPLINK', 'BLADE', 'NEURAL', 'SIGNAL'];
  const MAX_TRIES = 6;
  const REWARD_SCALE = [30, 25, 20, 15, 10, 5];
  const [target, setTarget] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [earnedReward, setEarnedReward] = useState(0);

  useEffect(() => { setTarget(WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase()); }, []);
  const handleChar = (char: string) => { if (gameState !== 'PLAYING') return; if (currentGuess.length < target.length) setCurrentGuess(prev => prev + char); };
  const handleBackspace = () => setCurrentGuess(prev => prev.slice(0, -1));
  const handleEnter = () => {
    if (currentGuess.length !== target.length) return;
    const attemptIndex = guesses.length;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    if (currentGuess === target) { 
      setGameState('WON'); 
      const calculatedReward = REWARD_SCALE[attemptIndex];
      setEarnedReward(calculatedReward);
      onReward(calculatedReward); 
    } else if (newGuesses.length >= MAX_TRIES) setGameState('LOST');
    setCurrentGuess('');
  };
  const getLetterColor = (guess: string, char: string, index: number) => {
    if (target[index] === char) return 'bg-oasis-cyan text-black border-oasis-cyan shadow-[0_0_10px_rgba(0,243,255,0.4)]';
    if (target.includes(char)) return 'bg-amber-500 text-black border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
    return 'bg-white/5 text-gray-500 border-white/5 opacity-50';
  };
  const restart = () => { setTarget(WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase()); setGuesses([]); setCurrentGuess(''); setGameState('PLAYING'); setEarnedReward(0); };
  return (
    <div className="w-full max-w-sm flex flex-col items-center p-6 bg-black/40 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 flex items-center justify-center gap-2"><Key size={12} className="text-oasis-cyan" /> Decryption Protocol</div>
      <div className="w-full mb-8 flex flex-col items-center">
         <div className="grid grid-cols-6 gap-1 w-full bg-white/[0.03] border border-white/5 p-2 rounded-2xl">
            {REWARD_SCALE.map((r, i) => (
              <div key={i} className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all ${gameState === 'PLAYING' && guesses.length === i ? 'bg-oasis-cyan text-black scale-110 shadow-lg' : guesses.length > i ? 'opacity-20' : 'opacity-60 text-white/50'}`}>
                <span className="text-[7px] font-black uppercase mb-0.5">R{i+1}</span>
                <span className="text-[10px] font-mono font-black">{r}</span>
              </div>
            ))}
         </div>
         {gameState === 'PLAYING' && <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest mt-2">Potential Yield: {REWARD_SCALE[guesses.length]} CR</p>}
      </div>
      <div className="flex flex-col gap-2 mb-10">
        {Array.from({ length: MAX_TRIES }).map((_, i) => {
          const guess = guesses[i] || (i === guesses.length ? currentGuess : '');
          const isSubmitted = i < guesses.length;
          return (
            <div key={i} className="flex gap-2">
              {Array.from({ length: target.length || 5 }).map((_, j) => {
                const char = guess[j] || '';
                const colorClass = isSubmitted ? getLetterColor(guess, char, j) : 'bg-white/[0.03] border-white/10 text-white';
                return ( <div key={j} className={`w-11 h-11 border-2 rounded-xl flex items-center justify-center font-black text-xl transition-all duration-500 ${colorClass}`}>{char}</div> );
              })}
            </div>
          );
        })}
      </div>
      {gameState === 'PLAYING' ? (
        <div className="grid grid-cols-10 gap-1 w-full">
          {"QWERTYUIOPASDFGHJKLZXCVBNM".split('').map(char => (
            <button key={char} onClick={() => handleChar(char)} className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black hover:bg-white/10 active:scale-90 transition-all">{char}</button>
          ))}
          <button onClick={handleBackspace} className="col-span-3 p-2.5 bg-red-900/20 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-black">DEL</button>
          <button onClick={handleEnter} className="col-span-7 p-2.5 bg-oasis-cyan text-black rounded-lg text-[9px] font-black shadow-lg shadow-oasis-cyan/20">ENTER_LINK</button>
        </div>
      ) : (
        <div className="text-center animate-in zoom-in duration-300 w-full">
          <div className={`text-4xl font-black italic tracking-tighter uppercase mb-2 ${gameState === 'WON' ? 'text-oasis-cyan' : 'text-red-500'}`}>{gameState === 'WON' ? 'SUCCESS' : 'FAILURE'}</div>
          {gameState === 'WON' && (
             <div className="bg-oasis-cyan/10 border border-oasis-cyan/20 py-4 px-6 rounded-3xl mb-8 flex flex-col items-center">
                <TrendingUp size={24} className="text-oasis-cyan mb-2" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Decryption Yield Distributed</span>
                <span className="text-4xl font-black italic text-oasis-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">+{earnedReward} CR</span>
             </div>
          )}
          {gameState === 'LOST' && <p className="text-xs text-gray-500 font-mono uppercase mb-8">Uplink Target: {target}</p>}
          <button onClick={restart} className="w-full bg-oasis-cyan text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-oasis-cyan/20 active:scale-95 transition-transform">Re-Initialize</button>
        </div>
      )}
    </div>
  );
};

// --- Sub-Game: Neural Pattern ---
const NeuralPattern: React.FC<{ onReward: (amount: number) => void }> = ({ onReward }) => {
  type Difficulty = { id: string; nodes: number; reward: number; grid: string };
  const DIFFICULTIES: Difficulty[] = [ { id: 'BEGINNER', nodes: 6, reward: 5, grid: 'grid-cols-2' }, { id: 'INTERMEDIATE', nodes: 8, reward: 10, grid: 'grid-cols-2' }, { id: 'PRO', nodes: 10, reward: 20, grid: 'grid-cols-2' } ];
  const [diff, setDiff] = useState<Difficulty | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'MENU' | 'WATCH' | 'PLAY' | 'GAMEOVER' | 'SUCCESS'>('MENU');
  const [round, setRound] = useState(0);
  const colors = ['bg-oasis-cyan shadow-oasis-cyan/50', 'bg-magenta-500 shadow-magenta-500/50', 'bg-amber-500 shadow-amber-500/50', 'bg-indigo-500 shadow-indigo-500/50', 'bg-emerald-500 shadow-emerald-500/50', 'bg-rose-500 shadow-rose-500/50', 'bg-lime-400 shadow-lime-400/50', 'bg-violet-600 shadow-violet-600/50', 'bg-sky-400 shadow-sky-400/50', 'bg-orange-500 shadow-orange-500/50'];
  const startRound = (d: Difficulty, currentSeq: number[]) => { const nextRound = round + 1; setRound(nextRound); const newSeq = [...currentSeq, Math.floor(Math.random() * d.nodes)]; setSequence(newSeq); setPlayerInput([]); playSequence(newSeq); };
  const playSequence = async (seq: number[]) => { setGameState('WATCH'); for (let i = 0; i < seq.length; i++) { await new Promise(r => setTimeout(r, 450)); setActiveNode(seq[i]); await new Promise(r => setTimeout(r, 450)); setActiveNode(null); } setGameState('PLAY'); };
  const handleNodeClick = (id: number) => { if (gameState !== 'PLAY') return; const newInput = [...playerInput, id]; setPlayerInput(newInput); setActiveNode(id); setTimeout(() => setActiveNode(null), 200); if (id !== sequence[playerInput.length]) { setGameState('GAMEOVER'); return; } if (newInput.length === sequence.length) { if (round >= 5) { setGameState('SUCCESS'); onReward(diff!.reward); } else { setTimeout(() => startRound(diff!, sequence), 800); } } };
  const selectDiff = (d: Difficulty) => { setDiff(d); setRound(0); setSequence([]); setGameState('WATCH'); startRound(d, []); };
  if (gameState === 'MENU') return ( <div className="w-full max-w-sm p-8 bg-black/40 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl animate-in fade-in duration-500"> <div className="text-center mb-10"><Brain size={48} className="mx-auto text-indigo-500 mb-4 animate-pulse" /><h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-2">Neural Sync</h2><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Select Signal Complexity</p></div> <div className="space-y-4">{DIFFICULTIES.map(d => ( <button key={d.id} onClick={() => selectDiff(d)} className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-oasis-cyan transition-all active:scale-95 shadow-lg"><div className="text-left"><h4 className="font-black uppercase tracking-tight text-white group-hover:text-oasis-cyan transition-colors">{d.id}</h4><p className="text-[9px] text-gray-500 uppercase font-mono">{d.nodes} Neural Nodes</p></div><div className="text-xl font-black italic text-oasis-cyan">{d.reward} CR</div></button> ))}</div> </div> );
  return (
    <div className="w-full max-w-sm flex flex-col items-center p-6 bg-black/40 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500">
      <header className="text-center mb-6"><div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2 flex items-center justify-center gap-2"><Zap size={12} className="text-yellow-500" /> {diff?.id} PROTOCOL</div><div className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">{gameState === 'WATCH' ? 'Watch Pattern' : gameState === 'PLAY' ? 'Input Signal' : gameState === 'GAMEOVER' ? 'Sync Lost' : 'Sync Locked'}</div></header>
      <div className={`grid ${diff?.grid} gap-4 w-full mb-6 max-h-[40vh] overflow-y-auto no-scrollbar`}>{Array.from({ length: diff?.nodes || 4 }).map((_, i) => ( <button key={i} onClick={() => handleNodeClick(i)} disabled={gameState !== 'PLAY'} className={`h-24 rounded-2xl border-2 transition-all duration-300 active:scale-90 flex flex-col items-center justify-center ${activeNode === i ? `${colors[i % colors.length]} border-white shadow-[0_0_40px_rgba(255,255,255,0.4)]` : 'bg-white/5 border-white/5 grayscale-[0.5] opacity-20'}`}><div className={`w-3 h-3 rounded-full ${activeNode === i ? 'bg-white animate-ping' : 'bg-gray-700'}`} /></button> ))}</div>
      <div className="w-full flex justify-between items-center px-2"><div className="flex flex-col"><span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Stability</span><span className="text-xl font-black text-white italic leading-none">{round} / 5</span></div>{gameState === 'GAMEOVER' || gameState === 'SUCCESS' ? ( <button onClick={() => setGameState('MENU')} className="bg-oasis-cyan text-black px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-oasis-cyan/20">RE-LINK</button> ) : ( <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 ${gameState === 'WATCH' ? 'text-yellow-500' : 'text-oasis-cyan animate-pulse'}`}><span className="text-[10px] font-black uppercase tracking-widest">{gameState}ING...</span></div> )}</div>
      {gameState === 'SUCCESS' && ( <div className="absolute inset-0 bg-oasis-cyan/10 flex flex-col items-center justify-center animate-in fade-in duration-500 z-50"><div className="p-10 bg-[#050508] border border-oasis-cyan rounded-[2.5rem] text-center shadow-2xl backdrop-blur-xl"><CheckCircle2 size={48} className="text-oasis-cyan mx-auto mb-4" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Sync Verified</h3><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">+{diff?.reward} CR EARNED</p><button onClick={() => setGameState('MENU')} className="w-full bg-oasis-cyan text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-oasis-cyan/30">Acknowledge</button></div></div> )}
    </div>
  );
};

// --- Sub-Game: Word Scramble (Session Unique Words) ---
const WordScramble: React.FC<{ onReward: (amount: number) => void }> = ({ onReward }) => {
  const WORDS = ['CYBERPUNK', 'METAVERSE', 'AVATAR', 'NEXUS', 'UPLINK', 'PROXIMITY', 'ORBITAL', 'HARDWARE', 'SYNTHETIC', 'NEURAL', 'SIGNAL', 'CRYPTO', 'PROTOCOL', 'GATEWAY', 'FIREWALL', 'OVERRIDE', 'BANDWIDTH'];
  const MAX_TIME = 20;
  
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [isLost, setIsLost] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]); // Tracking session words
  
  const timerRef = useRef<any | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(MAX_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsLost(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const nextWord = useCallback(() => {
    // Determine available words based on used session history
    setUsedWords(prevUsed => {
      let available = WORDS.filter(w => !prevUsed.includes(w.toUpperCase()));
      
      // Exhausted dictionary? Reset.
      if (available.length === 0) {
        available = [...WORDS];
      }

      const newWord = available[Math.floor(Math.random() * available.length)].toUpperCase();
      
      // Update display states
      setWord(newWord);
      setScrambled(newWord.split('').sort(() => Math.random() - 0.5).join(''));
      setInput('');
      setIsLost(false);
      startTimer();

      // If we just reset, start new tracking list
      return available.length === WORDS.length ? [newWord] : [...prevUsed, newWord];
    });
  }, [startTimer]);

  useEffect(() => {
    nextWord();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []); // Run once on initial load

  const check = () => {
    if (isLost) return;
    if (input.toUpperCase().trim() === word) {
      const reward = 20 + (timeLeft * 4);
      onReward(reward);
      nextWord();
    }
  };

  const potentialReward = 20 + (timeLeft * 4);
  const timePercent = (timeLeft / MAX_TIME) * 100;

  return (
    <div className="w-full max-w-sm flex flex-col items-center p-8 bg-black/40 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
      {timeLeft < 5 && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />}

      <div className="w-full flex justify-between items-center mb-8 px-2">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1 flex items-center gap-1.5">
              <span className={timeLeft < 5 ? 'text-red-500 animate-bounce' : 'text-oasis-cyan'}>
                <Clock size={10} />
              </span>
              Uplink Stability
            </span>
            <div className={`text-xl font-mono font-black ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Potential Yield</span>
            <div className="text-xl font-black text-oasis-cyan italic tracking-tighter">
              {potentialReward} CR
            </div>
         </div>
      </div>

      <div className="w-full h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden border border-white/5">
        <div 
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            timePercent > 60 ? 'bg-oasis-cyan shadow-[0_0_10px_rgba(0,243,255,0.6)]' : 
            timePercent > 30 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]' : 
            'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.6)]'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {!isLost ? (
        <>
          <div className="text-center mb-10">
            <span className="text-[10px] text-oasis-cyan/40 font-black uppercase tracking-[0.6em] block mb-4 animate-pulse">Scrambled Data</span>
            <div className="text-4xl font-black text-white italic tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] uppercase">
              {scrambled}
            </div>
          </div>

          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && check()} 
            className="w-full bg-black border border-white/10 rounded-2xl p-5 text-center font-black uppercase mb-6 focus:border-oasis-cyan outline-none transition-all placeholder:text-gray-800 text-lg tracking-[0.3em]" 
            placeholder="..." 
            autoFocus 
            spellCheck={false} 
          />
          
          <button 
            onClick={check} 
            className="w-full bg-oasis-cyan text-black p-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-oasis-cyan/30 leading-none"
          >
            RESTORE_LINK
          </button>
        </>
      ) : (
        <div className="text-center py-6 animate-in zoom-in duration-300 w-full">
           <AlertTriangle size={48} className="text-red-500 mx-auto mb-6 animate-pulse" />
           <h3 className="text-2xl font-black text-red-500 italic tracking-tighter uppercase mb-2">Signal Lost</h3>
           
           <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl mb-8 flex flex-col items-center">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">Forensic Data Recovery</span>
              <div className="text-3xl font-black italic text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                {word}
              </div>
           </div>

           <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-10 px-4">The data packet has decayed. Terminal reset required.</p>
           <button 
             onClick={nextWord}
             className="w-full bg-white/5 hover:bg-white/10 text-white p-5 rounded-2xl font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
           >
             Re-Initialize Link
           </button>
        </div>
      )}
    </div>
  );
};

// --- Sub-Game: Crystal Crush ---
const CrystalCrush: React.FC<{ onReward: (amount: number) => void }> = ({ onReward }) => {
  const GRID_SIZE = 7;
  const CRYSTALS = ['💎', '🔥', '🍀', '⭐', '🟣', '🧿'];
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(25);
  const initGrid = useCallback(() => { let newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill('').map(() => CRYSTALS[Math.floor(Math.random() * CRYSTALS.length)])); setGrid(newGrid); setScore(0); setMoves(25); }, [CRYSTALS]);
  useEffect(() => initGrid(), [initGrid]);
  const checkMatches = (currentGrid: string[][]) => {
    let matches: { r: number, c: number }[] = [];
    for (let r = 0; r < GRID_SIZE; r++) { for (let c = 0; c < GRID_SIZE - 2; c++) { if (currentGrid[r][c] && currentGrid[r][c] === currentGrid[r][c+1] && currentGrid[r][c] === currentGrid[r][c+2]) { matches.push({r, c}, {r, c:c+1}, {r, c:c+2}); } } }
    for (let c = 0; c < GRID_SIZE; c++) { for (let r = 0; r < GRID_SIZE - 2; r++) { if (currentGrid[r][c] && currentGrid[r][c] === currentGrid[r+1][c] && currentGrid[r][c] === currentGrid[r+2][c]) { matches.push({r, c}, {r:r+1, c}, {r:r+2, c}); } } }
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
        for (let r = GRID_SIZE - 1; r >= 0; r--) { if (newGrid[r][c] !== '') { let temp = newGrid[r][c]; newGrid[r][c] = ''; newGrid[emptySpot][c] = temp; emptySpot--; } }
        for (let r = emptySpot; r >= 0; r--) { newGrid[r][c] = CRYSTALS[Math.floor(Math.random() * CRYSTALS.length)]; }
      }
      setGrid(newGrid); setTimeout(() => processGrid(newGrid), 800);
    }
  };
  const handleTileClick = (r: number, c: number) => {
    if (moves <= 0) return;
    if (!selected) { setSelected({r, c}); } else {
      const dr = Math.abs(selected.r - r); const dc = Math.abs(selected.c - c);
      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        const newGrid = grid.map(row => [...row]); const temp = newGrid[r][c]; newGrid[r][c] = newGrid[selected.r][selected.c]; newGrid[selected.r][selected.c] = temp;
        const matches = checkMatches(newGrid); if (matches.length > 0) { setGrid(newGrid); setMoves(m => m - 1); processGrid(newGrid); }
      }
      setSelected(null);
    }
  };
  return (
    <div className="flex flex-col items-center w-full max-w-sm p-4 bg-black/40 rounded-[3rem] border border-white/5 shadow-2xl">
      <div className="flex justify-between w-full mb-8 items-end px-4">
        <div><div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">SCORE_SYNC</div><div className="text-3xl font-black italic text-oasis-cyan tracking-tighter drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">{score}</div></div>
        <div className="text-right"><div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">CYCLES</div><div className={`text-3xl font-black italic tracking-tighter ${moves < 5 ? 'text-red-500 animate-pulse' : 'text-white opacity-80'}`}>{moves}</div></div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 bg-black/60 p-3 rounded-2xl border border-white/10 backdrop-blur-3xl shadow-inner">
        {grid.map((row, r) => row.map((tile, c) => ( <button key={`${r}-${c}`} onClick={() => handleTileClick(r, c)} className={`w-[11vw] h-[11vw] max-w-[48px] max-h-[48px] flex items-center justify-center text-2xl rounded-xl transition-all duration-500 active:scale-75 border border-transparent ${selected?.r === r && selected?.c === c ? 'bg-oasis-cyan/30 border-oasis-cyan shadow-[0_0_15px_rgba(0,243,255,0.5)] z-10' : 'hover:bg-white/5'}`}><span className={`transition-all duration-700 ${tile === '' ? 'scale-0' : 'scale-100 drop-shadow-sm'}`}>{tile}</span></button> )))}
      </div>
      {moves === 0 && ( <div className="mt-10 flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full"><div className="text-xl font-black mb-6 italic tracking-tighter uppercase text-yellow-400 leading-none">Sync Complete! +{Math.floor(score/10)} CR</div><button onClick={() => { onReward(Math.floor(score/10)); initGrid(); }} className="w-full bg-oasis-cyan text-black py-5 rounded-2xl font-black text-xs uppercase shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-95 transition-transform tracking-widest">Claim & Reboot</button></div> )}
    </div>
  );
};

export default ArcadeView;