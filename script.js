const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brikRowCount = 9;
const brickColumnCount = 5;
const delay = 500; //delay to reset the game

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true,
};

const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
    visible: true,
};

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
};

const bricks = [];
for (let i = 0; i < brikRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

// Draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.visible ? "#FFBACD" : "transparent";
    ctx.fill();
    ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = ball.visible ? "#CB0162" : "transparent";
    ctx.fill();
    ctx.closePath();
}

// Draw score on canvas
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillText(`Score:${score}`, canvas.width - 100, 30);
}

function drawBricks() {
    bricks.forEach((row) => {
        row.forEach((brick) => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? "#DA467D" : "transparent";
            ctx.fill();
            ctx.closePath();
        });
    });
}

// Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    // wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // wall collision (right or left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // wall collision(top or bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // paddle collision (with ball)
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    // Brick collision
    bricks.forEach((row) => {
        row.forEach((brick) => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
    });
    // hit bottom wall (loze)
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
    }
}

// Increase score
function increaseScore() {
    score++;
    if (score % (brikRowCount * brickColumnCount) === 0) {
        ball.visible = false;
        paddle.visible = false;
        // After 1s restart the game
        setTimeout(() => {
            showAllBricks();
            score = 0;
            paddle.x = canvas.width / 2 - 40;
            paddle.y = canvas.height - 20;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.visible = true;
            paddle.visible = true;
        }, 1000);
    }
}

// Make all bricks appear

function showAllBricks() {
    bricks.forEach(row => {
        row.forEach(brick => {
            brick.visible = true;
        })
    });
}

function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

function update() {
    moveBall();
    movePaddle();
    draw();
    requestAnimationFrame(update);
}

update();

// keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if (e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
})

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
})