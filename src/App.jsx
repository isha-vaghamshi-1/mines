import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pickaxe, Bomb, Gem, Coins, ArrowBigUp, ArrowBigDown, RefreshCcw, Trophy, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

const GRID_SIZE = 25; // 5x5

const App = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'ended'
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill({ revealed: false, isMine: false }));
  const [mines, setMines] = useState(new Set());
  const [revealedCount, setRevealedCount] = useState(0);
  const [lastResult, setLastResult] = useState(null); // 'win' or 'loss'
  const [isShaking, setIsShaking] = useState(false);

  // Calculate multiplier
  const currentMultiplier = useMemo(() => {
    if (revealedCount === 0) return 1.0;
    let mult = 1.0;
    const houseEdge = 0.99; // 1% house edge

    // Formula: Product of (total - i) / (safe - i)
    for (let i = 0; i < revealedCount; i++) {
      mult *= (GRID_SIZE - i) / (GRID_SIZE - mineCount - i);
    }

    return mult * houseEdge;
  }, [revealedCount, mineCount]);

  const currentProfit = (betAmount * currentMultiplier) - betAmount;
  const currentTotal = betAmount * currentMultiplier;

  // Initialize game
  const startGame = () => {
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setBalance(prev => prev - betAmount);

    // Generate random mines
    const newMines = new Set();
    while (newMines.size < mineCount) {
      newMines.add(Math.floor(Math.random() * GRID_SIZE));
    }

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

      // Auto win if all gems found
      if (newRevealedCount === GRID_SIZE - mineCount) {
        cashout();
      }
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

    // Reveal all mines on loss or win
    setGrid(prev => prev.map((tile, i) => ({
      ...tile,
      revealed: true
    })));

    if (result === 'win') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5d5fef', '#00e676', '#ffffff']
      });
    }
  };

  const adjustBet = (type) => {
    if (gameState === 'playing') return;
    if (type === 'half') setBetAmount(prev => Math.max(1, Math.floor(prev / 2)));
    if (type === 'double') setBetAmount(prev => prev * 2);
  };

  return (
    <div className="app-container">
      {/* Sidebar Controls */}
      <div className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo">
            <Pickaxe className="logo-icon" />
            <span>NEON MINES</span>
          </div>
          <div className="balance-display">
            <Coins className="coin-icon" />
            <span>{balance.toFixed(2)}</span>
          </div>
        </div>

        <div className="controls-body">
          <div className="input-group">
            <label>Bet Amount</label>
            <div className="bet-input-wrapper">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                disabled={gameState === 'playing'}
              />
              <div className="bet-actions">
                <button onClick={() => adjustBet('half')} disabled={gameState === 'playing'}>½</button>
                <button onClick={() => adjustBet('double')} disabled={gameState === 'playing'}>2x</button>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Mines ({mineCount})</label>
            <input
              type="range"
              min="2"
              max="24"
              value={mineCount}
              onChange={(e) => setMineCount(Number(e.target.value))}
              disabled={gameState === 'playing'}
              className="mine-slider"
            />
            <div className="mine-presets">
              {[3, 5, 10, 24].map(num => (
                <button
                  key={num}
                  onClick={() => setMineCount(num)}
                  className={mineCount === num ? 'active' : ''}
                  disabled={gameState === 'playing'}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            {gameState === 'playing' ? (
              <button className="cashout-btn" onClick={cashout} disabled={revealedCount === 0}>
                <div className="btn-content">
                  <span>Cashout</span>
                  <span className="cashout-val">{(betAmount * currentMultiplier).toFixed(2)}</span>
                </div>
              </button>
            ) : (
              <button className="bet-btn" onClick={startGame}>
                BET
              </button>
            )}
          </div>
        </div>

        {revealedCount > 0 && gameState === 'playing' && (
          <div className="stats-box glass-panel">
            <div className="stat-item">
              <span className="label">Current Multiplier</span>
              <span className="value highlight">{currentMultiplier.toFixed(2)}x</span>
            </div>
            <div className="stat-item">
              <span className="label">Potential Profit</span>
              <span className="value success">+{currentProfit.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <main className="game-area">
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`result-banner ${lastResult}`}
            >
              {lastResult === 'win' ? (
                <>
                  <Trophy className="banner-icon" />
                  <span>YOU WON {(betAmount * currentMultiplier).toFixed(2)}!</span>
                </>
              ) : (
                <>
                  <Skull className="banner-icon" />
                  <span>BOOM! GAME OVER</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="grid-container"
          animate={isShaking ? {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
          } : {}}
        >
          <div className="mines-grid">
            {grid.map((tile, i) => (
              <Tile
                key={i}
                index={i}
                tile={tile}
                onClick={() => handleTileClick(i)}
                gameState={gameState}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const Tile = ({ tile, onClick, index, gameState }) => {
  return (
    <motion.button
      className={`tile ${tile.revealed ? 'revealed' : ''} ${tile.revealed && tile.isMine ? 'mine' : ''} ${tile.revealed && !tile.isMine ? 'gem' : ''}`}
      onClick={onClick}
      whileHover={!tile.revealed && gameState === 'playing' ? { scale: 1.05, backgroundColor: 'var(--tile-hover)' } : {}}
      whileTap={!tile.revealed && gameState === 'playing' ? { scale: 0.95 } : {}}
      disabled={tile.revealed || gameState === 'ended'}
    >
      <AnimatePresence mode="wait">
        {!tile.revealed ? (
          <motion.div
            key="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, rotateY: 90 }}
            className="tile-hidden"
          />
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, rotateY: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="tile-content"
          >
            {tile.isMine ? (
              <Bomb className="tile-icon bomb-icon" />
            ) : (
              <Gem className="tile-icon gem-icon" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default App;
