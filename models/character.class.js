class Character extends MovableObject {
    height = 200;
    energy = 100;
    coins = 0;
    bottles = 0;
    speed = 8;
    world;
    showWrongDirectionWarning = false;
    warningStartTime = 0;
    
    combo = 0;
    lastGroundTouch = 0;
    wasOnGround = true;
    
    lastComboValue = 0;
    comboEndTime = 0;
    comboGracePeriod = 2000;

    IMAGES_JUMPING = [
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [  
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_WALKING = [
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_HURT = [
        'img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
        'img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
        'img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png'
    ];

    isWalkingSoundPlaying = false;

    constructor() {
        super().loadImage('img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadAllImages();
        this.applyGravity();
        this.animate();
    }

    /**
     * Loads all character animation images
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_IDLE);
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
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft(true);
            this.playWalkingSound();
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
            if (this.bottles === 0) {
                this.jump(28);
                this.activateSuperJumpSpeed();
                
            } else {
                this.jump(20);
            }
        }
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
                this.playIdleFrame();
            }
        }, 1000 / 5);
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
        let idlePath = this.IMAGES_IDLE[this.currentImage];
        this.img = this.imageCache[idlePath];
        this.currentImage++;
        if (this.currentImage >= this.IMAGES_IDLE.length) {
            this.currentImage = 0;
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
        // Store original speed
        this.originalSpeed = this.speed;
        
        // Increase horizontal speed for super jump
        this.speed = 15; // Increased from 8 to 15
        
        // Reset speed after jump duration (approximately when landing)
        setTimeout(() => {
            this.speed = this.originalSpeed || 8;
           
        }, 800); // 800ms should be enough for the jump arc
        
       
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
        let charBounds = this.getCharacterBounds();
        
        if (mobject instanceof Coin || mobject instanceof Bottle) {
            return this.checkItemCollision(mobject, charBounds);
        }

        return this.checkStandardCollision(mobject, charBounds);
    }

    /**
     * Gets character collision bounds
     * @returns {Object} Character bounds object
     */
    getCharacterBounds() {
        return {
            left: this.x + 20,
            right: this.x + this.width - 30,
            top: this.y + 90,
            bottom: this.y + this.height - 10
        };
    }

    /**
     * Checks collision with collectible items (coins/bottles)
     * @param {Object} mobject - Item to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkItemCollision(mobject, charBounds) {
        if (mobject instanceof Coin) {
            return this.checkCoinCollision(mobject, charBounds);
        } else if (mobject instanceof Bottle) {
            return this.checkBottleCollision(mobject, charBounds);
        }
    }

    /**
     * Checks collision with coin
     * @param {Coin} coin - Coin to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkCoinCollision(coin, charBounds) {
        return (coin.x + 60) + (coin.width - 120) > charBounds.left &&
               (coin.x + 60) < charBounds.right &&
               (coin.y + 60) + (coin.height - 120) > charBounds.top &&
               (coin.y + 60) < charBounds.bottom;
    }

    /**
     * Checks collision with bottle
     * @param {Bottle} bottle - Bottle to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkBottleCollision(bottle, charBounds) {
        return (bottle.x + 15) + (bottle.width - 30) > charBounds.left &&
               (bottle.x + 15) < charBounds.right &&
               (bottle.y + 15) + (bottle.height - 30) > charBounds.top &&
               (bottle.y + 15) < charBounds.bottom;
    }

    /**
     * Checks standard collision with other objects
     * @param {Object} mobject - Object to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkStandardCollision(mobject, charBounds) {
        return charBounds.left + (charBounds.right - charBounds.left) > mobject.x &&
               charBounds.left < mobject.x + mobject.width &&
               charBounds.top + (charBounds.bottom - charBounds.top) > mobject.y &&
               charBounds.top < mobject.y + mobject.height;
    }

    /**
     * Check if character is on ground and update combo tracking
     */
    updateComboTracking() {
        let isCurrentlyOnGround = !this.isAboveGround(); // Use existing isAboveGround method
        
        // If character just landed on ground, reset combo
        if (isCurrentlyOnGround && !this.wasOnGround) {
            if (this.combo > 0) {
                // Store the combo value and timestamp for grace period
                this.lastComboValue = this.combo;
                this.comboEndTime = Date.now();
                this.combo = 0;
            }
            this.lastGroundTouch = Date.now();
        }
        
        this.wasOnGround = isCurrentlyOnGround;
    }

    /**
     * Add to combo when killing chicken while airborne
     */
    addComboKill() {
        if (this.isAboveGround()) { // Use existing isAboveGround method
            this.combo++;
            // Play combo sound or effect here if desired
            if (this.combo > 1) {
                // Could add special combo sound effects
                this.playRandomChickenAttackSound();
            }
        } else {
            // Reset combo if on ground when killing
            this.combo = 0;
        }
    }

    /**
     * Reset combo (called when taking damage or other events)
     */
    resetCombo() {
        if (this.combo > 0) {
            // Store the combo value and timestamp for grace period
            this.lastComboValue = this.combo;
            this.comboEndTime = Date.now();
            this.combo = 0;
        }
    }

    /**
     * Get the effective combo value for damage calculation
     * Returns current combo or last combo if within grace period
     */
    getEffectiveCombo() {
        // If we have an active combo, use that
        if (this.combo > 0) {
            return this.combo;
        }
        
        // Check if we're within the grace period after combo ended
        let currentTime = Date.now();
        let timeSinceComboEnded = currentTime - this.comboEndTime;
        
        if (this.lastComboValue > 0 && timeSinceComboEnded <= this.comboGracePeriod) {
            
            return this.lastComboValue;
        }
        
        // No combo or grace period expired
        return 0;
    }

    /**
     * Override hit method to reset combo when taking damage
     */
    hit(damage) {
        super.hit(damage);
        this.resetCombo(); // Reset combo when taking damage
    }
}
