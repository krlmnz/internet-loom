const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g);
    return `#${rgbArray.map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
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

// Load default swatches initially
document.addEventListener('DOMContentLoaded', () => {
    loadSwatches('default');
});
