export const GRID_SIZE = 25;

export const calculateMultiplier = (revealedCount, mineCount) => {
    if (revealedCount === 0) return 1.0;
    let mult = 1.0;
    const houseEdge = 0.99;

    for (let i = 0; i < revealedCount; i++) {
        mult *= (GRID_SIZE - i) / (GRID_SIZE - mineCount - i);
    }

    return mult * houseEdge;
};

export const generateMines = (mineCount) => {
    const newMines = new Set();
    while (newMines.size < mineCount) {
        newMines.add(Math.floor(Math.random() * GRID_SIZE));
    }
    return newMines;
};

export const formatCurrency = (amount) => {
    return amount.toFixed(2);
};
