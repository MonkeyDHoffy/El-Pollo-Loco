class Particle {
    constructor(x, y, type = 'damage') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0; // Full opacity at start
        this.maxLife = 1.0;
        this.size = Math.random() * 4 + 2; // Random size between 2-6px
        
        // Random velocity for scatter effect
        this.velocityX = (Math.random() - 0.5) * 4; // -2 to +2
        this.velocityY = (Math.random() - 0.5) * 4 - 2; // Slight upward bias
        
        // Fade speed
        this.fadeSpeed = 0.02; // How fast particle fades (0.02 = ~50 frames)
        
        // Color based on type
        this.setColor();
    }

    setColor() {
        switch(this.type) {
            case 'damage':
                this.color = { r: 255, g: 0, b: 0 }; // Red
                break;
            case 'heal':
                this.color = { r: 0, g: 255, b: 0 }; // Green
                break;
            case 'combo':
                this.color = { r: 255, g: 215, b: 0 }; // Gold
                break;
            default:
                this.color = { r: 255, g: 255, b: 255 }; // White
        }
    }

    update() {
        // Move particle
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Apply slight gravity
        this.velocityY += 0.1;
        
        // Fade out
        this.life -= this.fadeSpeed;
        
        // Return true if particle should be removed
        return this.life <= 0;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        
        // Set alpha based on remaining life
        let alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
        
        // Draw circular particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add slight glow effect
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`;
        ctx.shadowBlur = this.size * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}
