class MiniChicken extends Chicken {
    speed = 1.5; // Faster than normal chicken
    height = 50;  // Smaller than normal chicken (80)
    width = 45;   // Smaller than normal chicken (70)
    originalHeight = 50;

    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super();
        this.loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 500 + Math.random() * 3400; // Spread across wider area (was 260 + Math.random() * 800)
        this.y = 385; // Slightly lower position for mini chicken
        this.originalHeight = this.height;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }
}
