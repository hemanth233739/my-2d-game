const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');

canvas.width = 400;
canvas.height = 400;

let ball, score, gameActive;

// Ball Object
function resetGame() {
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 15,
        dx: 4,
        dy: 4,
        color: 'yellow',
    };
    score = 0;
    gameActive = true;
    scoreDisplay.textContent = `Score: ${score}`;
    startGame();
}

// Game Loop
function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
        score++;
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        score++;
    }

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Update Score
    scoreDisplay.textContent = `Score: ${score}`;

    requestAnimationFrame(update);
}

// Start Game on Button Click
function startGame() {
    gameActive = true;
    update();
}

startBtn.addEventListener('click', resetGame);
