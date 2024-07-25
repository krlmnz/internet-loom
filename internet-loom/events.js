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