class Chicken extends MovableObject {
    speed = 0.9;
    height = 80;  // Höhe der Chicken in Pixeln
    width = 70;   // Breite der Chicken in Pixeln
    isDead = false;
    originalHeight = 80; // Store original height
        
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 400 + Math.random() * 3600; // Spread across wider area (was 260 + Math.random() * 800)
        this.y = 365; // Chicken weiter unten positioniert (war 335)
        this.originalHeight = this.height; // Store original height
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    // Controls chicken movement and animation
    animate() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                if (!this.isDead) {
                    this.moveLeft(false);
                }
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                if (!this.isDead) {
                    this.playAnimation(this.IMAGES_WALKING);
                } else {
                    // Show dead image when chicken is dead
                    this.img = this.imageCache[this.IMAGES_DEAD[0]];
                }
            }
        }, 333);
    }

    // Kills the chicken
    die() {
        this.isDead = true;
        this.speed = 0;
        // Reduce collision box height for dead chicken
        this.height = this.originalHeight * 0.4; // Make collision box 40% of original height
        this.y += this.originalHeight * 0.6; // Adjust Y position to keep chicken on ground
        // Immediately show dead image
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    eat() {
        console.log("chicken is eating");
    }
}