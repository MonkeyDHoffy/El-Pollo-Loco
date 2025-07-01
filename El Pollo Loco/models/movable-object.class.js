class MovableObject extends DrawableObject {
    speed = 0.9;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    lastHit = 0;
    energy = 100; // Adding this default value for all movable objects

    // Applies gravity to make objects fall
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true; 
        } else    {
        return this.y < 250;
    }}

  

    // Moves object right
    moveRight() {
        this.otherDirection = false;
        this.x += this.speed;
    }

    // Moves object left
    moveLeft(direction) {
        this.otherDirection = direction;
        this.x -= this.speed;
    }
    
    // Flips image for direction change
    flipImage(mobject) {
        this.ctx.save();
        this.ctx.translate(mobject.width, 0);
        this.ctx.scale(-1, 1);
        mobject.x = -mobject.x;
    }

    // Restores image after flipping
    flipImageBack(mobject) {
        mobject.x = -mobject.x;
        this.ctx.restore();
    }

    // Checks if this object collides with another
    isColliding(mobject) {
        return this.x + this.width > mobject.x &&
               this.x < mobject.x + mobject.width &&
               this.y + this.height > mobject.y &&
               this.y < mobject.y + mobject.height;
    }

    // Reduces energy when hit
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    // Returns true if object was recently hit
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.3;
    }

    // Returns true if object has no energy left
    isDead() {
        return this.energy == 0;
    }

    // Reduces energy when hit
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    // Returns true if object was recently hit
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.3;
    }

    // Returns true if object has no energy left
    isDead() {
        return this.energy == 0;
    }
}

