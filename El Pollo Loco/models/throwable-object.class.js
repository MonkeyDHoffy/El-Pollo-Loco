class ThrowableObject extends MovableObject {
    speedY = 10;
    speedX = 10;
    gravity = 2.5;
    direction = 1; // 1 for right, -1 for left
    isSplashing = false;
    hasHit = false; // Track if bottle has already hit something
    
    IMAGES_ROTATION = [
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, direction = 1) {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.direction = direction;
        this.hasHit = false;
        this.throw();
    }

    throw() {
        this.speedY = 15; // Erhöht von 10 auf 15 für höheren Wurf
        this.applyGravity();
        setInterval(() => {
            if (!this.isSplashing) {
                this.x += 12 * this.direction; // Multipliziere mit Richtung
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 28);
    }

    splash() {
        this.isSplashing = true;
        this.hasHit = true; // Mark as hit when splashing
        this.speedY = 0;
        this.speedX = 0;
        this.playAnimation(this.IMAGES_SPLASH);
    }
}
