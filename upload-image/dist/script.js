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
    const outerContainer = document.getElementById('outer-container');
    outerContainer.innerHTML = ''; // Clear previous swatches
    colors.forEach((color, index) => {
        const innerContainer = document.createElement('div');
        innerContainer.className = 'inner-container';

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
        innerContainer.appendChild(swatch);
        outerContainer.appendChild(innerContainer);
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
document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('contrastRange').addEventListener('input', adjustContrast);

loadColors();

let mainCanvas = document.getElementById('weavingCanvas');
let ctx = mainCanvas.getContext('2d');

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

function saveHistory() {
    // Function to save the current state of the grid (optional)
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = gridSize;
            tempCanvas.height = gridSize;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(img, 0, 0, gridSize, gridSize);

            const imgData = tempCtx.getImageData(0, 0, gridSize, gridSize).data;
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const index = (i * gridSize + j) * 4;
                    const r = imgData[index];
                    const g = imgData[index + 1];
                    const b = imgData[index + 2];
                    grid[i][j] = `rgb(${r},${g},${b})`;
                }
            }
            drawGrid();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function adjustContrast(event) {
    const contrast = event.target.value;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let color = grid[i][j];
            let rgb = color.match(/\d+/g);
            rgb = rgb.map(val => {
                val = parseInt(val);
                val = ((val - 128) * contrast / 100) + 128;
                val = Math.max(0, Math.min(255, val));
                return val;
            });
            grid[i][j] = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        }
    }
    drawGrid();
}


const plainWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (i + j) % 2 === 0 ? selectedColor : '#ffffff')
    );
};

const basketWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (Math.floor(i / 2) + Math.floor(j / 2)) % 2 === 0 ? selectedColor : '#ffffff')
    );
};

const twillWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i + j) % size < size / 2) ? selectedColor : '#ffffff')
    );
};

const satinWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i * 2 + j * 3) % size) < size / 2 ? selectedColor : '#ffffff')
    );
};

const honeycombWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i ^ j) % size) < size / 2 ? selectedColor : '#ffffff')
    );
};

const huckabackWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i % 2) ^ (j % 2)) ? selectedColor : '#ffffff')
    );
};

const mockLenoWeave = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (Math.floor(i / 2) % 2 === 0) ^ (Math.floor(j / 2) % 2 === 0) ? selectedColor : '#ffffff')
    );
};

const mapuchePattern = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i % 4 === 0 || j % 4 === 0) ? selectedColor : '#ffffff'))
    );
};

const incaPattern = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i % 3 === 0 && j % 3 === 0) || ((i + j) % 3 === 0) ? selectedColor : '#ffffff'))
    );
};

const aztecPattern = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i % 2 === 0 && j % 2 === 0) || ((i + j) % 2 === 0) ? selectedColor : '#ffffff'))
    );
};

const diamondPattern = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => Math.abs(i - j) <= 1 || Math.abs(i + j - size + 1) <= 1 ? selectedColor : '#ffffff')
    );
};

const zigzagPattern = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (i % 2 === 0) === (j % 2 === 0) ? selectedColor : '#ffffff')
    );
};

const crossPattern = (size) => {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (i === Math.floor(size / 2) || j === Math.floor(size / 2)) ? selectedColor : '#ffffff')
    );
};

const applyPattern = (patternFunc) => {
    const pattern = patternFunc(gridSize);
    pattern.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            grid[rowIndex][colIndex] = value;
        });
    });
    drawGrid();
};