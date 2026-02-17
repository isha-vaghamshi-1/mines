import React from 'react';
import { Pickaxe, Coins } from 'lucide-react';
import { formatCurrency } from '../utils/gameLogic';

const Header = ({ balance }) => {
    return (
        <div className="flex flex-row md:flex-col justify-between items-center md:items-start gap-4 md:gap-6">
            <div className="flex items-center gap-3 font-outfit text-xl md:text-2xl font-extrabold tracking-widest text-primary uppercase text-nowrap">
                <Pickaxe className="w-6 h-6 md:w-8 md:h-8 drop-shadow-primary-glow" />
                <span>Neon Mines</span>
            </div>
            <div className="bg-black/40 p-2 md:p-3 px-4 md:px-5 rounded-xl flex items-center gap-2.5 font-bold border border-white/10">
                <Coins className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                <span className="text-sm md:text-base">{formatCurrency(balance)}</span>
            </div>
        </div>
    );
};

export default Header;
