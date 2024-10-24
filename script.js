const cells = document.querySelectorAll('.cell');
const titleHeader = document.querySelector('#titleHeader');
const xPlayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');
const restartBtn = document.querySelector('#restartBtn');

// Initialize variables for the game
let player = 'X';
let isPauseGame = false;
let isGameStart = false;

// Array of input cells for tracking the game state
const inputCells = ['', '', '', '', '', '', '', '', ''];

// Array of win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Add click event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index));
});

function tapCell(cell, index) {
    // Ensure cell is empty and game isn't paused
    if (cell.textContent === '' && !isPauseGame) {
        isGameStart = true;
        updateCell(cell, index);

        // Check for winner or change player
        if (!checkWinner()) {
            changePlayer();
            if (player === 'O') {
                // Hard mode: Computer uses Minimax to pick the next move
                setTimeout(() => minimaxPick(), 500);
            }
        }
    }
}

function updateCell(cell, index) {
    cell.textContent = player;
    inputCells[index] = player;
    cell.style.color = (player === 'X') ? '#0e0588' : '#a00c67';
}

function changePlayer() {
    player = (player === 'X') ? 'O' : 'X';
    if (player === 'X') {
        xPlayerDisplay.classList.add('player-active');
        oPlayerDisplay.classList.remove('player-active');
    } else {
        xPlayerDisplay.classList.remove('player-active');
        oPlayerDisplay.classList.add('player-active');
    }
}

function minimaxPick() {
    isPauseGame = true;

    let bestScore = -Infinity;
    let bestMove;
    inputCells.forEach((cell, index) => {
        if (cell === '') {
            // Make the move
            inputCells[index] = 'O';
            let score = minimax(inputCells, 0, false);
            inputCells[index] = ''; // Undo the move
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });

    updateCell(cells[bestMove], bestMove);
    if (!checkWinner()) {
        changePlayer();
        isPauseGame = false; // Switch back to human player
    }
}

// Minimax algorithm to determine the best move
function minimax(board, depth, isMaximizing) {
    let winner = evaluateWinner();
    if (winner !== null) {
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        return 0; // Draw
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function evaluateWinner() {
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] && inputCells[a] === inputCells[b] && inputCells[a] === inputCells[c]) {
            return inputCells[a];
        }
    }

    if (inputCells.every(cell => cell !== '')) {
        return 'Draw';
    }
    return null;
}

function checkWinner() {
    const winner = evaluateWinner();
    if (winner === 'X' || winner === 'O') {
        declareWinner(winner);
        return true;
    } else if (winner === 'Draw') {
        declareDraw();
        return true;
    }
    return false;
}

function declareWinner(winner) {
    titleHeader.textContent = `${winner} Wins!`;
    isPauseGame = true;

    // Highlight winning cells
    winConditions.forEach(([a, b, c]) => {
        if (inputCells[a] === winner && inputCells[b] === winner && inputCells[c] === winner) {
            [a, b, c].forEach(index => cells[index].style.background = '#2A2343');
        }
    });
    restartBtn.style.visibility = 'visible';
}

function declareDraw() {
    titleHeader.textContent = 'Draw!';
    isPauseGame = true;
    restartBtn.style.visibility = 'visible';
}

restartBtn.addEventListener('click', () => {
    restartBtn.style.visibility = 'hidden';
    inputCells.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '';
    });
    isPauseGame = false;
    isGameStart = false;
    titleHeader.textContent = 'Choose';
    player = 'X'; // Reset to X
    xPlayerDisplay.classList.add('player-active');
    oPlayerDisplay.classList.remove('player-active');
});
