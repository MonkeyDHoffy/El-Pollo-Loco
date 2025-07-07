class Bottles extends MovableObject {
    height = 60;
    width = 50;

    IMAGES_BOTTLES = [
        'img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png',
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES_BOTTLES[0]);
        this.loadImages(this.IMAGES_BOTTLES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    // Animiert die Flasche
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 200);
    }
}