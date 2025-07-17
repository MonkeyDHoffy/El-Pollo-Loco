/**
 * Collectible coin that oscillates and animates
 * @extends MovableObject
 */
class Coin extends MovableObject {
    height = 160;
    width = 160;
    baseX;
    baseY;
    oscillationTime = 0;
    horizontalAmplitude = 25;
    verticalAmplitude = 20;
    hasVerticalMovement;
    
    IMAGES_COIN = [
        'img/img_pollo_locco/img/8_coin/coin_1.png',
        'img/img_pollo_locco/img/8_coin/coin_2.png',
    ];
    
    /**
     * Creates a new coin instance with random position and movement
     */
    constructor() {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.initializePosition();
        this.initializeMovement();
        this.animate();
    }

    /**
     * Sets up initial coin position
     */
    initializePosition() {
        this.x = 300 + Math.random() * 4000;
        this.y = 50 + Math.random() * 200;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    /**
     * Sets up movement parameters
     */
    initializeMovement() {
        this.hasVerticalMovement = Math.random() < 0.5;
        this.oscillationTime = Math.random() * Math.PI * 2;
    }
    
    /**
     * Starts coin animation and oscillation loops
     */
    animate() {
        this.startRotationAnimation();
        this.startOscillationAnimation();
    }

    /**
     * Handles coin sprite rotation animation
     */
    startRotationAnimation() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.playAnimation(this.IMAGES_COIN);
            }
        }, 200);
    }

    /**
     * Handles oscillating movement pattern
     */
    startOscillationAnimation() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.updateOscillation();
            }
        }, 50);
    }

    /**
     * Updates coin position based on oscillation patterns
     */
    updateOscillation() {
        this.oscillationTime += 0.1;
        this.updateHorizontalOscillation();
        this.updateVerticalOscillation();
    }

    /**
     * Updates horizontal oscillation for all coins
     */
    updateHorizontalOscillation() {
        this.x = this.baseX + Math.sin(this.oscillationTime) * this.horizontalAmplitude;
    }

    /**
     * Updates vertical oscillation for coins with vertical movement
     */
    updateVerticalOscillation() {
        if (this.hasVerticalMovement) {
            this.y = this.baseY + Math.sin(this.oscillationTime * 0.7) * this.verticalAmplitude;
        }
    }
    
    /**
     * Checks collision with another game object using adjusted bounding box
     * @param {Object} mobject - Object to check collision with
     * @returns {boolean} True if collision detected
     */
    isColliding(mobject) {
        return (this.x + 60) + (this.width - 120) > mobject.x &&
               (this.x + 60) < mobject.x + mobject.width &&
               (this.y + 60) + (this.height - 120) > mobject.y &&
               (this.y + 60) < mobject.y + mobject.height;
    }
}