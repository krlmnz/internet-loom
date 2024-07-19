let history = [];
let historyIndex = -1;

document.getElementById('colorPicker').addEventListener('input', (event) => {
    selectedColor = event.target.value;
});

document.querySelectorAll('.theme-row input').forEach(input => {
    input.addEventListener('change', (event) => {
        loadSwatches(event.target.value);
    });
});

mainCanvas.addEventListener('click', function(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    grid[row][col] = selectedColor;
    drawGrid();
    saveHistory();
});

window.addEventListener('resize', resizeCanvas);

function exportSVG() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mainCanvas.width}" height="${mainCanvas.height}">`;
    let content = `${svg}`;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            content += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${grid[row][col]}"/>`;
        }
    }
    content += `</svg>`;
    const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "canvas.svg";
    link.click();
    URL.revokeObjectURL(url);
}

function exportPNG() {
    const link = document.createElement("a");
    link.href = mainCanvas.toDataURL("image/png");
    link.download = "canvas.png";
    link.click();
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        grid = JSON.parse(JSON.stringify(history[historyIndex]));
        drawGrid();
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        grid = JSON.parse(JSON.stringify(history[historyIndex]));
        drawGrid();
    }
}

function loadPattern() {
    initializeCanvas(gridSize, gridSize);
    drawGrid();
}

function saveHistory() {
    history = history.slice(0, historyIndex + 1);
    history.push(JSON.parse(JSON.stringify(grid)));
    historyIndex++;
}

initializeCanvas(16, 16);
saveHistory();
