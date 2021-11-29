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

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // the brick is broken
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#BA55D3";
    ctx.font = "18px Germania One";
    ctx.fillText(text, textX, textY);

    // draw image
    if (img)
    {ctx.drawImage(img, imgX, imgY, width = 20, height = 20);}
}

// DRAW FUNCTION
function draw(){
    drawPaddle();

    drawBall();

    drawBricks();

    // SHOW SCORE
    showGameStats(SCORE, 38, 27, SCORE_IMG, 11, 9);
    // SHOW LIVES
    showGameStats(LIFE, cvs.width - 20, 27, LIFE_IMG, cvs.width-47, 10.5);
    // SHOW LEVEL
    showGameStats('Level '+LEVEL, cvs.width/2-30, 25, null, cvs.width/2 - 30, 5);
}

// game over
function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}

// level up
function levelUp(){
    // let isLevelDone = true;

    // // check if all the bricks are broken
    // for(let r = 0; r < brick.row; r++){
    //     for(let c = 0; c < brick.column; c++){
    //         isLevelDone = isLevelDone && ! bricks[r][c].status;
    //     }
    // }

    if((SCORE === 50 && !bricks[0][0].status) || (SCORE === 150 && !bricks[0][0].status) || (SCORE === 300 && !bricks[0][0].status)){
        WIN.play();

        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 1;
        ball.y -=1;
        resetPositions();
        LEVEL++;
    }
}

// UPDATE GAME FUNCTION
function update(){
    movePaddle();

    moveBall();

    ballWallCollision();

    ballPaddleCollision();

    ballBrickCollision();

    gameOver();

    levelUp();
}

// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    ctx.drawImage(BG_IMG, -650, -150);

    draw();

    update();

    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
// loop();


// SELECT SOUND ELEMENT
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

    soundElement.setAttribute("src", SOUND_IMG);

    // MUTE AND UNMUTE SOUNDS
    WALL_HIT.muted = !WALL_HIT.muted //? false : true;
    PADDLE_HIT.muted = !PADDLE_HIT.muted //? false : true;
    BRICK_HIT.muted = !BRICK_HIT.muted// ? false : true;
    WIN.muted = !WIN.muted// ? false : true;
    LIFE_LOST.muted = !LIFE_LOST.muted //? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const title = document.getElementById("title");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");
const start = document.getElementById("start");
const pause = document.getElementById("pause");


// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload();
    // gameover.style.display = "none";
    // youwon.style.display = "none";
    // reload the page
})

start.addEventListener("click", function(){
    // location.reload();
    gameover.style.display = "none";
    title.style.display = "none";
    start.style.display = "none";
    loop();
    // reload the page
})

pause.addEventListener("click", function(){
    if (GAME_OVER) {
        GAME_OVER = false;
        gameover.style.display = "none";
        loop();
    } else {
    GAME_OVER = true
    gameover.style.display = "block";
    }
})


// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
    restart.style.display = "block";

}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
    restart.style.display = "block";

}





















