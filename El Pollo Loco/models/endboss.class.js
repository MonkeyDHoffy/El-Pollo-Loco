class Endboss extends MovableObject {
    height = 300;
    width = 200;
    y = 175;
    
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    constructor(index = 0) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        
        // Position depends on index
        this.x = 2000 - (index * 500);
        this.animate();
    }

    // Controls boss movement and animation
    animate() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.moveLeft(false);
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000 / 10);
    }
}