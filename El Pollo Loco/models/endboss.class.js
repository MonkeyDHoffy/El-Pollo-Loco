class Endboss extends MovableObject {
    height = 300;
    width = 200;
    y = 175;
    energy = 50;
    isDead = false;
    
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    constructor(index = 0) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        
        // Default spawn position - can be overridden after creation
        this.x = 3800 - (index * 600);
        this.animate();
    }

    // Controls boss movement and animation
    animate() {
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                if (!this.isDead) {
                    this.moveLeft(false);
                }
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.world || !this.world.isPaused) {
                if (!this.isDead) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 1000 / 10);
    }

    // Override hit method to handle death
    hit(damage) {
        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.die();
        }
        console.log(`Endboss getroffen! Energy: ${this.energy}/50`);
    }

    // Handle endboss death
    die() {
        if (!this.isDead) {
            this.isDead = true;
            this.speed = 0;
            console.log("Endboss besiegt!");
        }
    }

    // Draw energy bar above endboss
    draw(ctx) {
        // Draw the endboss sprite
        super.draw(ctx);
        
        // Draw energy bar above endboss
        this.drawEnergyBar(ctx);
    }

    drawEnergyBar(ctx) {
        let barWidth = 180;
        let barHeight = 20;
        let barX = this.x + (this.width - barWidth) / 2;
        let barY = this.y - 40;
        
        let energyPercentage = this.energy / 50;
        
        // Simple background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health bar color based on percentage
        let currentWidth = barWidth * energyPercentage;
        if (energyPercentage > 0.6) {
            ctx.fillStyle = '#00FF00';
        } else if (energyPercentage > 0.3) {
            ctx.fillStyle = '#FFFF00';
        } else {
            ctx.fillStyle = '#FF0000';
        }
        
        ctx.fillRect(barX, barY, currentWidth, barHeight);
        
        // Simple border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Simple text
        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        
        ctx.strokeText(`Pollo Loco: ${this.energy}/50`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        ctx.fillText(`Pollo Loco: ${this.energy}/50`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        
        ctx.restore();
    }
}