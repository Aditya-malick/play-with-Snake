// Game constants
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const bgMusic = new Audio('bgmusic.mp3');
const moveSound = new Audio('move.mp3');
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Fetch the saved high score
let speed = 9;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// DOM references
const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const highScoreBox = document.getElementById('highScoreBox');

// Initialize the high score display
highScoreBox.textContent = `High Score: ${highScore}`;

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // If snake collides with the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function resetGame() {
    gameOverSound.play();
    bgMusic.pause();
    alert(`Game Over! Your score was: ${score}`);
    snakeArr = [{ x: 13, y: 15 }];
    inputDir = { x: 0, y: 0 };
    bgMusic.play();
    score = 0;
    scoreBox.textContent = `Score: ${score}`;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreBox.textContent = `High Score: ${highScore}`;
        localStorage.setItem('highScore', highScore); // Save the new high score
    }
}

function gameEngine() {
    // Update the snake and food
    if (isCollide(snakeArr)) {
        resetGame();
    }

    // If snake eats the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        score += 1;
        scoreBox.textContent = `Score: ${score}`;
        updateHighScore();
        foodSound.play();
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y,
        });

        // Generate new food position
        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random()),
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render the snake and food
    board.innerHTML = '';
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Game initialization
window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => {
    inputDir = { x: 0, y: 1 }; // Start the game
    bgMusic.play();
    moveSound.play();
    switch (e.key) {
        case 'ArrowUp':
            inputDir = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            inputDir = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            inputDir = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            inputDir = { x: 1, y: 0 };
            break;
        default:
            break;
    }
});
