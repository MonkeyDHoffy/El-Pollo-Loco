class Endboss extends MovableObject {
    height = 300;
    width = 200;
    y = 175;
    energy = 50; // Reduced from 70 to 50 Energy
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
        
        // Position depends on index - moved further back for longer level
        this.x = 3800 - (index * 600); // Was 2000 - (index * 500)
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
        // Energy bar dimensions
        let barWidth = 180;
        let barHeight = 20;
        let barX = this.x + (this.width - barWidth) / 2;
        let barY = this.y - 40;
        
        // Calculate energy percentage
        let energyPercentage = this.energy / 50;
        
        // Mexikanische Flaggen-Streifen als Hintergrund
        // Grüner Streifen (links)
        ctx.fillStyle = '#006847';
        ctx.fillRect(barX, barY, barWidth / 3, barHeight);
        
        // Weißer Streifen (mitte)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(barX + barWidth / 3, barY, barWidth / 3, barHeight);
        
        // Roter Streifen (rechts)
        ctx.fillStyle = '#CE1126';
        ctx.fillRect(barX + (barWidth / 3) * 2, barY, barWidth / 3, barHeight);
        
        // Aktuelle Energy Bar (mexikanische Farben)
        let currentWidth = barWidth * energyPercentage;
        if (energyPercentage > 0.6) {
            // Grün-Gold Gradient
            let gradient = ctx.createLinearGradient(barX, barY, barX + currentWidth, barY);
            gradient.addColorStop(0, '#228B22');
            gradient.addColorStop(1, '#FFD700');
            ctx.fillStyle = gradient;
        } else if (energyPercentage > 0.3) {
            // Orange-Gelb (wie mexikanische Sonne)
            let gradient = ctx.createLinearGradient(barX, barY, barX + currentWidth, barY);
            gradient.addColorStop(0, '#FF8C00');
            gradient.addColorStop(1, '#FFFF00');
            ctx.fillStyle = gradient;
        } else {
            // Rot-Pink (wie Chili/Paprika)
            let gradient = ctx.createLinearGradient(barX, barY, barX + currentWidth, barY);
            gradient.addColorStop(0, '#DC143C');
            gradient.addColorStop(1, '#FF1493');
            ctx.fillStyle = gradient;
        }
        
        ctx.fillRect(barX, barY, currentWidth, barHeight);
        
        // Dekorative Azteken-inspirierte Umrandung
        ctx.strokeStyle = '#8B4513'; // Braun wie Adobe
        ctx.lineWidth = 3;
        ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        // Innere goldene Umrandung
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Mexikanischer Stil Text mit Schatten
        ctx.save();
        ctx.font = 'bold 14px serif'; // Serif für klassischen Look
        ctx.textAlign = 'center';
        
        // Text Schatten (schwarz)
        ctx.fillStyle = 'black';
        ctx.fillText(`Pollo Loco: ${this.energy}/50`, barX + barWidth / 2 + 1, barY + barHeight / 2 + 5 + 1);
        
        // Haupttext (weiß mit goldenem Rand)
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'white';
        ctx.strokeText(`Pollo Loco: ${this.energy}/50`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        ctx.fillText(`Pollo Loco: ${this.energy}/50`, barX + barWidth / 2, barY + barHeight / 2 + 5);
        
        ctx.restore();
        
        // Kleine dekorative Sterne (wie auf mexikanischer Flagge inspiriert)
        if (energyPercentage > 0) {
            this.drawMexicanStar(ctx, barX - 15, barY + barHeight / 2, 8);
            this.drawMexicanStar(ctx, barX + barWidth + 7, barY + barHeight / 2, 8);
        }
    }

    // Hilfsmethode für mexikanische Sterne
    drawMexicanStar(ctx, x, y, radius) {
        ctx.save();
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            let angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            let xPos = x + Math.cos(angle) * radius;
            let yPos = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(xPos, yPos);
            } else {
                ctx.lineTo(xPos, yPos);
            }
            
            // Innere Punkte für Stern-Form
            angle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
            xPos = x + Math.cos(angle) * (radius * 0.5);
            yPos = y + Math.sin(angle) * (radius * 0.5);
            ctx.lineTo(xPos, yPos);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}