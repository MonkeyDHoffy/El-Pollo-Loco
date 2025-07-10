class Coin extends MovableObject {
    height = 160;
    width = 160;
    baseX; // Store base position for oscillation
    baseY; // Store base position for oscillation
    oscillationTime = 0;
    horizontalAmplitude = 65; // Increased from 10 to 25 pixels movement
    verticalAmplitude = 55; // Increased from 10 to 20 pixels movement
    hasVerticalMovement; // Random property to determine if coin moves vertically
    
    IMAGES_COIN = [
        'img/img_pollo_locco/img/8_coin/coin_1.png',
        'img/img_pollo_locco/img/8_coin/coin_2.png',
    ];
    
    constructor() {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        
        // Zufällige Position innerhalb des erweiterten Spielbereichs
        this.x = 300 + Math.random() * 3800;
        this.y = 50 + Math.random() * 200;
        
        // Store base positions for oscillation
        this.baseX = this.x;
        this.baseY = this.y;
        
        // Randomly determine if this coin moves vertically (50% chance)
        this.hasVerticalMovement = Math.random() < 0.5;
        
        // Random starting phase for variety
        this.oscillationTime = Math.random() * Math.PI * 2;
        
        this.animate();
    }
    
    // Animiert die Rotation der Münze und Bewegung
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
                this.oscillationTime += 0.1; // Increased increment for more visible movement
                
                // Horizontal oscillation (all coins)
                this.x = this.baseX + Math.sin(this.oscillationTime) * this.horizontalAmplitude;
                
                // Vertical oscillation (only some coins)
                if (this.hasVerticalMovement) {
                    this.y = this.baseY + Math.sin(this.oscillationTime * 0.7) * this.verticalAmplitude;
                }
            }
        }, 50); // Faster update rate for smoother movement
    }
    
    // Override collision detection with much smaller collision box
    isColliding(mobject) {
        return (this.x + 60) + (this.width - 120) > mobject.x &&
               (this.x + 60) < mobject.x + mobject.width &&
               (this.y + 60) + (this.height - 120) > mobject.y &&
               (this.y + 60) < mobject.y + mobject.height;
    }
}