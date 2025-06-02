class Chicken extends MovableObject{

    speed = 0.9; // Default speed for movement
            currentChicken = 0;
            CHICKEN_IMAGES_IDLE = [
                'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
                'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
                'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
            ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
       this.x = 200 + Math.random() * 500;
       this.y = 335;
       this.loadImages(this.CHICKEN_IMAGES_IDLE);
       this.animate();
    }

    
    animate() {
        console.log("Starting chicken animation, initial x:", this.x);
        this.moveLeft();
        setInterval(() => {
            let path = this.CHICKEN_IMAGES_IDLE[this.currentChicken];	
            this.img = this.imageCache[path];
            this.currentChicken++;
            if (this.currentChicken >= this.CHICKEN_IMAGES_IDLE.length) {
                this.currentChicken = 0;
            }
        }, 333);
    }

    eat() {
        console.log("chicken is eating");
    }


}