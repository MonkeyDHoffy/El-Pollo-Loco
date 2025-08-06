/**
 * Manages endless mode functionality including enemy spawning and cleanup
 */
class EndlessMode {
    /**
     * Initialize endless mode with world reference and configuration
     * @param {World} world - Game world instance
     */
    constructor(world) {
        this.world = world;
        this.initializeConfiguration();
        this.isActive = true;
    }

    /**
     * Initialize endless mode configuration
     */
    initializeConfiguration() {
        this.config = {
            minEnemies: 5,
            minEndbosses: 2,
            spawnAreaStart: 4550,
            spawnAreaEnd: 5500,
            cleanupLeftBound: -200,
            cleanupRightBound: 4900,
            enemyTypes: [Chicken, MiniChicken]
        };
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
            return this.shouldKeepEnemy(enemy);
        });
        
        this.logEnemyCleanup(beforeCount);
    }

    /**
     * Determines if enemy should be kept based on position
     * @param {Object} enemy - Enemy object
     * @returns {boolean} True if enemy should be kept
     */
    shouldKeepEnemy(enemy) {
        if (enemy.x < this.config.cleanupLeftBound || 
            enemy.x > this.config.cleanupRightBound) {
            return false;
        }
        return true;
    }

    /**
     * Log enemy cleanup results
     * @param {number} beforeCount - Count before cleanup
     */
    logEnemyCleanup(beforeCount) {
        let afterCount = this.world.level.enemies.length;
        if (beforeCount !== afterCount) {
        }
    }

    /**
     * Removes endbosses that are too far from the action area
     */
    cleanupDistantEndbosses() {
        let beforeCount = this.world.level.endboss.length;
        this.world.level.endboss = this.world.level.endboss.filter(endboss => {
            if (endboss.x < this.config.cleanupLeftBound || 
                endboss.x > this.config.cleanupRightBound) {
                return false; 
            }
            return true; 
        });
        let afterCount = this.world.level.endboss.length;
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
        let enemyType = this.selectRandomEnemyType();
        let newEnemy = this.createAndPositionEnemy(enemyType);
        this.configureNewEnemy(newEnemy);
        this.addEnemyToLevel(newEnemy);
    }

    /**
     * Select random enemy type from available types
     * @returns {Function} Enemy constructor
     */
    selectRandomEnemyType() {
        return this.config.enemyTypes[
            Math.floor(Math.random() * this.config.enemyTypes.length)
        ];
    }

    /**
     * Create and position new enemy
     * @param {Function} enemyType - Enemy constructor
     * @returns {Object} New enemy instance
     */
    createAndPositionEnemy(enemyType) {
        let newEnemy = new enemyType();
        let spawnRange = this.config.spawnAreaEnd - this.config.spawnAreaStart;
        
        newEnemy.x = this.config.spawnAreaStart + Math.random() * spawnRange;
        newEnemy.y = enemyType === MiniChicken ? 395 : 370;
        
        return newEnemy;
    }

    /**
     * Configure new enemy with world reference and speed
     * @param {Object} newEnemy - Enemy instance
     */
    configureNewEnemy(newEnemy) {
        newEnemy.world = this.world;
        if (this.world.waveManager) {
            this.world.waveManager.applySpeedToEnemy(newEnemy);
        }
    }

    /**
     * Add enemy to level enemies array
     * @param {Object} newEnemy - Enemy instance
     */
    addEnemyToLevel(newEnemy) {
        this.world.level.enemies.push(newEnemy);
    }

    /**
     * Spawns a new endboss outside the current level area
     */
    spawnNewEndboss() {
        let newEndboss = this.createAndPositionEndboss();
        this.configureNewEndboss(newEndboss);
        this.addEndbossToLevel(newEndboss);
    }

    /**
     * Create and position new endboss
     * @returns {Endboss} New endboss instance
     */
    createAndPositionEndboss() {
        let newEndboss = new Endboss();
        let spawnRange = this.config.spawnAreaEnd - this.config.spawnAreaStart;
        newEndboss.x = this.config.spawnAreaStart + Math.random() * spawnRange;
        return newEndboss;
    }

    /**
     * Configure new endboss with world reference and speed
     * @param {Endboss} newEndboss - Endboss instance
     */
    configureNewEndboss(newEndboss) {
        newEndboss.setWorld(this.world);
        
        if (this.world.waveManager) {
            this.world.waveManager.applySpeedToEnemy(newEndboss);
        }
    }

    /**
     * Add endboss to level endboss array
     * @param {Endboss} newEndboss - Endboss instance
     */
    addEndbossToLevel(newEndboss) {
        this.world.level.endboss.push(newEndboss);
    }

    /**
     * Called when an enemy is killed - spawns immediate replacement
     */
    onEnemyKilled(enemy) {
        if (!this.isActive) return;
        this.spawnNewEnemy();
    }

    /**
     * Called when an endboss is killed - spawns immediate replacement
     */
    onEndbossKilled(endboss) {
        if (!this.isActive) return;
        this.spawnNewEndboss();
    }

    /**
     * Enable or disable endless mode
     */
    setActive(active) {
        this.isActive = active;
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
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
