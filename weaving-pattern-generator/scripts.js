document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('weaveCanvas');
    const ctx = canvas.getContext('2d');
    const weaveTypeSelect = document.getElementById('weaveType');
    const warpInput = document.getElementById('warpThreads');
    const weftInput = document.getElementById('weftThreads');
    const warpColorInput = document.getElementById('warpColor');
    const weftColorInput = document.getElementById('weftColor');
    const resetButton = document.getElementById('resetButton');
    const downloadButton = document.getElementById('downloadButton');

    canvas.width = 400;
    canvas.height = 400;

    const inputs = [weaveTypeSelect, warpInput, weftInput, warpColorInput, weftColorInput];
    inputs.forEach(input => input.addEventListener('input', generatePattern));

    resetButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'weave_pattern.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    function generatePattern() {
        const weaveType = weaveTypeSelect.value;
        const warpThreads = parseInt(warpInput.value);
        const weftThreads = parseInt(weftInput.value);
        const warpColor = warpColorInput.value;
        const weftColor = weftColorInput.value;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switch (weaveType) {
            case 'plain':
                drawPlainWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'twill':
                drawTwillWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'satin':
                drawSatinWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'honeycomb':
                drawHoneycombWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'huckaback':
                drawHuckabackWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'crepe':
                drawCrepeWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'bedford':
                drawBedfordWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'welts':
                drawWeltsWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'mockleno':
                drawMockLenoWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'leno':
                drawLenoWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'double':
                drawDoubleCloth(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'terry':
                drawTerryPile(warpThreads, weftThreads, warpColor, weftColor);
                break;
            case 'velvet':
                drawVelvetWeave(warpThreads, weftThreads, warpColor, weftColor);
                break;
        }
    }

    function drawPlainWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawTwillWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i + j) % 3 === 0 ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawSatinWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i + j) % 4 === 0 ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawHoneycombWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 2 === 0 && j % 2 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawHuckabackWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 3 === 0 || j % 3 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawCrepeWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i + j) % 5 === 0 ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawBedfordWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 4 === 0 || j % 4 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawWeltsWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 5 === 0 && j % 5 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawMockLenoWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 6 === 0 || j % 6 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawLenoWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 7 === 0 || j % 7 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawDoubleCloth(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 8 === 0 || j % 8 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawTerryPile(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 9 === 0 || j % 9 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    function drawVelvetWeave(warp, weft, warpColor, weftColor) {
        const size = canvas.width / warp;
        for (let i = 0; i < warp; i++) {
            for (let j = 0; j < weft; j++) {
                ctx.fillStyle = (i % 10 === 0 || j % 10 === 0) ? warpColor : weftColor;
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }
});
