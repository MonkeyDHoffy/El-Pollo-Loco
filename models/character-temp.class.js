class Character extends MovableObject {
    height = 200;
    energy = 100;
    coins = 0;
    bottles = 0;
    speed = 8;
    world;
    showWrongDirectionWarning = false;
    warningStartTime = 0;
    lastInputTime = Date.now();
    longIdleThreshold = 3000;
    isInLongIdle = false;
    longIdleImage = 0;
    IMAGES_JUMPING = CHARACTER_ANIMATIONS.IMAGES_JUMPING;
    IMAGES_IDLE = CHARACTER_ANIMATIONS.IMAGES_IDLE;
    IMAGES_LONG_IDLE = CHARACTER_ANIMATIONS.IMAGES_LONG_IDLE;
    IMAGES_WALKING = CHARACTER_ANIMATIONS.IMAGES_WALKING;
    IMAGES_HURT = CHARACTER_ANIMATIONS.IMAGES_HURT;
    IMAGES_DEAD = CHARACTER_ANIMATIONS.IMAGES_DEAD;
    isWalkingSoundPlaying = false;
    constructor() {
        super().loadImage('img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadAllImages();
        this.applyGravity();
        this.initializeManagers();
        this.animate();
    }

    /**
     * Initialize manager instances
     */
    initializeManagers() {
        this.collisionManager = new CharacterCollisionManager(this);
        this.comboManager = new CharacterComboManager(this);
    }

    /**
     * Loads all character animation images
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
    }

    /**
     * Starts all animation loops for character movement and visual updates
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
        this.startIdleAnimationLoop();
    }

    /**
     * Handles character movement and input processing
     */
    startMovementLoop() {
        setInterval(() => {
            if (!this.world.isPaused && !this.isDead()) {
                this.handleHorizontalMovement();
                this.handleJumping();
                this.updateCameraPosition();
            } else {
                this.stopWalkingSound();
            }
        }, 1000 / 32);
    }

    /**
     * Handles horizontal movement input and sound effects
     */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.playWalkingSound();
            this.resetIdleTimer();
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft(true);
            this.playWalkingSound();
            this.resetIdleTimer();
        } else if (this.world.keyboard.LEFT && this.x <= 0) {
            this.showWrongDirectionWarning = true;
            this.warningStartTime = Date.now();
            this.stopWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }

    /**
     * Handles jumping input and jump types
     */
    handleJumping() {
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.resetIdleTimer();
            if (this.bottles === 0) {
                this.jump(28);
                this.activateSuperJumpSpeed();
            } else {
                this.jump(20);
            }
        }
    }

    /**
     * Resets the idle timer when input is detected
     */
    resetIdleTimer() {
        this.lastInputTime = Date.now();
        this.isInLongIdle = false;
        this.longIdleImage = 0;
    }

    /**
     * Updates camera position to follow character
     */
    updateCameraPosition() {
        this.world.camera_x = -this.x + this.world.canvas.width / 2 - this.width / 2;
    }

    /**
     * Handles state-based animation playback
     */
    startAnimationLoop() {
        setInterval(() => {
            if (!this.world.isPaused) {
                this.updateComboTracking();
                this.playStateBasedAnimation();
            }
        }, 100);
    }

    /**
     * Plays animation based on character state
     */
    playStateBasedAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Handles idle animation when no input is detected
     */
    startIdleAnimationLoop() {
        setInterval(() => {
            if (this.shouldPlayIdleAnimation()) {
                this.updateIdleState();
                this.playIdleFrame();
            }
        }, 1000 / 5);
    }

    /**
     * Updates the idle state based on time since last input
     */
    updateIdleState() {
        const timeSinceLastInput = Date.now() - this.lastInputTime;
        if (timeSinceLastInput >= this.longIdleThreshold && !this.isInLongIdle) {
            this.isInLongIdle = true;
            this.longIdleImage = 0;
        }
    }

    /**
     * Checks if idle animation should be played
     * @returns {boolean} True if character should play idle animation
     */
    shouldPlayIdleAnimation() {
        return !this.world.isPaused && 
               !this.world.keyboard.RIGHT && 
               !this.world.keyboard.LEFT && 
               !this.world.keyboard.UP && 
               !this.world.keyboard.DOWN;
    }

    /**
     * Plays a single frame of idle animation
     */
    playIdleFrame() {
        if (this.isInLongIdle) {
            this.playLongIdleFrame();
        } else {
            this.playNormalIdleFrame();
        }
    }

    /**
     * Plays a frame of normal idle animation
     */
    playNormalIdleFrame() {
        let idlePath = this.IMAGES_IDLE[this.currentImage];
        this.img = this.imageCache[idlePath];
        this.currentImage++;
        if (this.currentImage >= this.IMAGES_IDLE.length) {
            this.currentImage = 0;
        }
    }

    /**
     * Plays a frame of long idle animation
     */
    playLongIdleFrame() {
        let longIdlePath = this.IMAGES_LONG_IDLE[this.longIdleImage];
        this.img = this.imageCache[longIdlePath];
        this.longIdleImage++;
        if (this.longIdleImage >= this.IMAGES_LONG_IDLE.length) {
            this.longIdleImage = 0;
        }
    }

    /**
     * Updates and manages wrong direction warning display
     */
    updateWarning() {
        if (this.showWrongDirectionWarning && Date.now() - this.warningStartTime > 2000) {
            this.showWrongDirectionWarning = false;
        }
    }

    /**
     * Makes character jump with specified height
     * @param {number} howhigh - Jump height/speed
     */
    jump(howhigh) {
        this.speedY = howhigh;
        this.playRandomJumpSound();
    }

    /**
     * Activate super jump speed boost for horizontal movement
     */
    activateSuperJumpSpeed() {
        this.originalSpeed = this.speed;
        this.speed = 15;
        setTimeout(() => {
            this.speed = this.originalSpeed || 8;
        }, 800);
    }

    /**
     * Checks if character can throw a bottle
     * @returns {boolean} True if character has bottles available
     */
    canThrowBottle() {
        return this.bottles > 0;
    }

    /**
     * Uses a bottle from inventory
     * @returns {boolean} True if bottle was successfully used
     */
    useBottle() {
        if (this.bottles > 0) {
            this.bottles--;
            return true;
        }
        return false;
    }

    /**
     * Plays a random jump sound effect
     */
    playRandomJumpSound() {
        if (this.world && this.world.audioManager) {
            this.world.audioManager.playRandomJumpSound();
        }
    }

    /**
     * Plays a random chicken attack sound effect
     */
    playRandomChickenAttackSound() {
        if (this.world && this.world.audioManager) {
            this.world.audioManager.playRandomChickenAttackSound();
        }
    }

    /**
     * Plays a random hurt sound effect
     */
    playRandomHurtSound() {
        if (this.world && this.world.audioManager) {
            this.world.audioManager.playRandomHurtSound();
        }
    }

    /**
     * Plays walking sound if character is on ground and not already playing
     */
    playWalkingSound() {
        if (!this.isAboveGround() && !this.isWalkingSoundPlaying) {
            if (this.world && this.world.audioManager) {
                this.world.audioManager.playWalkingSound();
            }
            this.isWalkingSoundPlaying = true;
        }
        if (this.isAboveGround() && this.isWalkingSoundPlaying) {
            this.stopWalkingSound();
        }
    }

    /**
     * Stops walking sound if currently playing
     */
    stopWalkingSound() {
        if (this.isWalkingSoundPlaying) {
            if (this.world && this.world.audioManager) {
                this.world.audioManager.stopWalkingSound();
            }
            this.isWalkingSoundPlaying = false;
        }
    }

    /**
     * Checks collision with another object
     * @param {Object} mobject - Object to check collision with
     * @returns {boolean} True if collision detected
     */
    isColliding(mobject) {
        return this.collisionManager.isColliding(mobject);
    }

    /**
     * Check if character is on ground and update combo tracking
     */
    updateComboTracking() {
        this.comboManager.updateComboTracking();
    }

    /**
     * Add to combo when killing chicken while airborne
     */
    addComboKill() {
        this.comboManager.addComboKill();
    }

    /**
     * Reset combo (called when taking damage or other events)
     */
    resetCombo() {
        this.comboManager.resetCombo();
    }

    /**
     * Get the effective combo value for damage calculation
     * Returns current combo or last combo if within grace period
     */
    getEffectiveCombo() {
        return this.comboManager.getEffectiveCombo();
    }

    /**
     * Getter for combo value
     */
    get combo() {
        return this.comboManager.combo;
    }

    /**
     * Setter for combo value
     */
    set combo(value) {
        this.comboManager.combo = value;
    }

    /**
     * Override hit method to reset combo when taking damage
     */
    hit(damage) {
        super.hit(damage);
        this.resetCombo();
    }
}