// SELECT CANVAS ELEMENT
const cvs = document.getElementById("brickbreakers");
const ctx = cvs.getContext("2d");

// ADD BORDER TO CANVAS
cvs.style.border = "4px solid #E0B0FF";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = 2;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// CREATE THE PADDLE
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :5
}

// DRAW PADDLE
function drawPaddle(){
    ctx.fillStyle = "#a4ede7";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#000";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// MOVE PADDLE
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

// CREATE THE BALL
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 4 * (Math.random() * 2 - 1),
    dy : -4
}

// DRAW THE BALL
function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#e6c0cc";
    ctx.fill();

    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

// MOVE THE BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision(){
    if(ball.x + ball.radius >= cvs.width)
       { ball.dx = -Math.abs(ball.dx);
        WALL_HIT.play();}

    if(ball.x - ball.radius <= 0)
    { ball.dx = Math.abs(ball.dx);
        WALL_HIT.play();}


    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy + 0.1;
        WALL_HIT.play();
    }

    if(ball.y + ball.radius >= cvs.height){
        LIFE--; // LOSE LIFE
        LIFE_LOST.play();
        resetPositions();
    }
}

// RESET THE BALL
function resetPositions(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;

    paddle.x = cvs.width/2 - PADDLE_WIDTH/2;
    paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y < paddle.y + paddle.height && ball.y > paddle.y){

        // PLAY SOUND
        PADDLE_HIT.play();

        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width/2);

        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);

        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;


        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    } //else if (ball.y > paddle.y + paddle.height)
}

// CREATE THE BRICKS
const brick = {
    row : 1,
    column : 5,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#d5b4f1",
    strokeColor : "#4978c0"
}

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// draw the bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

