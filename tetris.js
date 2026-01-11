// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    S: '#00f000',
    Z: '#f00000',
    J: '#0000f0',
    L: '#f0a000'
};

// Tetromino shapes
const SHAPES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]]
};

// Game state
let canvas, ctx, nextCanvas, nextCtx;
let board = [];
let score = 0;
let level = 1;
let lines = 0;
let gameLoop = null;
let dropInterval = 1000;
let lastDropTime = 0;
let currentPiece = null;
let nextPiece = null;
let isPaused = false;
let isGameOver = false;

// Initialize game
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('next-canvas');
    nextCtx = nextCanvas.getContext('2d');

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.addEventListener('keydown', handleKeyPress);

    drawBoard();
}

// Create empty board
function createBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

// Start game
function startGame() {
    createBoard();
    score = 0;
    level = 1;
    lines = 0;
    isPaused = false;
    isGameOver = false;
    dropInterval = 1000;

    updateScore();
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('start-btn').textContent = 'Restart';

    nextPiece = createPiece();
    spawnPiece();

    lastDropTime = Date.now();
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

// Restart game
function restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    startGame();
}

// Create random piece
function createPiece() {
    const shapes = Object.keys(SHAPES);
    const type = shapes[Math.floor(Math.random() * shapes.length)];
    return {
        type: type,
        shape: SHAPES[type],
        color: COLORS[type],
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
        y: 0
    };
}

// Spawn new piece
function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece();
    drawNextPiece();

    if (checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) {
        gameOver();
    }
}

// Check collision
function checkCollision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }

                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Move piece
function movePiece(dx, dy) {
    if (isPaused || isGameOver) return;

    const newX = currentPiece.x + dx;
    const newY = currentPiece.y + dy;

    if (!checkCollision(newX, newY, currentPiece.shape)) {
        currentPiece.x = newX;
        currentPiece.y = newY;
        return true;
    }
    return false;
}

// Rotate piece
function rotatePiece() {
    if (isPaused || isGameOver) return;

    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );

    if (!checkCollision(currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
    } else {
        // Try wall kicks
        const kicks = [-1, 1, -2, 2];
        for (let kick of kicks) {
            if (!checkCollision(currentPiece.x + kick, currentPiece.y, rotated)) {
                currentPiece.x += kick;
                currentPiece.shape = rotated;
                break;
            }
        }
    }
}

// Hard drop
function hardDrop() {
    if (isPaused || isGameOver) return;

    let dropScore = 0;
    while (movePiece(0, 1)) {
        dropScore += 2;
    }
    score += dropScore;
    lockPiece();
}

// Lock piece to board
function lockPiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const y = currentPiece.y + row;
                const x = currentPiece.x + col;
                if (y >= 0) {
                    board[y][x] = currentPiece.color;
                }
            }
        }
    }

    clearLines();
    spawnPiece();
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Check same row again
        }
    }

    if (linesCleared > 0) {
        lines += linesCleared;
        score += [0, 100, 300, 500, 800][linesCleared] * level;

        // Level up every 10 lines
        const newLevel = Math.floor(lines / 10) + 1;
        if (newLevel > level) {
            level = newLevel;
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        }

        updateScore();
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

// Game over
function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(gameLoop);
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').classList.remove('hidden');
}

// Handle keyboard input
function handleKeyPress(e) {
    if (isGameOver && e.key !== 'p') return;

    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (movePiece(0, 1)) {
                score += 1;
                updateScore();
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotatePiece();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
        case 'p':
        case 'P':
            e.preventDefault();
            togglePause();
            break;
    }
}

// Toggle pause
function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    if (!isPaused) {
        lastDropTime = Date.now();
        gameLoop = requestAnimationFrame(update);
    }
}

// Update game state
function update(timestamp) {
    if (isPaused || isGameOver) return;

    const deltaTime = timestamp - lastDropTime;

    if (deltaTime > dropInterval) {
        if (!movePiece(0, 1)) {
            lockPiece();
        }
        lastDropTime = timestamp;
    }

    draw();
    gameLoop = requestAnimationFrame(update);
}

// Draw game
function draw() {
    drawBoard();
    drawPiece();
}

// Draw board
function drawBoard() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            if (board[row][col]) {
                ctx.fillStyle = board[row][col];
                ctx.fillRect(col * BLOCK_SIZE + 1, row * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

                // Add highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(col * BLOCK_SIZE + 1, row * BLOCK_SIZE + 1, BLOCK_SIZE - 2, 8);
            }
        }
    }
}

// Draw current piece
function drawPiece() {
    if (!currentPiece) return;

    ctx.fillStyle = currentPiece.color;
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const x = (currentPiece.x + col) * BLOCK_SIZE;
                const y = (currentPiece.y + row) * BLOCK_SIZE;

                ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

                // Add highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, 8);
                ctx.fillStyle = currentPiece.color;
            }
        }
    }

    // Draw ghost piece
    drawGhostPiece();
}

// Draw ghost piece (preview of where piece will land)
function drawGhostPiece() {
    if (!currentPiece) return;

    let ghostY = currentPiece.y;
    while (!checkCollision(currentPiece.x, ghostY + 1, currentPiece.shape)) {
        ghostY++;
    }

    ctx.fillStyle = currentPiece.color;
    ctx.globalAlpha = 0.2;

    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const x = (currentPiece.x + col) * BLOCK_SIZE;
                const y = (ghostY + row) * BLOCK_SIZE;
                ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
        }
    }

    ctx.globalAlpha = 1.0;
}

// Draw next piece preview
function drawNextPiece() {
    nextCtx.fillStyle = '#fff';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!nextPiece) return;

    const blockSize = 25;
    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * blockSize) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * blockSize) / 2;

    nextCtx.fillStyle = nextPiece.color;
    for (let row = 0; row < nextPiece.shape.length; row++) {
        for (let col = 0; col < nextPiece.shape[row].length; col++) {
            if (nextPiece.shape[row][col]) {
                const x = offsetX + col * blockSize;
                const y = offsetY + row * blockSize;

                nextCtx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2);

                // Add highlight
                nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                nextCtx.fillRect(x + 1, y + 1, blockSize - 2, 6);
                nextCtx.fillStyle = nextPiece.color;
            }
        }
    }
}

// Initialize game on page load
window.addEventListener('load', init);
