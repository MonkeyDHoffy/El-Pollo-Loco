/**
 * Base class for all movable game objects with physics and collision detection
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 1.08; // Increased by 20% from 0.9
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    lastHit = 0;
    energy = 100;

    /**
     * Applies gravity physics to make objects fall naturally
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
                if (!(this instanceof ThrowableObject)) {
                    this.y = 250;
                }
            }
        }, 1000 / 60);
    }

    /**
     * Checks if the object is above the ground level
     * @returns {boolean} True if above ground, false otherwise
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true; 
        } else {
            return this.y < 250;
        }
    }

    /**
     * Moves the object to the right
     */
    moveRight() {
        this.otherDirection = false;
        this.x += this.speed;
    }

    /**
     * Moves the object to the left
     * @param {boolean} direction - Direction flag for image flipping
     */
    moveLeft(direction) {
        this.otherDirection = direction;
        this.x -= this.speed;
    }
    
    /**
     * Flips the image horizontally for directional movement
     * @param {Object} mobject - The object to flip
     */
    flipImage(mobject) {
        this.ctx.save();
        this.ctx.translate(mobject.width, 0);
        this.ctx.scale(-1, 1);
        mobject.x = -mobject.x;
    }

    /**
     * Restores the image to its original orientation
     * @param {Object} mobject - The object to restore
     */
    flipImageBack(mobject) {
        mobject.x = -mobject.x;
        this.ctx.restore();
    }

    /**
     * Checks if this object is colliding with another object
     * @param {Object} mobject - The object to check collision with
     * @returns {boolean} True if colliding, false otherwise
     */
    isColliding(mobject) {
        return this.x + this.width > mobject.x &&
               this.x < mobject.x + mobject.width &&
               this.y + this.height > mobject.y &&
               this.y < mobject.y + mobject.height;
    }

    /**
     * Checks if this object is positioned above another object
     * @param {Object} mobject - The object to check position against
     * @returns {boolean} True if above the object, false otherwise
     */
    isAboveObject(mobject) {
        return this.y + this.height <= mobject.y + 50;
    }

    /**
     * Enhanced collision detection specifically for jump attacks
     * @param {Object} mobject - The object to check jump attack against
     * @returns {boolean} True if performing jump attack, false otherwise
     */
    isJumpingOn(mobject) {
        return this.isColliding(mobject) && 
               this.speedY < 0 && 
               this.isAboveObject(mobject);
    }

    /**
     * Reduces object energy when taking damage
     * @param {number} damage - Amount of damage to apply
     */
    hit(damage) {
        this.energy -= damage;
        this.clampEnergyToZero();
        this.handleHitEffects();
    }

    /**
     * Ensures energy doesn't go below zero
     */
    clampEnergyToZero() {
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Handles effects when object is hit but not killed
     */
    handleHitEffects() {
        if (this.energy > 0) {
            this.lastHit = new Date().getTime();
            
            if (this instanceof Character) {
                this.playRandomHurtSound();
            }
        }
    }

    /**
     * Checks if object was recently hit and has temporary invincibility
     * @returns {boolean} True if currently hurt, false otherwise
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1.0;
    }

    /**
     * Checks if object has no energy remaining
     * @returns {boolean} True if dead, false otherwise
     */
    isDead() {
        return this.energy == 0;
    }
}
