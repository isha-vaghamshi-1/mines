import React from 'react';

const StatsBox = ({ revealedCount, currentMultiplier, currentProfit }) => {
    if (revealedCount === 0) return null;

    return (
        <div className="mt-auto p-4 md:p-5 glass-panel flex flex-col gap-2 md:gap-3">
            <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-slate-400">Multiplier</span>
                <span className="font-outfit font-bold text-primary text-lg md:text-xl">{currentMultiplier.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-slate-400">Profit</span>
                <span className="font-bold text-success">+{currentProfit.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default StatsBox;
