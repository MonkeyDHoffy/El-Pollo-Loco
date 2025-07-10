class Cactus extends DrawableObject {
    width = 200;
    height = 400;
    parallaxSpeed = 0.2;
    originalX;

    constructor(x, y = 80) {
        super();
        this.loadImage('img/img_pollo_locco/img/10_special/cactus.png');
        this.x = x;
        this.y = y;
        this.originalX = this.x;
    }

    updatePosition(characterX) {
        let parallaxOffset = characterX * this.parallaxSpeed;
        this.x = this.originalX - parallaxOffset;
    }

    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
        ctx.rect(this.x + 60, this.y + 50, this.width - 120, this.height - 80);
        ctx.stroke();
    }
}
