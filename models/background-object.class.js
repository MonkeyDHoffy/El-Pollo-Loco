/**
 * Represents background objects with selective parallax
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    parallaxSpeed = 0;
    originalX;

    /**
     * Initialize background object
     * @param {string} imagePath - Path to background image
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate (default: 0)
     */
    constructor(imagePath, x, y = 0) {
        super().loadImage(imagePath);
        this.imagePath = imagePath; 
        this.x = x;
        this.y = 480 - this.height - y;
        this.originalX = x;
        this.setParallaxSpeed(imagePath);
    }

    /**
     * Set parallax speed based on layer type
     * @param {string} imagePath - Path to background image
     */
    setParallaxSpeed(imagePath) {
        if (imagePath.includes('2_second_layer')) {
            this.parallaxSpeed = 0.2; 
        } else if (imagePath.includes('3_third_layer')) {
            this.parallaxSpeed = 0.1; 
        } else {
            this.parallaxSpeed = 0; 
        }
    }

    /**
     * Update position based on character movement for parallax effect
     * @param {number} characterX - Character's X position
     */
    updatePosition(characterX) {
        if (this.parallaxSpeed > 0) {
            let parallaxOffset = characterX * this.parallaxSpeed;
            this.x = this.originalX - parallaxOffset;
        }
    }
}
