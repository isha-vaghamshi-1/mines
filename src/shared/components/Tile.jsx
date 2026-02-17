import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Gem } from 'lucide-react';

const Tile = ({ tile, onClick, gameState }) => {
    return (
        <motion.button
            className={`relative w-full h-full rounded-xl border-none cursor-pointer overflow-hidden transition-all duration-200 
        ${tile.revealed
                    ? (tile.isMine ? 'bg-gradient-to-br from-red-500 to-red-950 border border-red-500/30' : 'bg-gradient-to-br from-indigo-600 to-slate-900 border border-indigo-500/30 shadow-[0_0_20px_rgba(93,95,239,0.2)]')
                    : 'bg-tile-bg shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)] hover:bg-tile-hover active:scale-95'}
        ${gameState === 'ended' ? 'cursor-default' : ''}`}
            onClick={onClick}
            disabled={tile.revealed || gameState === 'ended'}
        >
            <AnimatePresence mode="wait">
                {!tile.revealed ? (
                    <motion.div
                        key="hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        className="w-full h-full"
                    />
                ) : (
                    <motion.div
                        key="revealed"
                        initial={{ opacity: 0, rotateY: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center justify-center w-full h-full"
                    >
                        {tile.isMine ? (
                            <Bomb className="w-[60%] h-[60%] text-white drop-shadow-[0_0_12px_rgba(255,82,82,0.8)]" />
                        ) : (
                            <Gem className="w-[60%] h-[60%] text-success drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default Tile;
