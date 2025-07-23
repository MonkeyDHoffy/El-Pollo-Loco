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
<<<<<<< HEAD
        this.x = x;
        this.y = 480 - this.height - y;
        this.originalX = x;
=======
        this.imagePath = imagePath; // Store imagePath for later use
        this.initializePosition(x, y);
>>>>>>> 48b29b3409c944d65426e89c3ec923e214a810bb
        this.setParallaxSpeed(imagePath);
    }

    /**
     * Set parallax speed based on layer type
     * @param {string} imagePath - Path to background image
     */
    setParallaxSpeed(imagePath) {
        if (imagePath.includes('2_second_layer')) {
            this.parallaxSpeed = 0.2; // Moderate parallax for second layer
        } else if (imagePath.includes('3_third_layer')) {
<<<<<<< HEAD
            this.parallaxSpeed = 0.1; // Minimal parallax for third layer
=======
            this.parallaxSpeed = 0.05;
        } else if (imagePath.includes('1_first_layer')) {
            this.parallaxSpeed = 0; // Foreground layer is static (no parallax)
>>>>>>> 48b29b3409c944d65426e89c3ec923e214a810bb
        } else {
            this.parallaxSpeed = 0; // No parallax for first layer and air
        }
    }

    /**
     * Update position based on character movement for parallax effect
     * @param {number} characterX - Character's X position
     */
    updatePosition(characterX) {
<<<<<<< HEAD
        if (this.parallaxSpeed > 0) {
=======
        if (this.imagePath.includes('1_first_layer')) {
            // For first layer: move exactly with camera for seamless effect
            this.x = this.originalX - characterX;
        } else {
            // For background layers: use parallax effect
>>>>>>> 48b29b3409c944d65426e89c3ec923e214a810bb
            let parallaxOffset = characterX * this.parallaxSpeed;
            this.x = this.originalX - parallaxOffset;
        }
    }
}
