/**
 * Handles visual rendering for Endboss UI elements
 */
class EndbossUIRenderer {
    /**
     * Draw energy bar above endboss
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Endboss} endboss - Endboss instance
     */
    static drawEnergyBar(ctx, endboss) {
        let barWidth = 180;
        let barHeight = 20;
        let barX = endboss.x + (endboss.width - barWidth) / 2;
        let barY = endboss.y - 40;
        let energyPercentage = endboss.energy / endboss.maxEnergy;

        EndbossUIRenderer.drawBarBackground(ctx, barX, barY, barWidth, barHeight);

        let currentWidth = barWidth * energyPercentage;
        EndbossUIRenderer.drawBarFill(ctx, barX, barY, currentWidth, barHeight, energyPercentage);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        EndbossUIRenderer.drawBarText(ctx, barX, barY, barWidth, barHeight, endboss.energy, endboss.maxEnergy);
    }

    static drawBarBackground(ctx, x, y, width, height) {
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y, width, height);
    }

    static drawBarFill(ctx, x, y, currentWidth, height, percentage) {
        if (percentage > 0.6) {
            ctx.fillStyle = '#00FF00';
        } else if (percentage > 0.3) {
            ctx.fillStyle = '#FFFF00';
        } else {
            ctx.fillStyle = '#FF0000';
        }
        ctx.fillRect(x, y, currentWidth, height);
    }

    static drawBarText(ctx, x, y, width, height, energy, maxEnergy) {
        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        let text = `Pollo Loco: ${energy}/${maxEnergy}`;
        ctx.strokeText(text, x + width / 2, y + height / 2 + 5);
        ctx.fillText(text, x + width / 2, y + height / 2 + 5);
        ctx.restore();
    }
}
