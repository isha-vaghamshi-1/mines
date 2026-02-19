import React from 'react';
import { motion } from 'framer-motion';
import { Bomb, Gem } from 'lucide-react';

const Tile = ({ tile, onClick, gameState, index }) => {
    const isAutoRevealed = tile.revealed && !tile.userRevealed;
    const delay = isAutoRevealed ? index * 0.02 : 0;

    return (
        <div className="perspective-1000 w-full h-full">
            <motion.button
                className={`relative w-full h-full preserve-3d transition-shadow duration-300 
                    ${!tile.revealed && gameState !== 'ended' ? 'hover:shadow-[0_0_15px_rgba(93,95,239,0.3)]' : ''}`}
                onClick={onClick}
                disabled={tile.revealed || gameState === 'ended'}
                initial={false}
                animate={{ rotateY: tile.revealed ? 180 : 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 0.8,
                    delay: delay
                }}
            >
                {/* Front Side */}
                <div
                    className={`absolute inset-0 backface-hidden rounded-xl bg-tile-bg border border-white/5 
                    shadow-[inset_0_-4px_0_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] 
                    hover:bg-tile-hover transition-all duration-200 flex items-center justify-center cursor-pointer
                    ${gameState === 'ended' ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
                >
                </div>

                {/* Back Side (Revealed) */}
                <div
                    className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex items-center justify-center
                    ${tile.isMine
                            ? 'bg-gradient-to-br from-red-500 to-red-950 border border-white/10'
                            : 'bg-gradient-to-br from-indigo-600 to-slate-900 border border-white/10 shadow-[0_0_20px_rgba(93,95,239,0.2)]'
                        }`}
                >
                    <div className="absolute inset-0 bg-white/5 rounded-xl pointer-events-none" />
                    {tile.isMine ? (
                        <Bomb className="w-[60%] h-[60%] text-white drop-shadow-[0_0_12px_rgba(255,82,82,0.8)]" />
                    ) : (
                        <Gem className="w-[60%] h-[60%] text-success drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
                    )}
                </div>
            </motion.button>
        </div>
    );
};

export default Tile;
