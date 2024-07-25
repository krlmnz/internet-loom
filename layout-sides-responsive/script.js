document.addEventListener('DOMContentLoaded', function() {
    // Create main weaving container
    const container = document.createElement('div');
    container.className = 'weaving-container';
    
    // Function to create a square box
    const createBox = () => {
        const box = document.createElement('div');
        box.className = 'weaving-box';
        return box;
    };
    
    // Function to create a circle
    const createCircle = (id) => {
        const circle = document.createElement('div');
        circle.className = 'weaving-circle';
        circle.id = 'weaving-circle-' + id;
        return circle;
    };
    
    // Function to create a box containing a circle
    const createCircleBox = (id) => {
        const circleBox = document.createElement('div');
        circleBox.className = 'weaving-circle-box';
        circleBox.appendChild(createCircle(id));
        return circleBox;
    };
    
    // Function to create a fixed row of circle boxes
    const createFixedRow = () => {
        const fixedRow = document.createElement('div');
        fixedRow.className = 'weaving-fixed-row';
        const ids = "ABCDEFGHIJKLMNOP";
        for (let char of ids) {
            fixedRow.appendChild(createCircleBox(char));
        }
        return fixedRow;
    };
    
    // Function to create a row with boxes and fixed row
    const createRow = () => {
        const row = document.createElement('div');
        row.className = 'weaving-row';
        row.appendChild(createBox());
        row.appendChild(createFixedRow());
        row.appendChild(createBox());
        return row;
    };
    
    // Append the created row to the container
    container.appendChild(createRow());
    
    // Function to create a column with circle wrappers
    const createColumn = (position) => {
        const column = document.createElement('div');
        column.className = 'weaving-column';
        column.style[position] = '0';
        for (let i = 1; i <= 16; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'weaving-circle-wrapper';
            wrapper.appendChild(createCircle(i.toString()));
            column.appendChild(wrapper);
        }
        return column;
    };
    
    // Create grid for weaving
    const grid = document.createElement('div');
    grid.className = 'weaving-grid';
    const ids = "ABCDEFGHIJKLMNOP";
    for (let row = 1; row <= 16; row++) {
        for (let char of ids) {
            const gridBox = document.createElement('div');
            gridBox.className = 'weaving-grid-box';
            gridBox.id = 'weaving-grid-box-' + char + row;
            grid.appendChild(gridBox);
        }
    }
    
    // Create the middle row with columns and grid
    const middleRow = document.createElement('div');
    middleRow.className = 'weaving-row';
    middleRow.style.position = 'relative';
    middleRow.appendChild(createColumn('left'));
    middleRow.appendChild(grid);
    middleRow.appendChild(createColumn('right'));
    
    // Append the middle row to the container
    container.appendChild(middleRow);
    
    // Create the bottom row with boxes and fixed row
    const bottomRow = document.createElement('div');
    bottomRow.className = 'weaving-row';
    bottomRow.style.marginBottom = '0';
    bottomRow.appendChild(createBox());
    bottomRow.appendChild(createFixedRow());
    bottomRow.appendChild(createBox());
    container.appendChild(bottomRow);
    
    // Append the main container to the outer container
    document.querySelector('.weaving-outer-container').appendChild(container);

    // Initialize selected color
    let selectedColor = "#000000";

    // Add event listener for color picker
    document.getElementById("weavingColorPicker").addEventListener("change", function(event) {
        selectedColor = event.target.value;
    });

    // Add event listeners for each circle
    document.querySelectorAll(".weaving-circle").forEach(circle => {
        circle.addEventListener("click", function(event) {
            const id = event.target.id.replace('weaving-circle-', '');
            if (isNaN(id)) {
                // If the id is a letter, change all boxes in the column
                for (let i = 1; i <= 16; i++) {
                    document.getElementById('weaving-grid-box-' + id + i).style.backgroundColor = selectedColor;
                }
            } else {
                // If the id is a number, change all boxes in the row
                const rowId = parseInt(id);
                const columns = "ABCDEFGHIJKLMNOP".split("");
                columns.forEach(col => {
                    document.getElementById('weaving-grid-box-' + col + rowId).style.backgroundColor = selectedColor;
                });
            }
        });
    });

    // Add event listeners for each grid box
    document.querySelectorAll(".weaving-grid-box").forEach(gridBox => {
        gridBox.addEventListener("click", function(event) {
            const gridBoxId = event.target.id;
            document.getElementById(gridBoxId).style.backgroundColor = selectedColor;
        });
    });
});