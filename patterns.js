const plainWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (i + j) % 2 === 0 ? 1 : 0)
    );
};

const basketWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (Math.floor(i / 2) + Math.floor(j / 2)) % 2 === 0 ? 1 : 0)
    );
};

const twillWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i + j) % size < size / 2) ? 1 : 0)
    );
};

const satinWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i * 2 + j * 3) % size) < size / 2 ? 1 : 0)
    );
};

const honeycombWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i ^ j) % size) < size / 2 ? 1 : 0)
    );
};

const huckabackWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i % 2) ^ (j % 2)) ? 1 : 0)
    );
};

const mockLenoWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (Math.floor(i / 2) % 2 === 0) ^ (Math.floor(j / 2) % 2 === 0) ? 1 : 0)
    );
};

const patterns = [plainWeave, basketWeave, twillWeave, satinWeave, honeycombWeave, huckabackWeave, mockLenoWeave];

const applyPattern = (patternFunc) => {
    const pattern = patternFunc(gridSize);
    pattern.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            grid[rowIndex][colIndex] = value === 1 ? selectedColor : 'white';
        });
    });
    drawGrid();
};