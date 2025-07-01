class ThrowableObject extends MovableObject {
    speedY = 30;
    speedX = 10;
    gravity = 2.5;
    
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

    constructor(x, y) {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw(10, 130); // Beispielkoordinaten, anpassen nach Bedarf
    }

    throw(x, y) {
       this.x = x;
       this.y = y;
       this.speedY = 30;
       this.applyGravity();
    setInterval(() => {
        this.x += 10;
        this.playAnimation(this.IMAGES_ROTATION);

        
        // if (this.y >= 360) {
        //     clearInterval(this.throwInterval);
        //     this.splash();
        // }
    }, 25);
    }

    splash() {
        this.speedY = 0;
        this.speedX = 0;
        this.playAnimation(this.IMAGES_SPLASH);
    }
}
