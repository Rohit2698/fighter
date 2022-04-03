window.addEventListener("keydown", (event) => {
    //player Keys
    if (gameEnd) {
        switch (event.key) {
            case " ":
                location.reload();
                break;
        }
    }
    if (!player.dead) {
        switch (event.key) {
            case "d":
                playerKeys.d.pressed = true;
                player.lastkey = "d";
                break;
            case "a":
                playerKeys.a.pressed = true;
                player.lastkey = "a";
                break;
            case "w":
                playerKeys.w.pressed = true;
                player.lastkey = "w";
                break;
            case " ":
                player.attack();
                playerKeys.space.pressed = true;
                player.lastkey = "space";
                break;
        }
    }

    //enemy Keys

    if (!enemy.dead) {
        switch (event.key) {
            case "ArrowRight":
                enemyKeys.arrowRight.pressed = true;
                enemy.lastkey = "ArrowRight";
                break;
            case "ArrowLeft":
                enemyKeys.arrowLeft.pressed = true;
                enemy.lastkey = "ArrowLeft";
                break;
            case "ArrowUp":
                enemyKeys.arrowUp.pressed = true;
                enemy.lastkey = "ArrowUp";
                break;
            case "0":
                enemyKeys.arrow0.pressed = true;
                enemy.attack();
                enemy.lastkey = "arrow0";
                break;
        }
    }
});

window.addEventListener("keyup", (event) => {
    //player movement
    switch (event.key) {
        case "d":
            playerKeys.d.pressed = false;
            break;
        case "a":
            playerKeys.a.pressed = false;
            break;
        case "w":
            playerKeys.w.pressed = false;
            break;
    }

    //enemy movement
    switch (event.key) {
        case "ArrowRight":
            enemyKeys.arrowRight.pressed = false;
            break;
        case "ArrowLeft":
            enemyKeys.arrowLeft.pressed = false;
            break;
        case "ArrowUp":
            enemyKeys.arrowUp.pressed = false;
            break;
    }
});