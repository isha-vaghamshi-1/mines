import React from 'react';
import { motion } from 'framer-motion';
import Tile from './Tile';

const GameGrid = ({ grid, onTileClick, gameState, isShaking }) => {
    return (
        <motion.div
            className="bg-white/2 p-3 md:p-5 rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl"
            animate={isShaking ? { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } } : {}}
        >
            <div className="grid grid-cols-5 grid-rows-5 gap-2 md:gap-4 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px]">
                {grid.map((tile, i) => (
                    <Tile
                        key={i}
                        tile={tile}
                        onClick={() => onTileClick(i)}
                        gameState={gameState}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default GameGrid;
