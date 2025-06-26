class Cloud extends MovableObject {
    speed = 0.2;
    
    constructor() {
        super().loadImage('img/img_pollo_locco/img/5_background/layers/4_clouds/1.png');
        this.x = 200 + Math.random() * 800;
        this.y = -35 + Math.random() * 15;
        this.width = 700;
        this.height = 440;
        this.animate();
    }

    // Moves cloud continuously left
    animate() {
        this.moveLeft();
    }
}