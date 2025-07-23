/**
 * Collectible bottle object
 * @extends MovableObject
 */
class Bottle extends MovableObject {
    height = 90;
    width = 70;

    IMAGES_BOTTLE = [
        'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new bottle instance with random position
     */
    constructor() {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_BOTTLE);
        this.x = 400 + Math.random() * 3600;
        this.y = 350;
        this.animate();
    }

    /**
     * Checks collision with another object using adjusted bounds
     * @param {Object} mobject - Object to check collision with
     * @returns {boolean} True if collision detected
     */
    isColliding(mobject) {
        return (this.x + 18) + (this.width - 36) > mobject.x &&
               (this.x + 18) < mobject.x + mobject.width &&
               (this.y + 15) + (this.height - 30) > mobject.y &&
               (this.y + 15) < mobject.y + mobject.height;
    }

    /**
     * Starts bottle animation (currently disabled)
     */
    animate() {
        setInterval(() => {
            // this.playAnimation(this.IMAGES_BOTTLE);
        }, 500);
    }
}
