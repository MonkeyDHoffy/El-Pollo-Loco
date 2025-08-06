class Chicken extends MovableObject {
    speed = 1.08; 
    height = 80;
    width = 70;
    isDead = false;
    originalHeight = 80;
        
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.initializePosition();
        this.loadChickenImages();
        this.animate();
    }

    /**
     * Sets initial spawn position and properties
     */
    initializePosition() {
        this.x = 400 + Math.random() * 3600;
        this.y = 370;
        this.originalHeight = this.height;
    }

    /**
     * Loads all chicken animation images
     */
    loadChickenImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Controls chicken movement and animation loops
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts the movement animation loop
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.canMove()) {
                this.moveLeft(false);
            }
        }, 1000 / 60);
    }

    /**
     * Starts the visual animation loop
     */
    startAnimationLoop() {
        setInterval(() => {
            if (this.canAnimate()) {
                this.updateAnimation();
            }
        }, 333);
    }

    /**
     * Checks if chicken can move
     * @returns {boolean} True if movement is allowed
     */
    canMove() {
        return (!this.world || !this.world.isPaused) && !this.isDead;
    }

    /**
     * Checks if chicken can animate
     * @returns {boolean} True if animation is allowed
     */
    canAnimate() {
        return !this.world || !this.world.isPaused;
    }

    /**
     * Updates the current animation frame
     */
    updateAnimation() {
        if (!this.isDead) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.img = this.imageCache[this.IMAGES_DEAD[0]];
        }
    }

    /**
     * Kills the chicken and adjusts its collision properties
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.adjustDeadCollisionBox();
        this.showDeadImage();
    }

    /**
     * Adjusts collision box for dead chicken
     */
    adjustDeadCollisionBox() {
        this.height = this.originalHeight * 0.4;
        this.y += this.originalHeight * 0.6;
    }

    /**
     * Immediately displays the dead chicken image
     */
    showDeadImage() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

   
    
}
