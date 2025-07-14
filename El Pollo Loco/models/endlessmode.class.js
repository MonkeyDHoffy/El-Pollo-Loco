class EndlessMode {
    constructor(world) {
        this.world = world;
        this.config = {
            minEnemies: 5,
            minEndbosses: 2,
            spawnAreaStart: 4550,
            spawnAreaEnd: 5500,
            cleanupLeftBound: -200,
            cleanupRightBound: 4900,
            enemyTypes: [Chicken, MiniChicken]
        };
        this.isActive = true;
    }

    /**
     * Main update function called from the world's game loop
     */
    update() {
        if (!this.isActive) return;
        
        this.cleanupDistantEnemies();
        this.cleanupDistantEndbosses();
        this.maintainEnemyCount();
        this.maintainEndbossCount();
    }

    /**
     * Removes enemies that are too far from the action area
     */
    cleanupDistantEnemies() {
        let beforeCount = this.world.level.enemies.length;
        this.world.level.enemies = this.world.level.enemies.filter(enemy => {
            // Remove enemies that are too far left or right
            if (enemy.x < this.config.cleanupLeftBound || 
                enemy.x > this.config.cleanupRightBound) {
                console.log(`[EndlessMode] Removing distant enemy at x: ${Math.round(enemy.x)}`);
                return false; // Remove this enemy
            }
            return true; // Keep this enemy
        });
        let afterCount = this.world.level.enemies.length;
        if (beforeCount !== afterCount) {
            console.log(`[EndlessMode] Cleaned up ${beforeCount - afterCount} distant enemies`);
        }
    }

    /**
     * Removes endbosses that are too far from the action area
     */
    cleanupDistantEndbosses() {
        let beforeCount = this.world.level.endboss.length;
        this.world.level.endboss = this.world.level.endboss.filter(endboss => {
            // Remove endbosses that are too far left or right
            if (endboss.x < this.config.cleanupLeftBound || 
                endboss.x > this.config.cleanupRightBound) {
                console.log(`[EndlessMode] Removing distant endboss at x: ${Math.round(endboss.x)}`);
                return false; // Remove this endboss
            }
            return true; // Keep this endboss
        });
        let afterCount = this.world.level.endboss.length;
        if (beforeCount !== afterCount) {
            console.log(`[EndlessMode] Cleaned up ${beforeCount - afterCount} distant endbosses`);
        }
    }

    /**
     * Maintains a minimum number of enemies by spawning new ones
     */
    maintainEnemyCount() {
        let currentEnemyCount = this.world.level.enemies.length;
        
        if (currentEnemyCount < this.config.minEnemies) {
            let enemiesToSpawn = this.config.minEnemies - currentEnemyCount;
            for (let i = 0; i < enemiesToSpawn; i++) {
                this.spawnNewEnemy();
            }
        }
    }

    /**
     * Maintains a minimum number of endbosses by spawning new ones
     */
    maintainEndbossCount() {
        let currentEndbossCount = this.world.level.endboss.length;
        
        if (currentEndbossCount < this.config.minEndbosses) {
            let endbossesToSpawn = this.config.minEndbosses - currentEndbossCount;
            for (let i = 0; i < endbossesToSpawn; i++) {
                this.spawnNewEndboss();
            }
        }
    }

    /**
     * Spawns a new enemy outside the current level area
     */
    spawnNewEnemy() {
        // Randomly choose enemy type
        let randomType = this.config.enemyTypes[
            Math.floor(Math.random() * this.config.enemyTypes.length)
        ];
        
        // Create new enemy
        let newEnemy = new randomType();
        
        // Position enemy outside level end
        let spawnRange = this.config.spawnAreaEnd - this.config.spawnAreaStart;
        newEnemy.x = this.config.spawnAreaStart + Math.random() * spawnRange;
        newEnemy.y = randomType === MiniChicken ? 385 : 376;
        
        // Set world reference
        newEnemy.world = this.world;
        
        // Apply current wave speed multiplier
        if (this.world.waveManager) {
            this.world.waveManager.applySpeedToEnemy(newEnemy);
        }
        
        // Add to enemies array
        this.world.level.enemies.push(newEnemy);
        
       
    }

    /**
     * Spawns a new endboss outside the current level area
     */
    spawnNewEndboss() {
        // Create new endboss
        let newEndboss = new Endboss();
        
        // Position endboss outside level end
        let spawnRange = this.config.spawnAreaEnd - this.config.spawnAreaStart;
        newEndboss.x = this.config.spawnAreaStart + Math.random() * spawnRange;
        
        // Set world reference and apply health scaling
        newEndboss.setWorld(this.world);
        
        // Apply current wave speed multiplier
        if (this.world.waveManager) {
            this.world.waveManager.applySpeedToEnemy(newEndboss);
        }
        
        // Add to endboss array
        this.world.level.endboss.push(newEndboss);
        
        console.log(`[EndlessMode] Spawned new endboss with ${newEndboss.maxEnergy} health at x: ${Math.round(newEndboss.x)}`);
    }

    /**
     * Called when an enemy is killed - spawns immediate replacement
     */
    onEnemyKilled(enemy) {
        if (!this.isActive) return;
        
        console.log(`[EndlessMode] Enemy killed, spawning replacement`);
        this.spawnNewEnemy();
    }

    /**
     * Called when an endboss is killed - spawns immediate replacement
     */
    onEndbossKilled(endboss) {
        if (!this.isActive) return;
        
        console.log(`[EndlessMode] Endboss killed, spawning replacement`);
        this.spawnNewEndboss();
    }

    /**
     * Enable or disable endless mode
     */
    setActive(active) {
        this.isActive = active;
        console.log(`[EndlessMode] ${active ? 'Enabled' : 'Disabled'}`);
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log(`[EndlessMode] Configuration updated:`, this.config);
    }

    /**
     * Get current status for debugging
     */
    getStatus() {
        return {
            isActive: this.isActive,
            currentEnemies: this.world.level.enemies.length,
            currentEndbosses: this.world.level.endboss.length,
            config: this.config
        };
    }
}
