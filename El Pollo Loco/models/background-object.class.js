class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    parallaxSpeed = 0.5; // Speed factor for parallax effect

    constructor(imagePath, x, y = 0) {
        super().loadImage(imagePath);
        this.x = x;   
        this.y = 480 - this.height - y; // Position based on ground level
        this.originalX = x; // Store original position
        
        // Set different parallax speeds for different layers
        if (imagePath.includes('2_second_layer')) {
            this.parallaxSpeed = 0.1; // Much slower for distant layers
        } else if (imagePath.includes('3_third_layer')) {
            this.parallaxSpeed = 0.05; // Very slow for far layers
        } else if (imagePath.includes('1_first_layer')) {
            this.parallaxSpeed = 0.2; // Slower for close layers
        } else {
            this.parallaxSpeed = 0; // No parallax for air layer to prevent gaps
        }
    }

    // Update position based on character movement - keep segments connected
    updatePosition(characterX) {
        // Calculate parallax offset based on character position
        let parallaxOffset = characterX * this.parallaxSpeed;
        this.x = this.originalX - parallaxOffset;
    }
}