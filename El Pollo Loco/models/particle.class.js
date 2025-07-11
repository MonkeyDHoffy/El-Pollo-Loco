class Particle {
    constructor(x, y, type = 'damage') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0; // Full opacity at start
        this.maxLife = 1.0;
        
        // Size and properties based on type
        if (type === 'dust') {
            this.size = Math.random() * 6 + 3; // Larger dust particles (3-9px)
            this.fadeSpeed = 0.015; // Slower fade for dust (lasts longer)
            
            // More horizontal spread for dust
            this.velocityX = (Math.random() - 0.5) * 6; // -3 to +3
            this.velocityY = (Math.random() - 0.5) * 3 - 1; // Slight upward bias
        } else {
            this.size = Math.random() * 4 + 2; // Regular size (2-6px)
            this.fadeSpeed = 0.02; // Regular fade speed
            
            // Random velocity for scatter effect
            this.velocityX = (Math.random() - 0.5) * 4; // -2 to +2
            this.velocityY = (Math.random() - 0.5) * 4 - 2; // Slight upward bias
        }
        
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
            case 'dust':
                // Brown/tan dust colors with some variation
                let dustVariation = Math.random() * 60; // 0-60 variation
                this.color = { 
                    r: 139 + dustVariation, 
                    g: 69 + dustVariation * 0.5, 
                    b: 19 + dustVariation * 0.3 
                }; // Sandy brown variations
                break;
            default:
                this.color = { r: 255, g: 255, b: 255 }; // White
        }
    }

    update() {
        // Move particle
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Apply physics based on type
        if (this.type === 'dust') {
            // Dust settles slower and has air resistance
            this.velocityY += 0.05; // Lighter gravity for dust
            this.velocityX *= 0.98; // Air resistance slows horizontal movement
        } else {
            // Regular particles have stronger gravity
            this.velocityY += 0.1;
        }
        
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
