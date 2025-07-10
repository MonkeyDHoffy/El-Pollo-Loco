class Bottle extends MovableObject {
    height = 90;
    width = 70;
    parallaxSpeed = 0.2; // Same speed as first layer
    originalX; // Store original position

    IMAGES_BOTTLE = [
        'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_BOTTLE);
        
        // Random position within the expanded game area
        this.x = 400 + Math.random() * 3600; // Expanded from 300 + Math.random() * 1800
        this.y = 350;
        this.originalX = this.x; // Store original position for parallax
        
        this.animate();
    }

    // Update position based on character movement - same as first layer
    updatePosition(characterX) {
        // Calculate parallax offset based on character position
        let parallaxOffset = characterX * this.parallaxSpeed;
        this.x = this.originalX - parallaxOffset;
    }

    // Override collision detection with smaller collision box
    isColliding(mobject) {
        return (this.x + 15) + (this.width - 30) > mobject.x &&
               (this.x + 15) < mobject.x + mobject.width &&
               (this.y + 15) + (this.height - 30) > mobject.y &&
               (this.y + 15) < mobject.y + mobject.height;
    }

    animate() {
        setInterval(() => {
            // this.playAnimation(this.IMAGES_BOTTLE);
        }, 500);
    }
}
