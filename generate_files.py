import os

files = [
    {
        'name': 'canvas.js',
        'content': """
let mainCanvas = document.getElementById('weavingCanvas');
let ctx = mainCanvas.getContext('2d');
let gridSize = 8;
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
}

function fillColumn(col) {
    for (let row = 0; row < gridSize; row++) {
        grid[row][col] = selectedColor;
    }
    drawGrid();
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
});

window.addEventListener('resize', resizeCanvas);

initializeCanvas(8, 8);
"""
    },
    {
        'name': 'patterns.js',
        'content': """
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
"""
    },
    {
        'name': 'events.js',
        'content': """
document.getElementById('colorPicker').addEventListener('input', (event) => {
    selectedColor = event.target.value;
});

document.getElementById('themeSelector').addEventListener('change', (event) => {
    loadSwatches(event.target.value);
});

mainCanvas.addEventListener('click', function(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    grid[row][col] = selectedColor;
    drawGrid();
});

window.addEventListener('resize', resizeCanvas);
"""
    },
    {
        'name': 'utils.js',
        'content': """
const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\\d+/g);
    return \`#\${rgbArray.map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}\`;
};

const colorBrewerColors = {
    default: [
        "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99",
        "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a",
        "#ffff99", "#b15928"
    ],
    dark: [
        "#1b1b1b", "#2d2d2d", "#3e3e3e", "#505050", "#616161",
        "#737373", "#848484", "#969696", "#a8a8a8", "#bababa",
        "#cbcbcb", "#dddddd"
    ],
    pastel: [
        "#ffd1dc", "#ff9a9e", "#ff6f61", "#ffccbc", "#d1c4e9",
        "#b39ddb", "#ce93d8", "#f48fb1", "#ff8a80", "#ffab91",
        "#ffcc80", "#ffe082"
    ]
};

const loadSwatches = (theme) => {
    const swatchContainer = document.getElementById('swatchContainer');
    swatchContainer.innerHTML = '';
    colorBrewerColors[theme].forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = color;
        swatch.addEventListener('click', () => {
            selectedColor = swatch.style.backgroundColor;
            document.getElementById('colorPicker').value = rgbToHex(selectedColor);
        });
        swatchContainer.appendChild(swatch);
    });
};
"""
    },
    {
        'name': 'index.html',
        'content': """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weaving Diagram Tool</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="main-container">
        <nav>
            <div class="title">Internet Loom</div>
            <div class="nav-links">
                <a class="nav-link" href="https://github.com/chriswhong/responsive-web-map-layout" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
        </nav>
        <div id="content-container">
            <div id="sidebar">
                <h2>Themes</h2>
                <select id="themeSelector">
                    <option value="default">Default</option>
                    <option value="dark">Dark Theme</option>
                    <option value="pastel">Pastel Theme</option>
                </select>
                <div class="swatches" id="swatchContainer"></div>

                <div class="controls">
                    <h3>Color Picker</h3>
                    <input type="color" id="colorPicker" value="#000000">
                </div>

                <div id="pattern-buttons">
                    <button class="pattern-button" onclick="applyPattern(plainWeave)">
                        <img src="https://weaverly.typepad.com/.a/6a00e54f8982ec8833013489b59ce2970c-320wi" width="40px"><br>Plain Weave
                    </button>
                    <button class="pattern-button" onclick="applyPattern(basketWeave)">
                        <img src="https://weaverly.typepad.com/.a/6a00e54f8982ec8833013489b59ce2970c-320wi" width="40px"><br>Basket Weave
                    </button>
                    <button class="pattern-button" onclick="applyPattern(twillWeave)">
                        <img src="https://weaverly.typepad.com/.a/6a00e54f8982ec8833013489b59ce2970c-320wi" width="40px"><br>Twill Weave
                    </button>
                    <button class="pattern-button" onclick="applyPattern(satinWeave)">
                        <img src="https://weaverly.typepad.com/.a/6a00e54f8982ec8833013489b59ce2970c-320wi" width="40px"><br>Satin Weave
                    </button>
                    <button class="pattern-button" onclick="applyPattern(honeycombWeave)">
                        <img src="https://weaverly.typepad.com/.a/6a00e54f8982ec8833013489b59ce2970c-320wi" width="40px"><br>Honeycomb
                    </button>
                    <button class="pattern-button" onclick="applyPattern(huckabackWeave)">
                        <img src="https://weaverly.typepad.com/.a/6a00e54f8982ec8833013489b59ce2970c-320wi" width="40px"><br>Huck-a-back
                    </button>
                    <button class="pattern-button" onclick="applyPattern(mockLenoWeave)">
                        <img src="https://weaverly.typepad.com/.a/6a00e54f8982ec8833013489b59ce2970c-320wi" width="40px"><br>Mock Leno
                    </button>
                </div>

                <div id="pattern-export-bt">
                    <button onclick="exportSVG()">Export as SVG</button>
                    <button onclick="loadPattern()">Reload</button>
                </div>
            </div>

            <div id="center-container">
                <div class="component-container" id="componentContainer">
                    <div class="canvas-container" id="canvasContainer">
                        <canvas id="weavingCanvas"></canvas>
                    </div>
                    <div class="button-container">
                        <button onclick="initializeCanvas(8, 8)">8x8</button>
                        <button onclick="initializeCanvas(16, 16)">16x16</button>
                        <button onclick="initializeCanvas(18, 18)">18x18</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="canvas.js"></script>
    <script src="patterns.js"></script>
    <script src="events.js"></script>
    <script src="utils.js"></script>
</body>
</html>
"""
    }
]

for file in files:
    with open(file['name'], 'w') as f:
        f.write(file['content'].strip())
    print(f"{file['name']} created successfully.")
