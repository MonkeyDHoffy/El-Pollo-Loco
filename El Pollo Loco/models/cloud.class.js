/**
 * Represents moving clouds in the background
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    speed = 0.2;
    
    /**
     * Initialize cloud with random position and start animation
     */
    constructor() {
        super().loadImage('img/img_pollo_locco/img/5_background/layers/4_clouds/1.png');
        this.initializeRandomPosition();
        this.animate();
    }

    /**
     * Set random position and size for cloud
     */
    initializeRandomPosition() {
        this.x = 200 + Math.random() * 4000;
        this.y = -35 + Math.random() * 15;
        this.width = 700;
        this.height = 440;
    }

    /**
     * Continuously moves cloud to the left
     */
    animate() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}
