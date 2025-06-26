class Chicken extends MovableObject {
    speed = 0.9;
    height = 80;  // Höhe der Chicken in Pixeln
    width = 70;   // Breite der Chicken in Pixeln
        
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 260 + Math.random() * 800;
        this.y = 365; // Chicken weiter unten positioniert (war 335)
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    // Controls chicken movement and animation
    animate() {
        setInterval(() => {
            this.moveLeft(false);
        }, 1000 / 60);
        
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 333);
    }

    eat() {
        console.log("chicken is eating");
    }
}