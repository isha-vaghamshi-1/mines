import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Shared Components
import Tile from './shared/components/Tile';
import ResultBanner from './shared/components/ResultBanner';
import Header from './shared/components/Header';
import BetControls from './shared/components/BetControls';
import StatsBox from './shared/components/StatsBox';
import GameGrid from './shared/components/GameGrid';

// Utils
import { GRID_SIZE, calculateMultiplier, generateMines } from './shared/utils/gameLogic';

const App = () => {
  const { register, watch, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      betAmount: 10,
      mineCount: 3,
      balance: 1000,
      gameState: 'idle',
      lastResult: null,
      revealedCount: 0,
    }
  });

  const watchedBetAmount = watch('betAmount');
  const watchedMineCount = watch('mineCount');
  const watchedGameState = watch('gameState');
  const watchedBalance = watch('balance');
  const watchedLastResult = watch('lastResult');
  const watchedRevealedCount = watch('revealedCount');

  const [grid, setGrid] = useState(Array(GRID_SIZE).fill({ revealed: false, isMine: false }));
  const [mines, setMines] = useState(new Set());
  const [isShaking, setIsShaking] = useState(false);

  const currentMultiplier = useMemo(() =>
    calculateMultiplier(watchedRevealedCount, watchedMineCount),
    [watchedRevealedCount, watchedMineCount]
  );

  const currentProfit = (watchedBetAmount * currentMultiplier) - watchedBetAmount;

  const onStartGame = (data) => {
    if (watchedBalance < data.betAmount) return alert("Insufficient balance!");

    setValue('balance', watchedBalance - data.betAmount);
    setValue('revealedCount', 0);
    setValue('gameState', 'playing');
    setValue('lastResult', null);

    const newMines = generateMines(data.mineCount);
    setMines(newMines);
    setGrid(Array(GRID_SIZE).fill(null).map((_, i) => ({
      revealed: false,
      isMine: newMines.has(i)
    })));
  };

  const handleTileClick = (index) => {
    if (watchedGameState !== 'playing' || grid[index].revealed) return;

    const newGrid = [...grid];
    const isMine = mines.has(index);

    newGrid[index] = { ...newGrid[index], revealed: true };
    setGrid(newGrid);

    if (isMine) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      endGame('loss');
    } else {
      const newRevealedCount = watchedRevealedCount + 1;
      setValue('revealedCount', newRevealedCount);
      if (newRevealedCount === GRID_SIZE - watchedMineCount) cashout();
    }
  };

  const cashout = () => {
    if (watchedGameState !== 'playing' || watchedRevealedCount === 0) return;
    const winAmount = watchedBetAmount * currentMultiplier;
    setValue('balance', watchedBalance + winAmount);
    endGame('win', winAmount);
  };

  const endGame = (result, winAmount = 0) => {
    setValue('gameState', 'ended');
    setValue('lastResult', result);
    setGrid(prev => prev.map((tile, i) => ({ ...tile, revealed: true })));

    if (result === 'win') {
      confetti({
        particleCount: 150, spread: 100, origin: { y: 0.6, x: 0.58 },
        colors: ['#5d5fef', '#00e676', '#ffffff']
      });
    }
  };

  const adjustBet = (type) => {
    if (watchedGameState === 'playing') return;
    const currentBet = Number(getValues('betAmount'));
    setValue('betAmount', type === 'half' ? Math.max(1, Math.floor(currentBet / 2)) : currentBet * 2);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[radial-gradient(circle_at_50%_50%,#1e2235_0%,#0f111a_100%)] overflow-hidden">
      <aside className="w-full md:w-80 h-auto md:h-full p-4 md:p-8 flex flex-col gap-4 md:gap-8 glass-panel rounded-none border-x-0 md:border-y-0 md:border-l-0 z-10 overflow-y-auto">
        <Header balance={watchedBalance} />

        <BetControls
          register={register}
          watchedMineCount={watchedMineCount}
          watchedGameState={watchedGameState}
          watchedBetAmount={watchedBetAmount}
          watchedRevealedCount={watchedRevealedCount}
          currentMultiplier={currentMultiplier}
          handleSubmit={handleSubmit}
          onStartGame={onStartGame}
          adjustBet={adjustBet}
          setValue={setValue}
          cashout={cashout}
        />

        {watchedGameState === 'playing' && (
          <StatsBox
            revealedCount={watchedRevealedCount}
            currentMultiplier={currentMultiplier}
            currentProfit={currentProfit}
          />
        )}
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden">
        <AnimatePresence>
          {watchedLastResult && (
            <ResultBanner
              result={watchedLastResult}
              amount={watchedBetAmount * currentMultiplier}
            />
          )}
        </AnimatePresence>

        <GameGrid
          grid={grid}
          onTileClick={handleTileClick}
          gameState={watchedGameState}
          isShaking={isShaking}
        />
      </main>
    </div>
  );
};

export default App;
