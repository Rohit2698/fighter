class Sprite {
    constructor({
        position,
        imgSrc,
        scale = 1,
        frameMax = 1,
        framesCurrent = 0,
        frameElapsed = 0,
        framesHold = 5,
        offset = {
            x: 0,
            y: 0,
        },
    }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.frameCurrent = framesCurrent;
        this.frameElapsed = frameElapsed;
        this.framesHold = framesHold;
        this.frameMax = frameMax;
        this.offset = offset;
    }

    draw() {
        canvasContext.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.frameMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.frameMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.frameElapsed++;
        if (this.frameElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.frameMax - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }
    update() {
        this.draw();
        this.animateFrames();
    }

    switchSpite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.frameMax - 1) {
                this.dead = true;
            }
            return;
        }
        if (
            this.image === this.sprites.attack.image &&
            this.frameCurrent < this.sprites.attack.frameMax - 1
        )
            return;

        if (
            this.image === this.sprites.takehit.image &&
            this.frameCurrent < this.sprites.takehit.frameMax - 1
        )
            return;

        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.frameMax = this.sprites.idle.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case "runRight":
                if (this.image !== this.sprites.runRight.image) {
                    this.image = this.sprites.runRight.image;
                    this.frameMax = this.sprites.runRight.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case "runLeft":
                if (this.image !== this.sprites.runLeft.image) {
                    this.image = this.sprites.runLeft.image;
                    this.frameMax = this.sprites.runLeft.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.frameMax = this.sprites.jump.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.frameMax = this.sprites.fall.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case "attack":
                if (this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image;
                    this.frameMax = this.sprites.attack.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case "hit":
                if (this.image !== this.sprites.takehit.image) {
                    this.image = this.sprites.takehit.image;
                    this.frameMax = this.sprites.takehit.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case "death":
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.frameMax = this.sprites.death.frameMax;
                    this.frameCurrent = 6;
                }
                break;
        }
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = "red",
        offset = {
            x: 0,
            y: 0,
        },
        imgSrc,
        scale = 1,
        frameMax = 1,
        framesCurrent = 0,
        frameElapsed = 0,
        framesHold = 5,
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined,
        },
    }) {
        super({
            position,
            imgSrc,
            scale,
            framesCurrent,
            framesHold,
            frameMax,
            frameElapsed,
            offset,
        });
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastkey = "";
        this.health = 0;
        this.sprites = sprites;
        this.dead = false;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.color = color;
        this.isAttacking = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc;
        }
    }

    restart({ position, type, dead }) {
        this.health = 0;
        this.lastkey = "";
        this.position = position;
        this.dead = dead;
        this.switchSpite("idle");
        console.log(`${type}`, this);
    }
    draw() {
        canvasContext.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.frameMax,
            this.image.height,
            this.position.x + this.offset.x,
            this.position.y + this.offset.y,
            (this.image.width / this.frameMax) * this.scale,
            this.image.height * this.scale
        );
    }

    update() {
        this.draw();

        !this.dead && this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        canvasContext.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
        );

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 65) {
            this.velocity.y = 0;
            this.position.y = 361;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSpite("attack");
        this.isAttacking = true;
    }
}