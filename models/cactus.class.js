/**
 * Represents a static cactus obstacle
 * @extends DrawableObject
 */
class Cactus extends DrawableObject {
    width = 200;
    height = 600;

    /**
     * Initialize cactus at specified position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate (default: 80)
     */
    constructor(x, y = 80) {
        super();
        this.loadImage('img/img_pollo_locco/img/10_special/cactus.png');
        this.x = x;
        this.y = y - 155;
    }

    /**
     * Draws debug frame around cactus collision area
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "rgba(255, 0, 0, 0)";
        ctx.rect(this.x + 60, this.y + 50, this.width - 120, this.height - 80);
        ctx.stroke();
    }
}
