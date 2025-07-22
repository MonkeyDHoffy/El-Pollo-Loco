/**
 * Throwable bottle object with physics and splash animation
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    speedY = 10;
    speedX = 10;
    gravity = 2.5;
    direction = 1;
    isSplashing = false;
    hasHit = false;
    
    IMAGES_ROTATION = [
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a new throwable bottle
     * @param {number} x - Starting x position
     * @param {number} y - Starting y position
     * @param {number} direction - Throw direction (1 or -1)
     */
    constructor(x, y, direction = 1) {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.initializeProperties(x, y, direction);
        this.throw();
    }

    /**
     * Sets up bottle properties and position
     * @param {number} x - Starting x position
     * @param {number} y - Starting y position
     * @param {number} direction - Throw direction
     */
    initializeProperties(x, y, direction) {
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.direction = direction;
        this.hasHit = false;
    }

    /**
     * Initiates bottle throwing with physics and animation
     */
    throw() {
        this.speedY = 15;
        this.applyGravity();
        this.startThrowAnimation();
    }

    /**
     * Starts the throwing animation and movement loop
     */
    startThrowAnimation() {
        setInterval(() => {
            if (!this.isSplashing) {
                this.x += 12 * this.direction;
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 28);
    }

    /**
     * Triggers splash animation when bottle hits something
     */
    splash() {
        this.isSplashing = true;
        this.hasHit = true;
        this.stopMovement();
        this.playAnimation(this.IMAGES_SPLASH);
    }

    /**
     * Stops bottle movement when splashing
     */
    stopMovement() {
        this.speedY = 0;
        this.speedX = 0;
    }

    /**
     * Smaller collision detection for more precise bottle hits
     * @param {Object} mobject - Object to check collision with
     * @returns {boolean} True if collision detected
     */
    isColliding(mobject) {
        // 25px Padding auf allen Seiten für kleinere Kollisionsbox
        let padding = 33;
        
        return (this.x + padding) + (this.width - padding * 2) > mobject.x &&
               (this.x + padding) < mobject.x + mobject.width &&
               (this.y + padding) + (this.height - padding * 2) > mobject.y &&
               (this.y + padding) < mobject.y + mobject.height;
    }
}
