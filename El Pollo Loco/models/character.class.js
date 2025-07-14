class Character extends MovableObject {
    height = 200;
    energy = 100;
    coins = 0;
    bottles = 0;
    speed = 8;
    world;
    showWrongDirectionWarning = false;
    warningStartTime = 0;
    
    // Combo system
    combo = 0;
    lastGroundTouch = 0; // Timestamp when character last touched ground
    wasOnGround = true; // Track if character was on ground
    
    // Combo grace period system
    lastComboValue = 0; // Store the last combo value after it ends
    comboEndTime = 0; // Timestamp when combo ended
    comboGracePeriod = 2000; // 2 seconds grace period in milliseconds

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

    // Sound management now handled by AudioManager
    isWalkingSoundPlaying = false;

    constructor() {
        super().loadImage('img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        
        console.log('Verifying image loading...');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.world.isPaused && !this.isDead()) {
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
                
                if (this.world.keyboard.UP && !this.isAboveGround()) {
                    if (this.bottles === 0) {
                        // Super jump: lower height but faster horizontal movement
                        this.jump(28); // Reduced from 35 to 28
                        this.activateSuperJumpSpeed();
                        console.log("Super jump activated! (no bottles) - lower but faster");
                    } else {
                        // Regular jump
                        this.jump(20);
                    }
                }

                this.world.camera_x = -this.x + this.world.canvas.width / 2 - this.width / 2;
            } else {
                this.stopWalkingSound();
            }
        }, 1000 / 32);

        setInterval(() => {
            if (!this.world.isPaused) {
                // Update combo tracking
                this.updateComboTracking();
                
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
        }, 100);

        setInterval(() => {
            if (!this.world.isPaused && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && 
                !this.world.keyboard.UP && !this.world.keyboard.DOWN) {
                
                let idlePath = this.IMAGES_IDLE[this.currentImage];
                this.img = this.imageCache[idlePath];
                this.currentImage++;
                if (this.currentImage >= this.IMAGES_IDLE.length) {
                    this.currentImage = 0;
                }
            }
        }, 1000 / 5);
    }

    updateWarning() {
        if (this.showWrongDirectionWarning && Date.now() - this.warningStartTime > 2000) {
            this.showWrongDirectionWarning = false;
        }
    }

    jump(howhigh) {
        this.speedY = howhigh;
        this.playRandomJumpSound();
        console.log("character is jumping");
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
            console.log("Super jump speed boost ended");
        }, 800); // 800ms should be enough for the jump arc
        
        console.log("Super jump speed boost activated!");
    }

    canThrowBottle() {
        return this.bottles > 0;
    }

    useBottle() {
        if (this.bottles > 0) {
            this.bottles--;
            console.log(`Bottle thrown! Remaining bottles: ${this.bottles}`);
            return true;
        }
        return false;
    }

    playRandomJumpSound() {
        if (this.world && this.world.audioManager) {
            this.world.audioManager.playRandomJumpSound();
        }
    }

    playRandomChickenAttackSound() {
        if (this.world && this.world.audioManager) {
            this.world.audioManager.playRandomChickenAttackSound();
        }
    }

    playRandomHurtSound() {
        if (this.world && this.world.audioManager) {
            this.world.audioManager.playRandomHurtSound();
        }
    }

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

    stopWalkingSound() {
        if (this.isWalkingSoundPlaying) {
            if (this.world && this.world.audioManager) {
                this.world.audioManager.stopWalkingSound();
            }
            this.isWalkingSoundPlaying = false;
        }
    }

    isColliding(mobject) {
        let charLeft = this.x + 20;
        let charRight = this.x + this.width - 30;
        let charTop = this.y + 90;
        let charBottom = this.y + this.height - 10;

        if (mobject instanceof Coin || mobject instanceof Bottle) {
            if (mobject instanceof Coin) {
                return (mobject.x + 60) + (mobject.width - 120) > charLeft &&
                       (mobject.x + 60) < charRight &&
                       (mobject.y + 60) + (mobject.height - 120) > charTop &&
                       (mobject.y + 60) < charBottom;
            } else if (mobject instanceof Bottle) {
                return (mobject.x + 15) + (mobject.width - 30) > charLeft &&
                       (mobject.x + 15) < charRight &&
                       (mobject.y + 15) + (mobject.height - 30) > charTop &&
                       (mobject.y + 15) < charBottom;
            }
        }

        return charLeft + (charRight - charLeft) > mobject.x &&
               charLeft < mobject.x + mobject.width &&
               charTop + (charBottom - charTop) > mobject.y &&
               charTop < mobject.y + mobject.height;
    }

    /**
     * Check if character is on ground and update combo tracking
     */
    updateComboTracking() {
        let isCurrentlyOnGround = !this.isAboveGround(); // Use existing isAboveGround method
        
        // If character just landed on ground, reset combo
        if (isCurrentlyOnGround && !this.wasOnGround) {
            if (this.combo > 0) {
                console.log(`Combo ended at ${this.combo} kills - landed on ground`);
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
            console.log(`Combo: ${this.combo} airborne kills!`);
            
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
            console.log(`Combo reset from ${this.combo} due to damage`);
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
            console.log(`Using grace period combo: ${this.lastComboValue} (${Math.round((this.comboGracePeriod - timeSinceComboEnded) / 1000)}s remaining)`);
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