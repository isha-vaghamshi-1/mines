import React from 'react';

const BetControls = ({
    register,
    watchedMineCount,
    watchedGameState,
    watchedBetAmount,
    watchedRevealedCount,
    currentMultiplier,
    handleSubmit,
    onStartGame,
    adjustBet,
    setValue,
    cashout
}) => {
    return (
        <form onSubmit={handleSubmit(onStartGame)} className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bet Amount</label>
                <div className="flex bg-bg-accent rounded-xl p-1 border border-white/10">
                    <input
                        {...register('betAmount', { valueAsNumber: true, min: 0 })}
                        type="number"
                        className="bg-transparent border-none text-white px-4 py-2 w-full font-semibold focus:outline-none"
                        disabled={watchedGameState === 'playing'}
                    />
                    <div className="flex gap-1">
                        <button type="button" onClick={() => adjustBet('half')} disabled={watchedGameState === 'playing'} className="bg-tile-bg text-slate-400 px-3 py-1 rounded-lg font-bold hover:text-white transition-colors">½</button>
                        <button type="button" onClick={() => adjustBet('double')} disabled={watchedGameState === 'playing'} className="bg-tile-bg text-slate-400 px-3 py-1 rounded-lg font-bold hover:text-white transition-colors">2x</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mines ({watchedMineCount})</label>
                <input
                    {...register('mineCount', { valueAsNumber: true })}
                    type="range" min="2" max="24"
                    disabled={watchedGameState === 'playing'}
                    className="mine-slider"
                />
                <div className="flex gap-2 mt-2">
                    {[3, 5, 10, 24].map(num => (
                        <button
                            key={num} type="button" onClick={() => setValue('mineCount', num)}
                            disabled={watchedGameState === 'playing'}
                            className={`flex-1 p-1.5 rounded-lg text-xs font-bold border transition-all ${watchedMineCount === num ? 'bg-primary border-primary shadow-primary-glow text-white' : 'bg-tile-bg border-white/10 text-slate-400'}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-2">
                {watchedGameState === 'playing' ? (
                    <button type="button" className="btn-success w-full" onClick={cashout} disabled={watchedRevealedCount === 0}>
                        <div className="flex justify-between items-center w-full">
                            <span>Cashout</span>
                            <span className="text-xs bg-black/10 px-2.5 py-0.5 rounded-md">{(watchedBetAmount * currentMultiplier).toFixed(2)}</span>
                        </div>
                    </button>
                ) : (
                    <button type="submit" className="btn-primary w-full">BET</button>
                )}
            </div>
        </form>
    );
};

export default BetControls;
