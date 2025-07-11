class ParticleManager {
    constructor(world) {
        this.world = world;
        this.particles = [];
    }

    /**
     * Create damage particles at character position
     */
    createDamageParticles(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            // Add some randomness to spawn position
            let particleX = x + (Math.random() - 0.5) * 60;
            let particleY = y + (Math.random() - 0.5) * 40;
            
            this.particles.push(new Particle(particleX, particleY, 'damage'));
        }
        console.log(`Created ${count} damage particles at (${x}, ${y})`);
    }

    /**
     * Create combo particles (for future use)
     */
    createComboParticles(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            let particleX = x + (Math.random() - 0.5) * 40;
            let particleY = y + (Math.random() - 0.5) * 30;
            
            this.particles.push(new Particle(particleX, particleY, 'combo'));
        }
    }

    /**
     * Create dust particles when enemy is killed
     */
    createDustParticles(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            // Dust spreads more horizontally and starts from ground level
            let particleX = x + (Math.random() - 0.5) * 80; // Wider spread
            let particleY = y + Math.random() * 20; // Near ground level
            
            this.particles.push(new Particle(particleX, particleY, 'dust'));
        }
        console.log(`Created ${count} dust particles at (${x}, ${y})`);
    }

    /**
     * Update all particles
     */
    update() {
        // Update particles and remove dead ones
        this.particles = this.particles.filter(particle => {
            return !particle.update(); // Keep particles that return false (still alive)
        });
    }

    /**
     * Draw all particles
     */
    draw() {
        this.particles.forEach(particle => {
            particle.draw(this.world.ctx);
        });
    }

    /**
     * Get particle count (for debugging)
     */
    getParticleCount() {
        return this.particles.length;
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
}
