class Character extends MovableObject {
     height = 200;
        y = 250;
        speed = 8; // Default speed for movement

    IMAGES_IDLE = [  
          'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
            'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'];
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
            'img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
            'img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
            'img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
            'img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
            'img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png',];
   
currentImageWalking = 0;
currentImageIdle = 0;
world; // Reference to the world instance

    constructor(){
        super().loadImage('img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
       
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        // Walking animation - faster (10 frames per second)

        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.otherDirection = false; // Set direction to right
                this.x += this.speed;}
            if (this.world.keyboard.LEFT) {
                this.otherDirection = true; // Set direction to left
                this.x -= this.speed; // Move character left (negative movement)
            }
        // Set camera so character stays centered in the canvas
        this.world.camera_x = -this.x + this.world.canvas.width / 2 - this.width / 2;
        }, 1000 / 32); // 60 frames per second for movement


        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                let i = this.currentImageWalking % this.IMAGES_WALKING.length; // Use modulo to cycle through images
                let walkingPath = this.IMAGES_WALKING[i];
                this.img = this.imageCache[walkingPath];
                this.currentImageWalking++;
            }
        }, 1000 / 15); // 15 frames per second for walking

        // Idle animation - slower (5 frames per second)
        setInterval(() => {
            // Check if NO keys are pressed
            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && 
                !this.world.keyboard.UP && !this.world.keyboard.DOWN && 
                !this.world.keyboard.SPACE) {
                
                let idlePath = this.IMAGES_IDLE[this.currentImageIdle];
                this.img = this.imageCache[idlePath];
                this.currentImageIdle++;
                if (this.currentImageIdle >= this.IMAGES_IDLE.length) {
                    this.currentImageIdle = 0;
                }
            }
        }, 1000 / 5); // 5 frames per second for idle animation
    }

jump() {
    console.log("character is jumping");
}



}