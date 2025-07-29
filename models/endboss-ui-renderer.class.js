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
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        let currentWidth = barWidth * energyPercentage;
        if (energyPercentage > 0.6) {
            ctx.fillStyle = '#00FF00';
        } else if (energyPercentage > 0.3) {
            ctx.fillStyle = '#FFFF00';
        } else {
            ctx.fillStyle = '#FF0000';
        }
        ctx.fillRect(barX, barY, currentWidth, barHeight);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeText(`Pollo Loco: ${endboss.energy}/${endboss.maxEnergy}`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        ctx.fillText(`Pollo Loco: ${endboss.energy}/${endboss.maxEnergy}`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        ctx.restore();
    }
}
