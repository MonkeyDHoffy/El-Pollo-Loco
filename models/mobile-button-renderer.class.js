/**
 * Handles visual rendering for mobile control buttons
 */
class MobileButtonRenderer {
    /**
     * Draws a mobile control button with Mexican styling
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} button - Button configuration
     */
    static drawButton(ctx, button) {
        ctx.save();
        ctx.globalAlpha = 0.60;
        let gradient = ctx.createLinearGradient(
            button.x, button.y, 
            button.x, button.y + button.height
        );
        if (button.pressed) {
            if (button.id === 'jump' || button.id === 'throw') {
                gradient.addColorStop(0, '#2D7D68');
                gradient.addColorStop(1, '#1B4D3E');
            } else {
                gradient.addColorStop(0, '#C62E3A');
                gradient.addColorStop(1, '#8B1E2B');
            }
        } else {
            if (button.id === 'jump' || button.id === 'throw') {
                gradient.addColorStop(0, '#43AA8B');
                gradient.addColorStop(0.5, '#52C69B');
                gradient.addColorStop(1, '#3A9B7A');
            } else {
                gradient.addColorStop(0, '#E63946');
                gradient.addColorStop(0.5, '#F04A5A');
                gradient.addColorStop(1, '#D32F2F');
            }
        }
        ctx.fillStyle = gradient;
        ctx.strokeStyle = button.borderColor;
        ctx.lineWidth = 4;
        this.roundRect(ctx, button.x, button.y, button.width, button.height, button.radius);
        ctx.fill();
        ctx.stroke();
        ctx.shadowColor = 'rgba(247, 127, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = button.textColor;
        ctx.font = button.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(139, 30, 43, 0.8)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        let centerX = button.x + button.width / 2;
        let centerY = button.y + button.height / 2;
        ctx.fillText(button.text, centerX, centerY);
        ctx.restore();
    }
    /**
     * Draws rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {number} radius - Corner radius
     */
    static roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}
