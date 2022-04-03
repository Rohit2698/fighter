function recatngularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width - 70 >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

let timer = 60;
let timerId;

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(() => {
            decreaseTimer();
        }, 1000);
        timer--;
        document.getElementById("time").innerHTML = timer;
    }

    if (timer === 0) {
        document.getElementById("resultText").style.display = "flex";
        if (player.health === enemy.health) {
            document.getElementById("resultText").innerHTML =
                "Game Over - The Match is Tied";
        }
        if (player.health < enemy.health) {
            document.getElementById("resultText").innerHTML =
                "Game Over - Player 1 Wins";
        }
        if (player.health > enemy.health) {
            document.getElementById("resultText").innerHTML =
                "Game Over - Enemy Wins";
        }
    }
}