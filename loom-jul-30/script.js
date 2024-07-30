let lockedColors = {};
let selectedColor = "#000000";
let gridSize = 16;
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('#ffffff'));

function loadColors() {
    fetch('https://raw.githubusercontent.com/krlmnz/internet-loom/main/pantone-color.json')
        .then(response => response.json())
        .then(data => {
            const pantoneData = data;
            const randomColors = getRandomColors(pantoneData, 40);
            displayColorSwatches(randomColors);
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
}

function getRandomColors(colorData, numColors) {
    const selectedColors = [];
    const colorCount = colorData.values.length;

    for (let i = 0; i < numColors; i++) {
        if (lockedColors[i]) {
            selectedColors.push(lockedColors[i]);
        } else {
            const randomIndex = Math.floor(Math.random() * colorCount);
            selectedColors.push(colorData.values[randomIndex]);
        }
    }

    return selectedColors;
}

function displayColorSwatches(colors) {
    const colorSwatchesContainer = document.getElementById('color-swatches-container');
    colorSwatchesContainer.innerHTML = ''; // Clear previous swatches
    colors.forEach((color, index) => {
        const swatchContainer = document.createElement('div');
        swatchContainer.className = 'inner-container';

        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = color;
        swatch.addEventListener('click', () => {
            selectedColor = color;
        });

        const lockButton = document.createElement('button');
        lockButton.className = `lock-button ${lockedColors[index] ? 'locked' : 'unlocked'}`;
        lockButton.setAttribute('aria-label', lockedColors[index] ? 'Unlock color' : 'Lock color');
        lockButton.innerHTML = `<i class="fas ${lockedColors[index] ? 'fa-lock' : 'fa-lock-open'}"></i>`;
        lockButton.addEventListener('click', () => toggleLock(index, color, lockButton));

        swatch.appendChild(lockButton);
        swatchContainer.appendChild(swatch);
        colorSwatchesContainer.appendChild(swatchContainer);
    });
}

function toggleLock(index, color, button) {
    if (lockedColors[index]) {
        delete lockedColors[index];
        button.className = 'lock-button unlocked';
        button.setAttribute('aria-label', 'Lock color');
        button.innerHTML = '<i class="fas fa-lock-open"></i>';
    } else {
        lockedColors[index] = color;
        button.className = 'lock-button locked';
        button.setAttribute('aria-label', 'Unlock color');
        button.innerHTML = '<i class="fas fa-lock"></i>';
    }
}

document.getElementById('reload-button').addEventListener('click', loadColors);

loadColors();

let mainCanvas = document.getElementById('weaving-canvas');
let ctx = mainCanvas.getContext('2d');

function resizeCanvas() {
    const canvasWidth = Math.min(window.innerWidth * 0.8, 512);
    mainCanvas.width = canvasWidth;
    mainCanvas.height = canvasWidth;
    cellSize = mainCanvas.width / gridSize;

    const canvasContainer = document.getElementById('canvas-container');
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
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.querySelectorAll('.click-area').forEach(area => area.remove());

    const dotSize = 32;
    const offset = dotSize / 2;
    for (let i = 0; i < gridSize; i++) {
        let topArea = document.createElement('div');
        topArea.classList.add('click-area');
        topArea.style.left = (i * cellSize + cellSize / 2 - offset) + 'px';
        topArea.style.top = (-dotSize - 0) + 'px';
        topArea.addEventListener('click', () => fillColumn(i));
        canvasContainer.appendChild(topArea);

        let bottomArea = document.createElement('div');
        bottomArea.classList.add('click-area');
        bottomArea.style.left = (i * cellSize + cellSize / 2 - offset) + 'px';
        bottomArea.style.top = (mainCanvas.height + 0) + 'px';
        bottomArea.addEventListener('click', () => fillColumn(i));
        canvasContainer.appendChild(bottomArea);

        let leftArea = document.createElement('div');
        leftArea.classList.add('click-area');
        leftArea.style.top = (i * cellSize + cellSize / 2 - offset) + 'px';
        leftArea.style.left = (-dotSize - 0) + 'px';
        leftArea.addEventListener('click', () => fillRow(i));
        canvasContainer.appendChild(leftArea);

        let rightArea = document.createElement('div');
        rightArea.classList.add('click-area');
        rightArea.style.top = (i * cellSize + cellSize / 2 - offset) + 'px';
        rightArea.style.left = (mainCanvas.width + 0) + 'px';
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


const twillWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i + j) % size < size / 2) ? 1 : 0)
    );
};


const applyPattern = (patternFunc) => {
    const pattern = patternFunc(gridSize);
    pattern.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            grid[rowIndex][colIndex] = value === 1 ? selectedColor : 'white';
        });
    });
    drawGrid();
};

function saveHistory() {
    // Function to save the current state of the grid (optional)
}

document.getElementById("colorPicker").addEventListener("change", function(event) {
    selectedColor = event.target.value;
});

document.querySelectorAll(".circle").forEach(circle => {
    circle.addEventListener("click", function(event) {
        const id = event.target.id;

        if (isNaN(id)) { // Column click
            for (let i = 1; i <= 16; i++) {
                document.getElementById(id + i).style.backgroundColor = selectedColor;
            }
        } else { // Row click
            const rowId = parseInt(id);
            const columns = "ABCDEFGHIJKLMNOP".split("");
            columns.forEach(col => {
                document.getElementById(col + rowId).style.backgroundColor = selectedColor;
            });
        }
    });
});

document.querySelectorAll(".grid-box").forEach(gridBox => {
    gridBox.addEventListener("click", function(event) {
        const gridBoxId = event.target.id;
        document.getElementById(gridBoxId).style.backgroundColor = selectedColor;
    });
});