import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pickaxe, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

// Shared Components
import Tile from './shared/components/Tile';
import ResultBanner from './shared/components/ResultBanner';

// Utils
import { GRID_SIZE, calculateMultiplier, generateMines, formatCurrency } from './shared/utils/gameLogic';

const App = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'ended'
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill({ revealed: false, isMine: false }));
  const [mines, setMines] = useState(new Set());
  const [revealedCount, setRevealedCount] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  // Use Memoized multiplier
  const currentMultiplier = useMemo(() => calculateMultiplier(revealedCount, mineCount), [revealedCount, mineCount]);
  const currentProfit = (betAmount * currentMultiplier) - betAmount;

  const startGame = () => {
    if (balance < betAmount) return alert("Insufficient balance!");

    setBalance(prev => prev - betAmount);
    const newMines = generateMines(mineCount);
    setMines(newMines);
    setGrid(Array(GRID_SIZE).fill(null).map((_, i) => ({
      revealed: false,
      isMine: newMines.has(i)
    })));
    setRevealedCount(0);
    setGameState('playing');
    setLastResult(null);
  };

  const handleTileClick = (index) => {
    if (gameState !== 'playing' || grid[index].revealed) return;

    const newGrid = [...grid];
    const isMine = mines.has(index);

    newGrid[index] = { ...newGrid[index], revealed: true };
    setGrid(newGrid);

    if (isMine) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      gameOver('loss');
    } else {
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      if (newRevealedCount === GRID_SIZE - mineCount) cashout();
    }
  };

  const cashout = () => {
    if (gameState !== 'playing' || revealedCount === 0) return;
    const winAmount = betAmount * currentMultiplier;
    setBalance(prev => prev + winAmount);
    gameOver('win', winAmount);
  };

  const gameOver = (result, winAmount = 0) => {
    setGameState('ended');
    setLastResult(result);
    setGrid(prev => prev.map((tile, i) => ({ ...tile, revealed: true })));
    if (result === 'win') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#5d5fef', '#00e676', '#ffffff'] });
    }
  };

  const adjustBet = (type) => {
    if (gameState === 'playing') return;
    setBetAmount(prev => type === 'half' ? Math.max(1, Math.floor(prev / 2)) : prev * 2);
  };

  return (
    <div className="flex h-screen w-screen bg-[radial-gradient(circle_at_50%_50%,#1e2235_0%,#0f111a_100%)] overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-80 h-full p-8 flex flex-col gap-8 glass-panel rounded-none border-y-0 border-l-0 z-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 font-outfit text-2xl font-extrabold tracking-widest text-primary uppercase">
            <Pickaxe className="w-8 h-8 drop-shadow-primary-glow" />
            <span>Neon Mines</span>
          </div>
          <div className="bg-black/40 p-3 px-5 rounded-xl flex items-center gap-2.5 font-bold border border-white/10">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>{formatCurrency(balance)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bet Amount</label>
            <div className="flex bg-bg-accent rounded-xl p-1 border border-white/10">
              <input
                type="number"
                className="bg-transparent border-none text-white px-4 py-2 w-full font-semibold focus:outline-none"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                disabled={gameState === 'playing'}
              />
              <div className="flex gap-1">
                <button onClick={() => adjustBet('half')} disabled={gameState === 'playing'} className="bg-tile-bg text-slate-400 px-3 py-1 rounded-lg font-bold hover:text-white transition-colors">½</button>
                <button onClick={() => adjustBet('double')} disabled={gameState === 'playing'} className="bg-tile-bg text-slate-400 px-3 py-1 rounded-lg font-bold hover:text-white transition-colors">2x</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mines ({mineCount})</label>
            <input
              type="range" min="2" max="24" value={mineCount}
              onChange={(e) => setMineCount(Number(e.target.value))}
              disabled={gameState === 'playing'}
              className="mine-slider"
            />
            <div className="flex gap-2 mt-2">
              {[3, 5, 10, 24].map(num => (
                <button
                  key={num}
                  onClick={() => setMineCount(num)}
                  disabled={gameState === 'playing'}
                  className={`flex-1 p-1.5 rounded-lg text-xs font-bold border transition-all ${mineCount === num ? 'bg-primary border-primary shadow-primary-glow text-white' : 'bg-tile-bg border-white/10 text-slate-400'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2">
            {gameState === 'playing' ? (
              <button className="btn-success w-full" onClick={cashout} disabled={revealedCount === 0}>
                <div className="flex justify-between items-center w-full">
                  <span>Cashout</span>
                  <span className="text-xs bg-black/10 px-2.5 py-0.5 rounded-md">{(betAmount * currentMultiplier).toFixed(2)}</span>
                </div>
              </button>
            ) : (
              <button className="btn-primary w-full" onClick={startGame}>BET</button>
            )}
          </div>
        </div>

        {revealedCount > 0 && gameState === 'playing' && (
          <div className="mt-auto p-5 glass-panel flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Multiplier</span>
              <span className="font-outfit font-bold text-primary text-xl">{currentMultiplier.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Profit</span>
              <span className="font-bold text-success">+{currentProfit.toFixed(2)}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-10 relative">
        <AnimatePresence>
          {lastResult && <ResultBanner result={lastResult} amount={betAmount * currentMultiplier} />}
        </AnimatePresence>

        <motion.div
          className="bg-white/2 p-5 rounded-3xl border border-white/5 shadow-2xl"
          animate={isShaking ? { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } } : {}}
        >
          <div className="grid grid-cols-5 grid-rows-5 gap-3 w-[375px] h-[375px] md:w-[450px] md:h-[450px] md:gap-4">
            {grid.map((tile, i) => (
              <Tile key={i} tile={tile} onClick={() => handleTileClick(i)} gameState={gameState} />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default App;
