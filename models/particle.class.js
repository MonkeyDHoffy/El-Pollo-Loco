/**
 * Particle effect system for visual feedback (damage, dust, etc.)
 */
class Particle {
    /**
     * Creates a new particle with specified type and position
     * @param {number} x - Starting x position
     * @param {number} y - Starting y position
     * @param {string} type - Particle type ('damage', 'heal', 'combo', 'dust')
     */
    constructor(x, y, type = 'damage') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.initializeParticleProperties();
        this.setColor();
    }

    /**
     * Sets size, fade speed, and velocity based on particle type
     */
    initializeParticleProperties() {
        if (this.type === 'dust') {
            this.initializeDustProperties();
        } else {
            this.initializeRegularProperties();
        }
    }

    /**
     * Sets properties specific to dust particles
     */
    initializeDustProperties() {
        this.size = Math.random() * 6 + 3;
        this.fadeSpeed = 0.015;
        this.velocityX = (Math.random() - 0.5) * 6;
        this.velocityY = (Math.random() - 0.5) * 3 - 1;
    }

    /**
     * Sets properties for regular particles (damage, heal, combo)
     */
    initializeRegularProperties() {
        this.size = Math.random() * 4 + 2;
        this.fadeSpeed = 0.02;
        this.velocityX = (Math.random() - 0.5) * 4;
        this.velocityY = (Math.random() - 0.5) * 4 - 2;
    }

    /**
     * Sets particle color based on type
     */
    setColor() {
        switch(this.type) {
            case 'damage':
                this.color = { r: 255, g: 0, b: 0 };
                break;
            case 'heal':
                this.color = { r: 0, g: 255, b: 0 };
                break;
            case 'combo':
                this.color = { r: 255, g: 215, b: 0 };
                break;
            case 'dust':
                this.setDustColor();
                break;
            default:
                this.color = { r: 255, g: 255, b: 255 };
        }
    }

    /**
     * Sets dust particle color with random variation
     */
    setDustColor() {
        let dustVariation = Math.random() * 60;
        this.color = { 
            r: 139 + dustVariation, 
            g: 69 + dustVariation * 0.5, 
            b: 19 + dustVariation * 0.3 
        };
    }

    /**
     * Updates particle position, physics, and lifecycle
     * @returns {boolean} True if particle should be removed
     */
    update() {
        this.updatePosition();
        this.applyPhysics();
        this.updateLife();   
        return this.life <= 0;
    }

    /**
     * Updates particle position based on velocity
     */
    updatePosition() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    /**
     * Applies physics effects based on particle type
     */
    applyPhysics() {
        if (this.type === 'dust') {
            this.applyDustPhysics();
        } else {
            this.applyRegularPhysics();
        }
    }

    /**
     * Applies lighter gravity and air resistance for dust
     */
    applyDustPhysics() {
        this.velocityY += 0.05;
        this.velocityX *= 0.98;
    }

    /**
     * Applies stronger gravity for regular particles
     */
    applyRegularPhysics() {
        this.velocityY += 0.1;
    }

    /**
     * Updates particle life and handles fading
     */
    updateLife() {
        this.life -= this.fadeSpeed;
    }

    /**
     * Renders the particle with glow effect
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        if (this.life <= 0) return;   
        ctx.save();
        this.setupParticleStyle(ctx);
        this.drawMainParticle(ctx);
        this.drawGlowEffect(ctx);
        ctx.restore();
    }

    /**
     * Sets up particle rendering style based on current life
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    setupParticleStyle(ctx) {
        let alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
    }

    /**
     * Draws the main particle circle
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    drawMainParticle(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draws the glow effect around the particle
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    drawGlowEffect(ctx) {
        let alpha = this.life / this.maxLife;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`;
        ctx.shadowBlur = this.size * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
