/**
 * Mini chicken enemy class - smaller and faster variant of regular chicken
 * @extends Chicken
 */
class MiniChicken extends Chicken {
    speed = 1.8; 
    height = 50;  
    width = 45;   
    originalHeight = 50;

    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new mini chicken instance
     */
    constructor() {
        super();
        this.loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 500 + Math.random() * 3400;
        this.y = 395; 
        this.originalHeight = this.height;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }
}
