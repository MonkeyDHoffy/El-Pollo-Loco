/**
 * Represents collectible bottles in the game
 * @extends MovableObject
 */
class Bottles extends MovableObject {
    height = 60;
    width = 50;

    IMAGES_BOTTLES = [
        'img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png',
    ];

    /**
     * Initialize bottle at specified position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_BOTTLES[0]);
        this.loadImages(this.IMAGES_BOTTLES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Animates the bottle with cycling images
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 200);
    }
}