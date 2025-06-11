class Endboss extends MovableObject {
currentImageWalking = 0;
height = 300;
width = 200;
y = 165;
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
//   constructor() {
//     super().loadImage('img/3_enemies_boss/boss_endboss/1.png');
//     this.x = 1200;
//     this.y = 50;
//     this.height = 300;
//     this.width = 300;
//     this.speed = 0.15;
//     this.energy = 100;
//     this.lastHit = 0;
//     this.hitSound = new Audio('audio/endboss-hit.mp3');
//     this.hitSound.volume = 0.2;
//   }

constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 700;
    this.animate();
}

animate() {

 setInterval(() => {
            this.moveLeft(false);
        }, 1000 / 60);
        


    setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 10); // 10 frames per second for walking
}}