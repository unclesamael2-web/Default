// Game constants
const TILE_SIZE = 16;
const COLS = 28;
const ROWS = 31;
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.8;
const FRIGHTENED_SPEED = 1;
const FRIGHTENED_DURATION = 8000;

// Tile types
const WALL = 1;
const DOT = 2;
const POWER = 3;
const EMPTY = 0;
const GHOST_HOUSE = 4;

// Directions
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

// Classic Pacman maze layout
const MAZE_TEMPLATE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,4,4,4,4,4,4,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,4,4,4,4,4,4,1,0,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,4,4,4,4,4,4,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Ghost colors
const GHOST_COLORS = {
    blinky: '#ff0000',
    pinky: '#ffb8ff',
    inky: '#00ffff',
    clyde: '#ffb852'
};

// Game state
let canvas, ctx;
let maze = [];
let pacman = null;
let ghosts = [];
let score = 0;
let level = 1;
let lives = 3;
let highScore = 0;
let gameLoop = null;
let isPaused = false;
let isGameOver = false;
let isGameWon = false;
let dotsRemaining = 0;
let frightenedTimer = null;
let lastTime = 0;
let mouthAngle = 0;
let mouthDirection = 1;

// Initialize game
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    highScore = parseInt(localStorage.getItem('pacmanHighScore')) || 0;
    document.getElementById('high-score').textContent = highScore;

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('next-level-btn').addEventListener('click', nextLevel);
    document.addEventListener('keydown', handleKeyPress);

    drawMaze();
}

// Create maze from template
function createMaze() {
    maze = MAZE_TEMPLATE.map(row => [...row]);
    dotsRemaining = 0;

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === DOT || maze[row][col] === POWER) {
                dotsRemaining++;
            }
        }
    }
}

// Create Pacman
function createPacman() {
    return {
        x: 14 * TILE_SIZE,
        y: 23 * TILE_SIZE + TILE_SIZE / 2,
        direction: LEFT,
        nextDirection: LEFT,
        speed: PACMAN_SPEED
    };
}

// Create ghosts
function createGhosts() {
    return [
        {
            name: 'blinky',
            x: 14 * TILE_SIZE,
            y: 11 * TILE_SIZE + TILE_SIZE / 2,
            direction: LEFT,
            color: GHOST_COLORS.blinky,
            mode: 'scatter',
            frightened: false,
            speed: GHOST_SPEED,
            scatterTarget: { x: 25, y: -3 },
            inHouse: false
        },
        {
            name: 'pinky',
            x: 14 * TILE_SIZE,
            y: 14 * TILE_SIZE + TILE_SIZE / 2,
            direction: UP,
            color: GHOST_COLORS.pinky,
            mode: 'scatter',
            frightened: false,
            speed: GHOST_SPEED,
            scatterTarget: { x: 2, y: -3 },
            inHouse: true
        },
        {
            name: 'inky',
            x: 12 * TILE_SIZE,
            y: 14 * TILE_SIZE + TILE_SIZE / 2,
            direction: UP,
            color: GHOST_COLORS.inky,
            mode: 'scatter',
            frightened: false,
            speed: GHOST_SPEED,
            scatterTarget: { x: 27, y: 31 },
            inHouse: true
        },
        {
            name: 'clyde',
            x: 16 * TILE_SIZE,
            y: 14 * TILE_SIZE + TILE_SIZE / 2,
            direction: UP,
            color: GHOST_COLORS.clyde,
            mode: 'scatter',
            frightened: false,
            speed: GHOST_SPEED,
            scatterTarget: { x: 0, y: 31 },
            inHouse: true
        }
    ];
}

// Start game
function startGame() {
    createMaze();
    pacman = createPacman();
    ghosts = createGhosts();
    score = 0;
    lives = 3;
    level = 1;
    isPaused = false;
    isGameOver = false;
    isGameWon = false;

    updateUI();
    hideOverlays();
    document.getElementById('start-btn').textContent = 'Restart';

    lastTime = performance.now();
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

// Restart game
function restartGame() {
    hideOverlays();
    startGame();
}

// Next level
function nextLevel() {
    level++;
    createMaze();
    pacman = createPacman();
    ghosts = createGhosts();
    isGameWon = false;
    isPaused = false;

    // Increase ghost speed with level
    ghosts.forEach(g => {
        g.speed = Math.min(GHOST_SPEED + (level - 1) * 0.2, PACMAN_SPEED);
    });

    updateUI();
    hideOverlays();

    lastTime = performance.now();
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

// Hide overlays
function hideOverlays() {
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('game-win').classList.add('hidden');
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;

    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const life = document.createElement('span');
        life.className = 'life';
        livesContainer.appendChild(life);
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('pacmanHighScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }
}

// Handle keyboard input
function handleKeyPress(e) {
    if (isGameOver || isGameWon) return;

    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            if (pacman) pacman.nextDirection = LEFT;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            if (pacman) pacman.nextDirection = RIGHT;
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            e.preventDefault();
            if (pacman) pacman.nextDirection = UP;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            e.preventDefault();
            if (pacman) pacman.nextDirection = DOWN;
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
    if (isGameOver || isGameWon) return;
    isPaused = !isPaused;
    if (!isPaused) {
        lastTime = performance.now();
        gameLoop = requestAnimationFrame(update);
    }
}

// Get tile at position
function getTile(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
        return EMPTY;
    }
    return maze[row][col];
}

// Check if can move in direction
function canMove(x, y, direction) {
    const nextX = x + direction.x * TILE_SIZE / 2;
    const nextY = y + direction.y * TILE_SIZE / 2;

    const tile = getTile(nextX, nextY);
    return tile !== WALL;
}

// Check wall collision with more precision
function checkWallCollision(x, y, direction, speed) {
    const newX = x + direction.x * speed;
    const newY = y + direction.y * speed;

    // Check corners of the entity
    const halfSize = TILE_SIZE / 2 - 2;

    const points = [
        { x: newX - halfSize, y: newY - halfSize },
        { x: newX + halfSize, y: newY - halfSize },
        { x: newX - halfSize, y: newY + halfSize },
        { x: newX + halfSize, y: newY + halfSize }
    ];

    for (let point of points) {
        const tile = getTile(point.x, point.y);
        if (tile === WALL) {
            return true;
        }
    }
    return false;
}

// Move Pacman
function movePacman(deltaTime) {
    if (!pacman) return;

    // Try to change direction
    if (pacman.nextDirection !== pacman.direction) {
        if (!checkWallCollision(pacman.x, pacman.y, pacman.nextDirection, pacman.speed)) {
            pacman.direction = pacman.nextDirection;
        }
    }

    // Move in current direction
    if (!checkWallCollision(pacman.x, pacman.y, pacman.direction, pacman.speed)) {
        pacman.x += pacman.direction.x * pacman.speed;
        pacman.y += pacman.direction.y * pacman.speed;
    }

    // Tunnel wrap
    if (pacman.x < 0) pacman.x = canvas.width;
    if (pacman.x > canvas.width) pacman.x = 0;

    // Collect dots
    const col = Math.floor(pacman.x / TILE_SIZE);
    const row = Math.floor(pacman.y / TILE_SIZE);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        if (maze[row][col] === DOT) {
            maze[row][col] = EMPTY;
            score += 10;
            dotsRemaining--;
            updateUI();
        } else if (maze[row][col] === POWER) {
            maze[row][col] = EMPTY;
            score += 50;
            dotsRemaining--;
            activateFrightenedMode();
            updateUI();
        }
    }

    // Check win condition
    if (dotsRemaining === 0) {
        winLevel();
    }

    // Animate mouth
    mouthAngle += 0.15 * mouthDirection;
    if (mouthAngle > 0.5 || mouthAngle < 0) {
        mouthDirection *= -1;
    }
}

// Activate frightened mode
function activateFrightenedMode() {
    ghosts.forEach(ghost => {
        ghost.frightened = true;
        ghost.speed = FRIGHTENED_SPEED;
        // Reverse direction
        ghost.direction = {
            x: -ghost.direction.x,
            y: -ghost.direction.y
        };
    });

    if (frightenedTimer) clearTimeout(frightenedTimer);
    frightenedTimer = setTimeout(() => {
        ghosts.forEach(ghost => {
            ghost.frightened = false;
            ghost.speed = GHOST_SPEED + (level - 1) * 0.2;
        });
    }, FRIGHTENED_DURATION);
}

// Get ghost target
function getGhostTarget(ghost) {
    if (ghost.frightened) {
        // Random movement when frightened
        return {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        };
    }

    if (ghost.inHouse) {
        return { x: 14, y: 11 }; // Exit point
    }

    if (ghost.mode === 'scatter') {
        return ghost.scatterTarget;
    }

    // Chase mode - different AI for each ghost
    const pacCol = Math.floor(pacman.x / TILE_SIZE);
    const pacRow = Math.floor(pacman.y / TILE_SIZE);

    switch(ghost.name) {
        case 'blinky':
            // Directly targets Pacman
            return { x: pacCol, y: pacRow };

        case 'pinky':
            // Targets 4 tiles ahead of Pacman
            return {
                x: pacCol + pacman.direction.x * 4,
                y: pacRow + pacman.direction.y * 4
            };

        case 'inky':
            // Complex targeting based on Blinky's position
            const blinky = ghosts.find(g => g.name === 'blinky');
            const blinkyCol = Math.floor(blinky.x / TILE_SIZE);
            const blinkyRow = Math.floor(blinky.y / TILE_SIZE);
            const aheadX = pacCol + pacman.direction.x * 2;
            const aheadY = pacRow + pacman.direction.y * 2;
            return {
                x: aheadX + (aheadX - blinkyCol),
                y: aheadY + (aheadY - blinkyRow)
            };

        case 'clyde':
            // Targets Pacman if far, scatter if close
            const dist = Math.sqrt(
                Math.pow(pacCol - Math.floor(ghost.x / TILE_SIZE), 2) +
                Math.pow(pacRow - Math.floor(ghost.y / TILE_SIZE), 2)
            );
            if (dist > 8) {
                return { x: pacCol, y: pacRow };
            }
            return ghost.scatterTarget;

        default:
            return { x: pacCol, y: pacRow };
    }
}

// Move ghosts
function moveGhosts(deltaTime) {
    ghosts.forEach(ghost => {
        // Handle ghost house exit
        if (ghost.inHouse) {
            ghost.y -= ghost.speed * 0.5;
            if (ghost.y <= 11 * TILE_SIZE + TILE_SIZE / 2) {
                ghost.y = 11 * TILE_SIZE + TILE_SIZE / 2;
                ghost.inHouse = false;
            }
            return;
        }

        const target = getGhostTarget(ghost);
        const currentCol = Math.floor(ghost.x / TILE_SIZE);
        const currentRow = Math.floor(ghost.y / TILE_SIZE);

        // At intersection, choose best direction
        const directions = [UP, DOWN, LEFT, RIGHT];
        let bestDir = ghost.direction;
        let bestDist = Infinity;

        // Filter out reverse direction (ghosts can't reverse)
        const reverse = { x: -ghost.direction.x, y: -ghost.direction.y };

        for (let dir of directions) {
            if (dir.x === reverse.x && dir.y === reverse.y) continue;

            const nextX = ghost.x + dir.x * ghost.speed;
            const nextY = ghost.y + dir.y * ghost.speed;

            if (!checkWallCollision(ghost.x, ghost.y, dir, ghost.speed)) {
                const nextCol = Math.floor(nextX / TILE_SIZE);
                const nextRow = Math.floor(nextY / TILE_SIZE);
                const dist = Math.pow(target.x - nextCol, 2) + Math.pow(target.y - nextRow, 2);

                if (dist < bestDist) {
                    bestDist = dist;
                    bestDir = dir;
                }
            }
        }

        ghost.direction = bestDir;

        // Move ghost
        if (!checkWallCollision(ghost.x, ghost.y, ghost.direction, ghost.speed)) {
            ghost.x += ghost.direction.x * ghost.speed;
            ghost.y += ghost.direction.y * ghost.speed;
        }

        // Tunnel wrap
        if (ghost.x < 0) ghost.x = canvas.width;
        if (ghost.x > canvas.width) ghost.x = 0;

        // Check collision with Pacman
        const dx = ghost.x - pacman.x;
        const dy = ghost.y - pacman.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < TILE_SIZE) {
            if (ghost.frightened) {
                // Eat ghost
                score += 200;
                updateUI();
                // Reset ghost to house
                ghost.x = 14 * TILE_SIZE;
                ghost.y = 14 * TILE_SIZE + TILE_SIZE / 2;
                ghost.inHouse = true;
                ghost.frightened = false;
                ghost.speed = GHOST_SPEED + (level - 1) * 0.2;
            } else {
                // Pacman dies
                loseLife();
            }
        }
    });

    // Switch between scatter and chase modes
    const time = Date.now();
    const cycleTime = time % 27000;
    const newMode = cycleTime < 7000 ? 'scatter' : 'chase';
    ghosts.forEach(g => {
        if (!g.frightened) g.mode = newMode;
    });
}

// Lose life
function loseLife() {
    lives--;
    updateUI();

    if (lives <= 0) {
        gameOver();
    } else {
        // Reset positions
        pacman = createPacman();
        ghosts = createGhosts();
        ghosts.forEach(g => {
            g.speed = GHOST_SPEED + (level - 1) * 0.2;
        });
    }
}

// Game over
function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(gameLoop);
    if (frightenedTimer) clearTimeout(frightenedTimer);
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').classList.remove('hidden');
}

// Win level
function winLevel() {
    isGameWon = true;
    cancelAnimationFrame(gameLoop);
    if (frightenedTimer) clearTimeout(frightenedTimer);
    document.getElementById('win-score').textContent = score;
    document.getElementById('game-win').classList.remove('hidden');
}

// Update game state
function update(timestamp) {
    if (isPaused || isGameOver || isGameWon) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    movePacman(deltaTime);
    moveGhosts(deltaTime);
    draw();

    gameLoop = requestAnimationFrame(update);
}

// Draw game
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMaze();
    drawPacman();
    drawGhosts();

    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffff00';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// Draw maze
function drawMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const tile = maze[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === WALL) {
                ctx.fillStyle = '#2121de';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

                // Add wall borders for better look
                ctx.strokeStyle = '#4242ff';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            } else if (tile === DOT) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (tile === POWER) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Draw Pacman
function drawPacman() {
    if (!pacman) return;

    ctx.fillStyle = '#ffff00';
    ctx.beginPath();

    // Calculate mouth angle based on direction
    let startAngle = mouthAngle;
    let endAngle = Math.PI * 2 - mouthAngle;

    if (pacman.direction === RIGHT) {
        startAngle = mouthAngle;
        endAngle = Math.PI * 2 - mouthAngle;
    } else if (pacman.direction === LEFT) {
        startAngle = Math.PI + mouthAngle;
        endAngle = Math.PI - mouthAngle;
    } else if (pacman.direction === UP) {
        startAngle = Math.PI * 1.5 + mouthAngle;
        endAngle = Math.PI * 1.5 - mouthAngle;
    } else if (pacman.direction === DOWN) {
        startAngle = Math.PI * 0.5 + mouthAngle;
        endAngle = Math.PI * 0.5 - mouthAngle;
    }

    ctx.arc(pacman.x, pacman.y, TILE_SIZE / 2 - 1, startAngle, endAngle);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.closePath();
    ctx.fill();
}

// Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        const x = ghost.x;
        const y = ghost.y;
        const size = TILE_SIZE / 2 - 1;

        // Ghost body color
        if (ghost.frightened) {
            // Flashing when about to end
            const timeLeft = frightenedTimer ?
                FRIGHTENED_DURATION - (Date.now() % FRIGHTENED_DURATION) : 0;
            if (timeLeft < 2000 && Math.floor(Date.now() / 200) % 2) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#2121de';
            }
        } else {
            ctx.fillStyle = ghost.color;
        }

        // Draw ghost body (rounded top, wavy bottom)
        ctx.beginPath();
        ctx.arc(x, y - size / 3, size, Math.PI, 0, false);
        ctx.lineTo(x + size, y + size / 2);

        // Wavy bottom
        const waveCount = 3;
        const waveWidth = (size * 2) / waveCount;
        for (let i = 0; i < waveCount; i++) {
            const wx = x + size - (i + 1) * waveWidth;
            const wy = y + size / 2;
            ctx.lineTo(wx + waveWidth / 2, wy + size / 3);
            ctx.lineTo(wx, wy);
        }

        ctx.closePath();
        ctx.fill();

        // Draw eyes
        if (!ghost.frightened) {
            // White part
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x - size / 3, y - size / 3, size / 3, 0, Math.PI * 2);
            ctx.arc(x + size / 3, y - size / 3, size / 3, 0, Math.PI * 2);
            ctx.fill();

            // Pupils (look towards target or Pacman)
            ctx.fillStyle = '#00f';
            const lookX = pacman ? (pacman.x - x) / 50 : 0;
            const lookY = pacman ? (pacman.y - y) / 50 : 0;
            ctx.beginPath();
            ctx.arc(x - size / 3 + lookX, y - size / 3 + lookY, size / 6, 0, Math.PI * 2);
            ctx.arc(x + size / 3 + lookX, y - size / 3 + lookY, size / 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Frightened face
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x - size / 4, y - size / 4, 2, 0, Math.PI * 2);
            ctx.arc(x + size / 4, y - size / 4, 2, 0, Math.PI * 2);
            ctx.fill();

            // Wavy mouth
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - size / 2, y + size / 6);
            for (let i = 0; i < 4; i++) {
                const mx = x - size / 2 + (i + 0.5) * (size / 2);
                const my = y + size / 6 + (i % 2 ? -3 : 3);
                ctx.lineTo(mx, my);
            }
            ctx.stroke();
        }
    });
}

// Initialize game on page load
window.addEventListener('load', init);
