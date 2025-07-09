class Coin extends MovableObject {
    height = 160;
    width = 160;
    
    IMAGES_COIN = [
        'img/img_pollo_locco/img/8_coin/coin_1.png',
        'img/img_pollo_locco/img/8_coin/coin_2.png',
    ];
    
    constructor() {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        
        // Zufällige Position innerhalb des erweiterten Spielbereichs
        this.x = 300 + Math.random() * 3800; // Expanded from 240 + Math.random() * 2000
        this.y = 50 + Math.random() * 200;
        
        this.animate();
    }
    
    // Animiert die Rotation der Münze
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }
    
    // Override collision detection with much smaller collision box
    isColliding(mobject) {
        return (this.x + 60) + (this.width - 120) > mobject.x &&
               (this.x + 60) < mobject.x + mobject.width &&
               (this.y + 60) + (this.height - 120) > mobject.y &&
               (this.y + 60) < mobject.y + mobject.height;
    }
}