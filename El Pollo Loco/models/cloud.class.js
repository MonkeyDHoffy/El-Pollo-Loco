class Cloud extends MovableObject {

    speed = 0.2; // Speed of the cloud movement
    constructor() {
        super().loadImage('img/img_pollo_locco/img/5_background/layers/4_clouds/1.png');
       this.x = 200 + Math.random() * 800;
       this.animate();
       this.y = -35 + Math.random() * 15;
       this.width = 700;
       this.height = 440;
    }

    animate() {
 this.moveLeft();
      
    }

  
} 