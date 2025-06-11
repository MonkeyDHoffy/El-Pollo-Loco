class Chicken extends MovableObject{

    speed = 0.9; // Default speed for movement
            currentImageWalking = 0;
            IMAGES_WALKING = [
                'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
                'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
                'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
            ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
       this.x = 200 + Math.random() * 500;
       this.y = 335;
       this.loadImages(this.IMAGES_WALKING);
       this.animate();
    }

    
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