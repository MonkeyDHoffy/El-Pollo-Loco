/**
 * Manages particle effects and their lifecycle
 */
class ParticleManager {
    /**
     * Creates a new particle manager
     * @param {World} world - Reference to game world
     */
    constructor(world) {
        this.world = world;
        this.particles = [];
    }

    /**
     * Creates damage particles at specified position
     * @param {number} x - X position for particles
     * @param {number} y - Y position for particles
     * @param {number} count - Number of particles to create
     */
    createDamageParticles(x, y, count = 8) {
        this.createParticlesOfType(x, y, count, 'damage', 60, 40);
    }

    /**
     * Creates combo particles for special effects
     * @param {number} x - X position for particles
     * @param {number} y - Y position for particles
     * @param {number} count - Number of particles to create
     */
    createComboParticles(x, y, count = 5) {
        this.createParticlesOfType(x, y, count, 'combo', 40, 30);
    }

    /**
     * Creates dust particles when enemies are killed
     * @param {number} x - X position for particles
     * @param {number} y - Y position for particles
     * @param {number} count - Number of particles to create
     */
    createDustParticles(x, y, count = 12) {
        this.createParticlesOfType(x, y, count, 'dust', 80, 20);
    }

    /**
     * Generic method to create particles of any type
     * @param {number} x - Base X position
     * @param {number} y - Base Y position
     * @param {number} count - Number of particles
     * @param {string} type - Particle type
     * @param {number} spreadX - Horizontal spread range
     * @param {number} spreadY - Vertical spread range
     */
    createParticlesOfType(x, y, count, type, spreadX, spreadY) {
        for (let i = 0; i < count; i++) {
            let particlePos = this.calculateParticlePosition(x, y, type, spreadX, spreadY);
            this.particles.push(new Particle(particlePos.x, particlePos.y, type));
        }
    }

    /**
     * Calculates individual particle position with randomness
     * @param {number} baseX - Base X position
     * @param {number} baseY - Base Y position
     * @param {string} type - Particle type
     * @param {number} spreadX - Horizontal spread
     * @param {number} spreadY - Vertical spread
     * @returns {Object} Particle position {x, y}
     */
    calculateParticlePosition(baseX, baseY, type, spreadX, spreadY) {
        if (type === 'dust') {
            return {
                x: baseX + (Math.random() - 0.5) * spreadX,
                y: baseY + Math.random() * spreadY
            };
        } else {
            return {
                x: baseX + (Math.random() - 0.5) * spreadX,
                y: baseY + (Math.random() - 0.5) * spreadY
            };
        }
    }

    /**
     * Updates all particles and removes expired ones
     */
    update() {
        this.particles = this.particles.filter(particle => {
            return !particle.update();
        });
    }

    /**
     * Renders all active particles
     */
    draw() {
        this.particles.forEach(particle => {
            particle.draw(this.world.ctx);
        });
    }

    /**
     * Gets current particle count for debugging
     * @returns {number} Number of active particles
     */
    getParticleCount() {
        return this.particles.length;
    }

    /**
     * Removes all particles immediately
     */
    clear() {
        this.particles = [];
    }
}
