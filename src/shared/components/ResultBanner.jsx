import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Skull } from 'lucide-react';

const ResultBanner = ({ result, amount }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute top-10 px-10 py-4 rounded-full flex items-center gap-4 font-extrabold text-lg shadow-2xl z-20 
        ${result === 'win' ? 'bg-success text-green-950' : 'bg-danger text-red-950'}`}
        >
            {result === 'win' ? (
                <>
                    <Trophy className="w-6 h-6" />
                    <span>YOU WON {amount.toFixed(2)}!</span>
                </>
            ) : (
                <>
                    <Skull className="w-6 h-6" />
                    <span>BOOM! GAME OVER</span>
                </>
            )}
        </motion.div>
    );
};

export default ResultBanner;
