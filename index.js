const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7; //Increase the speed going downward of the player
let gameEnd = false;
let restartGame = false;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: "./assets/background.png",
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: -160,
    },
    color: "blue",
    imgSrc: "./assets/player1/Idle.png",
    frameMax: 8,
    scale: 2.5,
    sprites: {
        idle: {
            imgSrc: "./assets/player1/Idle.png",
            frameMax: 8,
        },
        runLeft: {
            imgSrc: "./assets/player1/RunLeft.png",
            frameMax: 8,
        },
        runRight: {
            imgSrc: "./assets/player1/RunRight.png",
            frameMax: 8,
        },
        jump: {
            imgSrc: "./assets/player1/Jump.png",
            frameMax: 2,
        },
        fall: {
            imgSrc: "./assets/player1/Fall.png",
            frameMax: 2,
        },
        attack: {
            imgSrc: "./assets/player1/Attack1.png",
            frameMax: 6,
        },
        takehit: {
            imgSrc: "./assets/player1/TakeHit.png",
            frameMax: 4,
        },
        death: {
            imgSrc: "./assets/player1/Death.png",
            frameMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 250,
            y: 0,
        },
        width: 160,
        height: 50,
    },
});

console.log("player", player);
const enemy = new Fighter({
    position: {
        x: 215,
        y: 167,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 200,
        y: -174,
    },
    imgSrc: "./assets/player2/Idle.png",
    frameMax: 4,
    scale: 2.5,
    sprites: {
        idle: {
            imgSrc: "./assets/player2/Idle.png",
            frameMax: 4,
        },
        runLeft: {
            imgSrc: "./assets/player2/RunLeft.png",
            frameMax: 8,
        },
        runRight: {
            imgSrc: "./assets/player2/RunRight.png",
            frameMax: 8,
        },
        run: {
            imgSrc: "./assets/player2/Run.png",
            frameMax: 8,
        },
        jump: {
            imgSrc: "./assets/player2/Jump.png",
            frameMax: 2,
        },
        fall: {
            imgSrc: "./assets/player2/Fall.png",
            frameMax: 2,
        },
        attack: {
            imgSrc: "./assets/player2/Attack2.png",
            frameMax: 4,
        },
        takehit: {
            imgSrc: "./assets/player2/Takehit.png",
            frameMax: 3,
        },
        death: {
            imgSrc: "./assets/player2/Death.png",
            frameMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: 260,
            y: 0,
        },
        width: 170,
        height: 50,
    },
});

const playerKeys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    space: {
        pressed: false,
    },
};

const enemyKeys = {
    arrowRight: {
        pressed: false,
    },
    arrowLeft: {
        pressed: false,
    },
    arrowUp: {
        pressed: false,
    },
    arrow0: {
        pressed: false,
    },
};

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate); //Create animation loop
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height); //Clear canvas
    background.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if (playerKeys.d.pressed && player.lastkey === "d") {
        player.velocity.x = 5;
        player.switchSpite("runRight");
    } else if (playerKeys.a.pressed && player.lastkey === "a") {
        player.velocity.x = -5;
        player.switchSpite("runLeft");
    } else if (playerKeys.w.pressed && player.lastkey === "w") {
        player.velocity.y = -20;
        player.switchSpite("jump");
    } else {
        player.switchSpite("idle");
    }

    //jumping
    if (player.velocity.y < 0) {
        player.switchSpite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSpite("fall");
    }
    //enemy movement
    if (enemyKeys.arrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSpite("runLeft");
    } else if (enemyKeys.arrowUp.pressed && enemy.lastkey === "ArrowUp") {
        enemy.velocity.y = -20;
        enemy.switchSpite("jump");
    } else if (enemyKeys.arrowRight.pressed && enemy.lastkey === "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSpite("runRight");
    } else {
        enemy.switchSpite("idle");
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSpite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSpite("fall");
    }

    //detect for collision player

    if (
        recatngularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.frameCurrent === 4
    ) {
        player.isAttacking = false;
        enemy.switchSpite("hit");
        document.getElementById("enemyHealth").style.width = `${enemy.health + 5}%`;
        enemy.health += 5;
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }
    //if player missing
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }
    //detect for enemy collision
    if (
        recatngularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.switchSpite("hit");

        document.getElementById("playerHealth").style.width = `${
      player.health + 5
    }%`;
        player.health += 5;
    }

    //end game based on health

    if (player.health >= 100) {
        player.switchSpite("death");
        document.getElementById("resultText").style.display = "flex";
        document.getElementById("resultText").innerHTML =
            "Enemy Wins - Press Space To Continue";
        clearTimeout(timerId);
        gameEnd = true;
    }
    if (enemy.health >= 100) {
        enemy.switchSpite("death");
        document.getElementById("resultText").style.display = "flex";
        document.getElementById("resultText").innerHTML =
            "Player Wins - Press Space To Continue";
        clearTimeout(timerId);
        gameEnd = true;
    }
}

animate();