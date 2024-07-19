let mainCanvas = document.getElementById('weavingCanvas');
let ctx = mainCanvas.getContext('2d');
let gridSize = 16;
let cellSize;
let grid = [];
let selectedColor = '#000000';

function resizeCanvas() {
    const canvasWidth = Math.min(window.innerWidth * 0.8, 512);
    mainCanvas.width = canvasWidth;
    mainCanvas.height = canvasWidth;
    cellSize = mainCanvas.width / gridSize;

    const canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.style.width = canvasWidth + 'px';
    canvasContainer.style.height = canvasWidth + 'px';

    createClickAreas();
    drawGrid();
}

function initializeCanvas(rows, cols) {
    gridSize = rows;
    grid = Array.from({ length: rows }, () => Array(cols).fill('white'));
    resizeCanvas();
}

function drawGrid() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            ctx.beginPath();
            ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.fillStyle = grid[row][col];
            ctx.fill();
            ctx.stroke();
        }
    }
}

function fillRow(row) {
    for (let col = 0; col < gridSize; col++) {
        grid[row][col] = selectedColor;
    }
    drawGrid();
    saveHistory();
}

function fillColumn(col) {
    for (let row = 0; row < gridSize; row++) {
        grid[row][col] = selectedColor;
    }
    drawGrid();
    saveHistory();
}

function createClickAreas() {
    const canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.querySelectorAll('.click-area').forEach(area => area.remove());

    const dotSize = 32;
    const offset = dotSize / 2;
    for (let i = 0; i < gridSize; i++) {
        let topArea = document.createElement('div');
        topArea.classList.add('click-area');
        topArea.style.left = (i * cellSize + cellSize / 2 - offset) + 'px';
        topArea.style.top = (-dotSize - 5) + 'px';
        topArea.addEventListener('click', () => fillColumn(i));
        canvasContainer.appendChild(topArea);

        let bottomArea = document.createElement('div');
        bottomArea.classList.add('click-area');
        bottomArea.style.left = (i * cellSize + cellSize / 2 - offset) + 'px';
        bottomArea.style.top = (mainCanvas.height + 5) + 'px';
        bottomArea.addEventListener('click', () => fillColumn(i));
        canvasContainer.appendChild(bottomArea);

        let leftArea = document.createElement('div');
        leftArea.classList.add('click-area');
        leftArea.style.top = (i * cellSize + cellSize / 2 - offset) + 'px';
        leftArea.style.left = (-dotSize - 5) + 'px';
        leftArea.addEventListener('click', () => fillRow(i));
        canvasContainer.appendChild(leftArea);

        let rightArea = document.createElement('div');
        rightArea.classList.add('click-area');
        rightArea.style.top = (i * cellSize + cellSize / 2 - offset) + 'px';
        rightArea.style.left = (mainCanvas.width + 5) + 'px';
        rightArea.addEventListener('click', () => fillRow(i));
        canvasContainer.appendChild(rightArea);
    }
}

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

initializeCanvas(16, 16);
