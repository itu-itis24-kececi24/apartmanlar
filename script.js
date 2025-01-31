/**
 * Count how many numbers are visible from 0th index. For example:
 * [1,3,2,6,4,5] -> 1,3 and 6 are visible. 2,4 and 5 are hidden because larger number exist before them.
 * 
 * @param {number[]} sequence - Array of numbers
 * @returns {number} - Count of visible numbers
 */
function visibleCount(sequence) {
    let largest = 0;
    let count = 0;
    
    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] > largest) {
            largest = sequence[i];
            count++;
        }
    }
    
    return count;
}

/**
 * Reverse an array.
 * 
 * @param {Array} array - The array to reverse.
 * @returns {Array} - The reversed array.
 */
function reverseArray(array) {
    return array.slice().reverse();
}

/**
 * Extract a column from a 2D array.
 * 
 * @param {Array<Array>} grid - The 2D array.
 * @param {number} col - The index of the column to extract.
 * @returns {Array} - The extracted column.
 */
function getColumn(grid, col) {
    return grid.map(row => row[col]);
}

/**
 * Extract a row from a 2D array.
 * 
 * @param {Array<Array>} grid - The 2D array.
 * @param {number} row - The index of the row to extract.
 * @returns {Array} - The extracted row.
 */
function getRow(grid, row) {
    return grid[row].slice();
}

/**
 * Copy a 2D array.
 * 
 * @param {Array<Array>} array - The 2D array to copy.
 * @returns {Array<Array>} - The copied 2D array.
 */
function copy2DArray(array) {
    return array.map(row => row.slice());
}

/**
 * Check if the given grid satisfies the constraints.
 * 
 * @param {Array<Array<number>>} grid - The NxN grid.
 * @param {Array<number>} top - Top constraints.
 * @param {Array<number>} left - Left constraints.
 * @param {Array<number>} right - Right constraints.
 * @param {Array<number>} bottom - Bottom constraints.
 * @returns {boolean} - Whether the grid is valid.
 */
function isGridValid(grid, top, left, right, bottom) {
    let N = grid.length;
    
    for (let i = 0; i < N; i++) {
        let columnArray = getColumn(grid, i);
        let rowArray = getRow(grid, i);
        
        let columnReversed = reverseArray(columnArray);
        let rowReversed = reverseArray(rowArray);
        
        let fullCol = columnArray.every(val => val !== 0);
        let fullRow = rowArray.every(val => val !== 0);
        
        if (top[i] !== 0 && fullCol && visibleCount(columnArray) !== top[i]) {
            return false;
        }
        if (left[i] !== 0 && fullRow && visibleCount(rowArray) !== left[i]) {
            return false;
        }
        if (right[i] !== 0 && fullRow && visibleCount(rowReversed) !== right[i]) {
            return false;
        }
        if (bottom[i] !== 0 && fullCol && visibleCount(columnReversed) !== bottom[i]) {
            return false;
        }
    }
    
    return true;
}

function preSolveGrid(grid, top, left, right, bottom) {
    let N = grid.length;
    
    for (let i = 0; i < N; i++) {
        if (top[i] === 1) grid[0][i] = N;
        if (left[i] === 1) grid[i][0] = N;
        if (right[i] === 1) grid[i][N - 1] = N;
        if (bottom[i] === 1) grid[N - 1][i] = N;
        
        if (top[i] === N) {
            for (let j = 0; j < N; j++) {
                grid[j][i] = j + 1;
            }
        }
        if (left[i] === N) {
            for (let j = 0; j < N; j++) {
                grid[i][j] = j + 1;
            }
        }
        if (right[i] === N) {
            for (let j = 0; j < N; j++) {
                grid[i][j] = N - j;
            }
        }
        if (bottom[i] === N) {
            for (let j = 0; j < N; j++) {
                grid[j][i] = N - j;
            }
        }
    }

    return grid
}

function isValid(grid, row, col, num, top, left, right, bottom) {
    const N = grid.length;
    
    for (let i = 0; i < N; ++i) {
        if (grid[row][i] === num) return false;
    }
    
    for (let j = 0; j < N; j++) {
        if (grid[j][col] === num) return false;
    }
    
    let substituteGrid = copy2DArray(grid);
    substituteGrid[row][col] = num;
    
    return isGridValid(substituteGrid, top, left, right, bottom);
}

/**
 * Solve the grid using backtracking.
 * 
 * @param {Array<Array<number>>} grid - The NxN grid.
 * @param {Array<number>} top - Top constraints.
 * @param {Array<number>} left - Left constraints.
 * @param {Array<number>} right - Right constraints.
 * @param {Array<number>} bottom - Bottom constraints.
 * @returns {boolean} - Whether a valid solution was found.
 */
function solve(grid, top, left, right, bottom) {
    grid = preSolveGrid(grid, top, left, right, bottom)

    let N = grid.length;
    let row = -1, col = -1;
    let isEmpty = false;

    for (let i = 0; i < N; ++i) {
        for (let j = 0; j < N; ++j) {
            if (grid[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if (isEmpty) break;
    }

    if (!isEmpty){return grid;}

    for (let num = 1; num <= N; num++) {
        if (isValid(grid, row, col, num, top, left, right, bottom)) {
            grid[row][col] = num;
            
            if (solve(grid, top, left, right, bottom)){return grid;}
            
            grid[row][col] = 0;
        }
    }

    return false;
}
