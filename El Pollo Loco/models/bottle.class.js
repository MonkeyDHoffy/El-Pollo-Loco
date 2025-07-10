class Bottle extends MovableObject {
    height = 90;
    width = 70;
    parallaxSpeed = 0.2;
    originalX;

    IMAGES_BOTTLE = [
        'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_BOTTLE);

        this.x = 400 + Math.random() * 3600;
        this.y = 350;
        this.originalX = this.x;

        this.animate();
    }

    updatePosition(characterX) {
        let parallaxOffset = characterX * this.parallaxSpeed;
        this.x = this.originalX - parallaxOffset;
    }

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
