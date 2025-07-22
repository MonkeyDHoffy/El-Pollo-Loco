/**
 * Represents background objects with parallax scrolling effects
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    parallaxSpeed = 0.5;

    /**
     * Initialize background object with parallax settings
     * @param {string} imagePath - Path to background image
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate (default: 0)
     */
    constructor(imagePath, x, y = 0) {
        super().loadImage(imagePath);
        this.initializePosition(x, y);
        this.setParallaxSpeed(imagePath);
    }

    /**
     * Initialize object position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    initializePosition(x, y) {
        this.x = x;
        this.y = 480 - this.height - y;
        this.originalX = x;
    }

    /**
     * Set parallax speed based on image layer type
     * @param {string} imagePath - Path to background image
     */
    setParallaxSpeed(imagePath) {
        if (imagePath.includes('2_second_layer')) {
            this.parallaxSpeed = 0.1;
        } else if (imagePath.includes('3_third_layer')) {
            this.parallaxSpeed = 0.05;
        } else if (imagePath.includes('1_first_layer')) {
            this.parallaxSpeed = 0.2;
        } else {
            this.parallaxSpeed = 0;
        }
    }

    /**
     * Update position based on character movement for parallax effect
     * @param {number} characterX - Character's X position
     */
    updatePosition(characterX) {
        let parallaxOffset = characterX * this.parallaxSpeed;
        this.x = this.originalX - parallaxOffset;
    }
}
