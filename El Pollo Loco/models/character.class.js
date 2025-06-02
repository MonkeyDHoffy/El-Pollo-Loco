class Character extends MovableObject {
     height = 200;
        y = 250;

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
   
currentImage = 0;

    constructor(){
        super().loadImage('img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
       
        this.loadImages(this.IMAGES_IDLE);
        this.animate();
    }

    animate() {
        setInterval(() => {
            // let i = this.currentImage % this.IMAGES_IDLE.length;
          let path = this.IMAGES_IDLE[this.currentImage];	
    this.img = this.imageCache[path]; // Use the cached image
    this.currentImage++;
    if (this.currentImage >= this.IMAGES_IDLE.length) {
        this.currentImage = 0;
    }
        }, 333);
    
    }

jump() {
    console.log("character is jumping");
}



}