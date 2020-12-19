const rules_btn = document.querySelector('#rules-btn');
const close_btn = document.querySelector('#close-btn');
const rules = document.querySelector('#rules');

const ball_coordinates = document.querySelector('#ball_xy');
const paddle_coordinates = document.querySelector('#paddle_x');

rules_btn.addEventListener('click', () => rules.classList.add('show'));
close_btn.addEventListener('click', () => rules.classList.remove('show'));

// create the canvas
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// create ball, paddle & brick properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 1,
    x_increment: 1,
    y_increment: -1
};

const paddle = {
    // to make the paddle central on the canvas's floor, its x is both at the middle of the canvas's width (canvas.width / 2)
    // & the center of its own width (80 / 2)
    x: canvas.width / 2 - (80 / 2),
    y: canvas.height - 20,
    width: 80,
    height: 10,
    speed: 8,
    x_increment: 0
};

const brick = {
    // the 1st brick's x & y, the x & y of the other bricks are located using nested for loops
    x: 45,
    y: 60,
    width: 70,
    height: 20,
    padding: 10,
    visible: true
};

// draw ball on canvas
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fillStyle = '#0095dd';

    ctx.fill();

    ctx.closePath();
};

// draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();

    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.fillStyle = '#0095dd';

    ctx.fill();

    ctx.closePath();
};

// show scores on canvas
let score = 0;

function showScores() {
    ctx.font = '20px Arial';

    // fillText(text, x, y, optional max width)
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

// create & draw bricks on canvas
/* the spread operator:

    - https://javascript.info/rest-parameters-spread

    - https://stackabuse.com/spread-operator-in-javascript/

    - https://davidwalsh.name/spread-operator

    - https://codeburst.io/a-simple-guide-to-destructuring-and-es6-spread-operator-e02212af5831

    - https://zendev.com/2018/05/09/understanding-spread-operator-in-javascript.html

    - https://www.codingame.com/playgrounds/7998/es6-tutorials-spread-operator-with-fun
*/
const bricks_per_row = 9;
const bricks_per_col = 5;
const bricks = [];

for(let i = 0; i < bricks_per_row; i++) {
    bricks[i] = [];

    for(let j = 0; j < bricks_per_col; j++) {
        const X = i * (brick.width + brick.padding) + brick.x;

        const Y = j * (brick.height + brick.padding) + brick.y;

        // ...brick -> the spread operator
        bricks[i][j] = {X, Y, ...brick};
    }
};

console.log(bricks);

function drawBricks() {
    bricks.forEach(col => {
        col.forEach(brick => {
            ctx.beginPath();

            ctx.rect(brick.X, brick.Y, brick.width, brick.height);

            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';

            ctx.fill();

            ctx.closePath();
        });
    });
};

// draw every game element on canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();

    drawPaddle();

    drawBricks();

    showScores();
};

// the paddle only moves horizontally
function movePaddle() {
    paddle.x += paddle.x_increment;

    // wall detection
    if(paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    } else if(paddle.x < 0) {
        paddle.x = 0;
    }

    paddle_coordinates.innerHTML = `<h2>paddle_x: ${paddle.x}</h2>`;
};

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        paddle.x_increment = paddle.speed;
    } else if(e.key === 'ArrowLeft' || e.key === 'Left') {
        paddle.x_increment = -paddle.speed;
    }
};

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
        paddle.x_increment = 0;    
    }
};

// add keyboard event handlers
document.addEventListener('keydown', keyDown);

document.addEventListener('keyup', keyUp);

// move the ball & break bricks
function moveBall() {
    ball.x += ball.x_increment;

    ball.y += ball.y_increment;

    // wall collision detection: once the ball hits 1 of the walls, a negative value reverses its direction
    // left & right walls
    if(ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) { 
        ball.x_increment *= -1;
    }

    // up & down
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.y_increment *= -1;
    }

    // paddle collision detection
    if(ball.x - ball.radius > paddle.x && 
       ball.x + ball.radius < paddle.x + paddle.width && 
       ball.y + ball.radius > paddle.y) {
        ball.y_increment = -ball.speed;
    }

    // brick collision detection
    /*
        ball.x - ball.radius > brick.x -> check a brick's left side

        ball.x + ball.radius < brick.x + brick.width -> check a brick's right side

        ball.y + ball.radius > brick.y -> check a brick's top side

        ball.y - ball.radius < brick.y + brick.height -> check a brick's bottom side
    */
    bricks.forEach(col => {
        col.forEach(brick => {
            if(brick.visible) {
                if(ball.x - ball.radius > brick.X && 
                   ball.x + ball.radius < brick.X + brick.width && 
                   ball.y + ball.radius > brick.Y && 
                   ball.y - ball.radius < brick.Y + brick.height) {
                    ball.y_increment *= -1;

                    brick.visible = false;

                    gainScore(); // the scores increase according to the number of broken bricks
                }
            }
        })
    });

    // end game: if the ball touches the ground, scores reset & bricks reappear
    if(ball.y + ball.radius > canvas.height) {
        showBricks();

        score = 0;
    }

    ball_coordinates.innerHTML = `<h2>ball_x: ${ball.x} | ball_y: ${ball.y}</h2>`;
};

function gainScore() {
    score++;

    // if there aren't any bricks left, scores show up again
    if(score % (Math.pow(bricks_per_row, 2)) === 0) {
        showBricks();
    }
};

function showBricks() {
    bricks.forEach(col => {
        col.forEach(brick => {
            brick.visible = true;
        });
    });
};

function update() {
    movePaddle();

    moveBall();

    draw();

    requestAnimationFrame(update);
};

update();