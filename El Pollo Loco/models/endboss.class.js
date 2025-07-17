/**
 * Boss enemy class with multiple animation states and health scaling
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    height = 300;
    width = 200;
    y = 175;
    energy = 50;
    isDead = false;
    
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_HURT = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_ALERT = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates a new endboss instance
     * @param {number} index - Endboss index for positioning
     */
    constructor(index = 0) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadAllImages();
        this.initializeAnimationStates();
        this.initializeHealthScaling();
        this.initializeDetection();
        this.x = 3800 - (index * 600);
        this.animate();
    }

    /**
     * Loads all endboss animation images
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Initializes all animation state variables
     */
    initializeAnimationStates() {
        this.isHurt = false;
        this.hurtAnimationTimer = 0;
        this.isDying = false;
        this.deathAnimationTimer = 0;
        this.deathFrameIndex = 0;
        this.deathAnimationComplete = false;
        this.fallSpeed = 0;
        this.startedFalling = false;
        this.originalY = 175;
        
        this.isAttacking = false;
        this.attackAnimationTimer = 0;
        this.attackFrameIndex = 0;
        this.attackAnimationComplete = false;
        
        this.isAlert = false;
        this.alertAnimationTimer = 0;
        this.alertFrameIndex = 0;
        this.alertAnimationComplete = false;
        this.alertCycleCount = 0;
        this.maxAlertCycles = 2;
    }

    /**
     * Initializes health scaling properties
     */
    initializeHealthScaling() {
        this.baseEnergy = 50;
        this.maxEnergy = 50;
    }

    /**
     * Initializes character detection properties
     */
    initializeDetection() {
        this.hasSeenCharacter = false;
        this.detectionRange = 400;
    }

    /**
     * Set world reference and apply health scaling based on current wave
     */
    setWorld(world) {
        this.world = world;
        
        // Apply health scaling based on current wave
        if (world && world.waveManager) {
            this.maxEnergy = world.waveManager.getScaledEndbossHealth();
            this.energy = this.maxEnergy; // Set current energy to max
            console.log(`[Endboss] Health scaled to ${this.maxEnergy} based on wave ${world.waveManager.currentWave}`);
        } else {
            // Fallback to base energy if no wave manager
            this.maxEnergy = this.baseEnergy;
            this.energy = this.maxEnergy;
            console.log(`[Endboss] Using base health ${this.maxEnergy} (no wave manager)`);
        }
    }

    /**
     * Starts all animation loops for endboss behavior
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Handles endboss movement and character detection
     */
    startMovementLoop() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.checkCharacterDetection();
                this.handleMovement();
            }
        }, 1000 / 60);
    }

    /**
     * Handles endboss movement based on current state
     */
    handleMovement() {
        if (!this.isDead && !this.isAlert) {
            this.moveLeft(false);
        }
    }

    /**
     * Handles all animation states and transitions
     */
    startAnimationLoop() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.handleAnimationStates();
            }
        }, 1000 / 10);
    }

    /**
     * Manages animation state priorities and transitions
     */
    handleAnimationStates() {
        if (this.isDying) {
            this.handleDeathAnimation();
        } else if (!this.isDead) {
            this.handleLivingAnimations();
        }
    }

    /**
     * Handles death animation and falling behavior
     */
    handleDeathAnimation() {
        if (!this.deathAnimationComplete) {
            this.playDeathAnimationOnce();
        } else {
            this.handleFalling();
        }
    }

    /**
     * Handles falling behavior after death animation
     */
    handleFalling() {
        if (!this.startedFalling) {
            this.startedFalling = true;
            console.log("Death animation complete, starting to fall");
        }
        
        this.fallSpeed += 1.2;
        this.y += this.fallSpeed;
        
        if (this.y > 1500) {
            this.removeFromGame();
        }
    }

    /**
     * Handles animations for living endboss based on priority
     */
    handleLivingAnimations() {
        if (this.isAlert) {
            this.playAlertAnimationOnce();
        } else if (this.isAttacking) {
            this.playAttackAnimationOnce();
        } else if (this.isHurt) {
            this.handleHurtAnimation();
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Handles hurt animation and timer management
     */
    handleHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        this.hurtAnimationTimer -= 1000 / 10;
        
        if (this.hurtAnimationTimer <= 0) {
            this.isHurt = false;
            console.log("Endboss hurt animation ended");
        }
    }

    /**
     * Handles damage taken by endboss
     * @param {number} damage - Amount of damage to apply
     */
    hit(damage) {
        this.energy -= damage;
        this.handleHitEffects();
        
        if (this.energy <= 0) {
            this.energy = 0;
            this.die();
        }
        console.log(`Endboss getroffen! Energy: ${this.energy}/50`);
    }

    /**
     * Handles visual and audio effects when hit
     */
    handleHitEffects() {
        if (this.energy > 0) {
            this.isHurt = true;
            this.hurtAnimationTimer = 500;
            console.log("Endboss hurt animation started");
        }
    }

    /**
     * Initiates endboss death sequence
     */
    die() {
        if (!this.isDead) {
            this.isDead = true;
            this.initializeDeathAnimation();
            console.log("Endboss death animation started!");
        }
    }

    /**
     * Sets up death animation parameters
     */
    initializeDeathAnimation() {
        this.isDying = true;
        this.deathAnimationTimer = 1000;
        this.deathFrameIndex = 0;
        this.deathAnimationComplete = false;
        this.fallSpeed = 0;
        this.startedFalling = false;
        this.speed = 0;
    }

    /**
     * Check if character is within detection range
     */
    checkCharacterDetection() {
        if (!this.hasSeenCharacter && this.world && this.world.character) {
            let distance = Math.abs(this.x - this.world.character.x);
            
            // If character is within detection range, trigger alert
            if (distance <= this.detectionRange) {
                this.triggerAlert();
            }
        }
    }

    /**
     * Trigger alert animation when character is first spotted
     */
    triggerAlert() {
        if (!this.isDead && !this.isDying && !this.hasSeenCharacter) {
            this.hasSeenCharacter = true; // Mark as seen to prevent repeated alerts
            this.isAlert = true;
            this.alertAnimationTimer = 800; // 800ms for one cycle (8 frames * 100ms each)
            this.alertFrameIndex = 0;
            this.alertAnimationComplete = false;
            this.alertCycleCount = 0; // Reset cycle counter
            console.log("Endboss spotted character! Alert animation started! (Will play 2 times)");
        }
    }

    /**
     * Play alert animation exactly twice, frame by frame
     */
    playAlertAnimationOnce() {
        // Decrease timer
        this.alertAnimationTimer -= 1000 / 10;
        
        // Calculate which frame to show based on time elapsed
        let timeElapsed = 800 - this.alertAnimationTimer;
        let frameIndex = Math.floor(timeElapsed / 100); // Change frame every 100ms
        
        // Check if one cycle is complete
        if (frameIndex >= this.IMAGES_ALERT.length) {
            this.alertCycleCount++;
            console.log(`Alert animation cycle ${this.alertCycleCount} completed`);
            
            // If we haven't reached max cycles, restart animation
            if (this.alertCycleCount < this.maxAlertCycles) {
                this.alertAnimationTimer = 800; // Reset timer for next cycle
                this.alertFrameIndex = 0; // Reset frame index
                frameIndex = 0; // Start from first frame again
                console.log(`Starting alert animation cycle ${this.alertCycleCount + 1}`);
            } else {
                // All cycles complete, end alert animation
                frameIndex = this.IMAGES_ALERT.length - 1;
                this.alertAnimationComplete = true;
                this.isAlert = false; // End alert animation
                console.log("All alert animation cycles complete - endboss resumes normal behavior");
            }
        }
        
        // Set the current image to the correct alert frame
        let path = this.IMAGES_ALERT[frameIndex];
        if (this.imageCache[path] && this.imageCache[path].complete) {
            this.img = this.imageCache[path];
        }
        
        // Log frame changes
        if (frameIndex !== this.alertFrameIndex) {
            this.alertFrameIndex = frameIndex;
            console.log(`Alert frame: ${frameIndex + 1}/${this.IMAGES_ALERT.length} (Cycle: ${this.alertCycleCount + 1}/${this.maxAlertCycles})`);
        }
    }

    /**
     * Start attack animation
     */
    attack() {
        if (!this.isDead && !this.isDying && !this.isAttacking) {
            this.isAttacking = true;
            this.attackAnimationTimer = 800; // 800ms for attack animation (8 frames * 100ms each)
            this.attackFrameIndex = 0;
            this.attackAnimationComplete = false;
            console.log("Endboss attack animation started!");
        }
    }

    /**
     * Play attack animation exactly once, frame by frame
     */
    playAttackAnimationOnce() {
        // Decrease timer
        this.attackAnimationTimer -= 1000 / 10;
        
        // Calculate which frame to show based on time elapsed
        let timeElapsed = 800 - this.attackAnimationTimer;
        let frameIndex = Math.floor(timeElapsed / 100); // Change frame every 100ms
        
        // Clamp to last frame when animation should be complete
        if (frameIndex >= this.IMAGES_ATTACK.length) {
            frameIndex = this.IMAGES_ATTACK.length - 1;
            this.attackAnimationComplete = true;
            this.isAttacking = false; // End attack animation
        }
        
        // Set the current image to the correct attack frame
        let path = this.IMAGES_ATTACK[frameIndex];
        if (this.imageCache[path] && this.imageCache[path].complete) {
            this.img = this.imageCache[path];
        }
        
        // Log frame changes
        if (frameIndex !== this.attackFrameIndex) {
            this.attackFrameIndex = frameIndex;
            console.log(`Attack frame: ${frameIndex + 1}/${this.IMAGES_ATTACK.length}`);
            
            if (this.attackAnimationComplete) {
                console.log("Attack animation complete");
            }
        }
    }

    // Remove endboss from game (called after death animation)
    removeFromGame() {
        if (this.world && this.world.level && this.world.level.endboss) {
            let index = this.world.level.endboss.indexOf(this);
            if (index > -1) {
                this.world.level.endboss.splice(index, 1);
                console.log("Endboss removed from game after death animation");
                
                // Trigger endless mode replacement if active
                if (this.world.endlessMode) {
                    this.world.endlessMode.onEndbossKilled(this);
                }
            }
        }
    }

    /**
     * Play death animation exactly once, frame by frame
     */
    playDeathAnimationOnce() {
        // Decrease timer
        this.deathAnimationTimer -= 1000 / 10;
        
        // Calculate which frame to show based on time elapsed
        let timeElapsed = 1000 - this.deathAnimationTimer;
        let frameIndex = Math.floor(timeElapsed / 200); // Change frame every 200ms
        
        // Clamp to last frame when animation should be complete
        if (frameIndex >= this.IMAGES_DEAD.length) {
            frameIndex = this.IMAGES_DEAD.length - 1;
            this.deathAnimationComplete = true;
        }
        
        // Set the current image to the correct death frame
        let path = this.IMAGES_DEAD[frameIndex];
        if (this.imageCache[path] && this.imageCache[path].complete) {
            this.img = this.imageCache[path];
        }
        
        // Log frame changes
        if (frameIndex !== this.deathFrameIndex) {
            this.deathFrameIndex = frameIndex;
            console.log(`Death frame: ${frameIndex + 1}/${this.IMAGES_DEAD.length}`);
            
            if (this.deathAnimationComplete) {
                console.log("Death animation complete - staying at last frame");
            }
        }
    }

    // Draw energy bar above endboss
    draw(ctx) {
        // Draw the endboss sprite
        super.draw(ctx);
        
        // Draw energy bar above endboss
        this.drawEnergyBar(ctx);
    }

    drawEnergyBar(ctx) {
        let barWidth = 180;
        let barHeight = 20;
        let barX = this.x + (this.width - barWidth) / 2;
        let barY = this.y - 40;
        
        let energyPercentage = this.energy / this.maxEnergy;
        
        // Simple background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health bar color based on percentage
        let currentWidth = barWidth * energyPercentage;
        if (energyPercentage > 0.6) {
            ctx.fillStyle = '#00FF00';
        } else if (energyPercentage > 0.3) {
            ctx.fillStyle = '#FFFF00';
        } else {
            ctx.fillStyle = '#FF0000';
        }
        
        ctx.fillRect(barX, barY, currentWidth, barHeight);
        
        // Simple border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Simple text
        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        
        ctx.strokeText(`Pollo Loco: ${this.energy}/${this.maxEnergy}`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        ctx.fillText(`Pollo Loco: ${this.energy}/${this.maxEnergy}`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        
        ctx.restore();
    }
}