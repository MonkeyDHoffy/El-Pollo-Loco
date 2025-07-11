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
    
    constructor() {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        
        // Spawn coins between 300 and 4375 (4400 - 25 for oscillation buffer)
        this.x = 300 + Math.random() * 4075;
        this.y = 50 + Math.random() * 200;
        
        this.baseX = this.x;
        this.baseY = this.y;
        
        this.hasVerticalMovement = Math.random() < 0.5;
        
        this.oscillationTime = Math.random() * Math.PI * 2;
        
        this.animate();
    }
    
    /**
     * Animates the coin by rotating it and moving it in an oscillating pattern.
     * The animation includes both horizontal and vertical oscillation, with
     * vertical movement being random for each coin instance.
     */
    animate() {
        // Coin rotation animation
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.playAnimation(this.IMAGES_COIN);
            }
        }, 200);
        
        // Oscillating movement animation
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.oscillationTime += 0.1;
                
                // Horizontal oscillation (all coins)
                this.x = this.baseX + Math.sin(this.oscillationTime) * this.horizontalAmplitude;
                
                // Vertical oscillation (only some coins)
                if (this.hasVerticalMovement) {
                    this.y = this.baseY + Math.sin(this.oscillationTime * 0.7) * this.verticalAmplitude;
                }
            }
        }, 50);
    }
    
    /**
     * Checks if this coin is colliding with another game object.
     * The collision detection is based on a simplified bounding box
     * collision detection algorithm, adjusted for the smaller collision
     * box of the coin.
     * 
     * @param {Object} mobject - The other game object to check collision with.
     * @returns {boolean} - True if colliding, false otherwise.
     */
    isColliding(mobject) {
        return (this.x + 60) + (this.width - 120) > mobject.x &&
               (this.x + 60) < mobject.x + mobject.width &&
               (this.y + 60) + (this.height - 120) > mobject.y &&
               (this.y + 60) < mobject.y + mobject.height;
    }
}