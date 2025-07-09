class Bottle extends MovableObject {
    height = 90;
    width = 70;

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
        
        this.animate();
    }

    animate() {
        setInterval(() => {
            // this.playAnimation(this.IMAGES_BOTTLE);
        }, 500);
    }
}
