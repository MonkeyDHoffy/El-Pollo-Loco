/**
 * Manages wave progression, enemy scaling, and difficulty progression
 */
class WaveManager {
    /**
     * Creates a new wave manager
     * @param {World} world - Reference to game world
     */
    constructor(world) {
        this.world = world;
        this.currentWave = 1;
        this.initializeSpeedSystem();
        this.initializeEnemySpawning();
        this.initializeDamageScaling();
        this.pointsPerWave = 100;
        this.lastCheckedScore = 0;
    }

    /**
     * Initializes speed progression system
     */
    initializeSpeedSystem() {
        this.baseSpeedMultiplier = 1.0;
        this.maxSpeedMultiplier = 2.5;
        this.speedIncreasePerWave = 0.05;
    }

    /**
     * Initializes enemy spawning configuration
     */
    initializeEnemySpawning() {
        this.baseMinEnemies = 5;
        this.chickenIncreaseStartWave = 5;
        this.maxExtraChickens = 33;    
        this.baseMinEndbosses = 2;
        this.endbossIncreaseStartWave = 13;
        this.endbossIncreaseInterval = 7;
        this.maxEndbosses = 8;
    }

    /**
     * Initializes damage and health scaling system
     */
    initializeDamageScaling() {
        this.scalingStartWave = 22;
        this.damageIncreasePerWave = 0.05;
        this.healthIncreasePerWave = 0.05;
        this.baseDamageEnemy = 13;
        this.baseDamageEndboss = 23;
        this.baseHealthEndboss = 50;
    }

    /**
     * Updates wave system based on current score
     */
    update() {
        let currentScore = this.world.totalScore;
        let expectedWave = Math.floor(currentScore / this.pointsPerWave) + 1;       
        if (expectedWave > this.currentWave) {
            this.advanceToWave(expectedWave);
        }
    }

    /**
     * Advances to a new wave with all progression updates
     * @param {number} newWave - Wave number to advance to
     */
    advanceToWave(newWave) {
        let oldWave = this.currentWave;
        this.currentWave = newWave;      
        this.updateSpeedMultiplier();
        this.updateEnemyCount();
        this.updateEnemySpeeds();
        this.showWaveChangeNotification();
    }

    /**
     * Updates speed multiplier based on current wave
     */
    updateSpeedMultiplier() {
        let newMultiplier = Math.min(
            1.0 + (this.currentWave - 1) * this.speedIncreasePerWave,
            this.maxSpeedMultiplier
        );    
        this.baseSpeedMultiplier = newMultiplier;
    }

    /**
     * Update enemy count in endless mode based on current wave
     */
    updateEnemyCount() {
        if (this.world.endlessMode) {
            let newEnemyCount = this.getCurrentEnemyCount();
            let newEndbossCount = this.getCurrentEndbossCount();
            
            this.world.endlessMode.updateConfig({ 
                minEnemies: newEnemyCount,
                minEndbosses: newEndbossCount
            });
        }
    }

    /**
     * Calculate current enemy count based on wave
     * @returns {number} Number of enemies for current wave
     */
    getCurrentEnemyCount() {
        if (this.currentWave < this.chickenIncreaseStartWave) {
            return this.baseMinEnemies;
        }
        
        return this.calculateScaledEnemyCount();
    }

    /**
     * Calculates scaled enemy count for waves 5+
     * @returns {number} Scaled enemy count
     */
    calculateScaledEnemyCount() {
        let extraChickens = Math.min(
            this.currentWave - this.chickenIncreaseStartWave + 1,
            this.maxExtraChickens
        );
        
        return this.baseMinEnemies + extraChickens;
    }

    /**
     * Calculate current endboss count based on wave
     * @returns {number} Number of endbosses for current wave
     */
    getCurrentEndbossCount() {
        if (this.currentWave < this.endbossIncreaseStartWave) {
            return this.baseMinEndbosses;
        }
        
        return this.calculateScaledEndbossCount();
    }

    /**
     * Calculates scaled endboss count for waves 15+
     * @returns {number} Scaled endboss count
     */
    calculateScaledEndbossCount() {
        let wavesAfterStart = this.currentWave - this.endbossIncreaseStartWave;
        let extraEndbosses = Math.floor(wavesAfterStart / this.endbossIncreaseInterval) + 1;
        
        return Math.min(this.baseMinEndbosses + extraEndbosses, this.maxEndbosses);
    }

    /**
     * Update speeds of all existing enemies
     */
    updateEnemySpeeds() {
        this.updateNormalEnemySpeeds();
        this.updateEndbossSpeeds();
    }

    /**
     * Updates speeds for normal enemies
     */
    updateNormalEnemySpeeds() {
        if (this.world.level && this.world.level.enemies) {
            this.world.level.enemies.forEach(enemy => {
                this.applySpeedToEnemy(enemy);
            });
        }
    }

    /**
     * Updates speeds for endbosses
     */
    updateEndbossSpeeds() {
        if (this.world.level && this.world.level.endboss) {
            this.world.level.endboss.forEach(endboss => {
                this.applySpeedToEnemy(endboss);
            });
        }
    }

    /**
     * Apply current wave speed to an enemy
     * @param {Object} enemy - Enemy object to update speed for
     */
    applySpeedToEnemy(enemy) {
        this.storeOriginalSpeed(enemy);
        this.calculateNewSpeed(enemy);
    }

    /**
     * Stores original speed for enemy if not already stored
     * @param {Object} enemy - Enemy object
     */
    storeOriginalSpeed(enemy) {
        if (!enemy.originalSpeed) {
            enemy.originalSpeed = enemy.speed;
        }
    }

    /**
     * Calculates and applies new speed to enemy
     * @param {Object} enemy - Enemy object
     */
    calculateNewSpeed(enemy) {
        enemy.speed = enemy.originalSpeed * this.baseSpeedMultiplier;
    }

    /**
     * Get speed multiplier for new enemies
     */
    getSpeedMultiplier() {
        return this.baseSpeedMultiplier;
    }

    /**
     * Get damage multiplier based on current wave (starts at wave 35)
     */
    getDamageMultiplier() {
        if (this.currentWave < this.scalingStartWave) {
            return 1.0; 
        }
        
        let wavesAfterScaling = this.currentWave - this.scalingStartWave;
        return 1.0 + (wavesAfterScaling * this.damageIncreasePerWave);
    }

    /**
     * Get health multiplier for endbosses based on current wave (starts at wave 35)
     */
    getHealthMultiplier() {
        if (this.currentWave < this.scalingStartWave) {
            return 1.0; 
        }
        
        let wavesAfterScaling = this.currentWave - this.scalingStartWave;
        return 1.0 + (wavesAfterScaling * this.healthIncreasePerWave);
    }

    /**
     * Get scaled damage for enemies based on current wave
     */
    getScaledEnemyDamage() {
        return Math.round(this.baseDamageEnemy * this.getDamageMultiplier());
    }

    /**
     * Get scaled damage for endbosses based on current wave
     */
    getScaledEndbossDamage() {
        return Math.round(this.baseDamageEndboss * this.getDamageMultiplier());
    }

    /**
     * Get scaled health for endbosses based on current wave
     */
    getScaledEndbossHealth() {
        return Math.round(this.baseHealthEndboss * this.getHealthMultiplier());
    }

    /**
     * Show wave change notification (temporary)
     */
    showWaveChangeNotification() {
        if (this.world.uiManager) {
            this.world.uiManager.showWaveChangeNotification(this.currentWave);
        }
    }

    /**
     * Get current wave info for UI
     * @returns {Object} Comprehensive wave information
     */
    getWaveInfo() {
        return {
            ...this.getBasicWaveInfo(),
            ...this.getEnemyInfo(),
            ...this.getProgressInfo(),
            ...this.getScalingInfo()
        };
    }

    /**
     * Gets basic wave and speed information
     * @returns {Object} Basic wave information
     */
    getBasicWaveInfo() {
        return {
            currentWave: this.currentWave,
            speedMultiplier: this.baseSpeedMultiplier,
            speedPercentage: Math.round(this.baseSpeedMultiplier * 100)
        };
    }

    /**
     * Gets enemy count information
     * @returns {Object} Enemy information
     */
    getEnemyInfo() {
        return {
            enemyCount: this.getCurrentEnemyCount(),
            extraChickens: Math.max(0, this.getCurrentEnemyCount() - this.baseMinEnemies),
            endbossCount: this.getCurrentEndbossCount(),
            extraEndbosses: Math.max(0, this.getCurrentEndbossCount() - this.baseMinEndbosses)
        };
    }

    /**
     * Gets progression and maximum limits information
     * @returns {Object} Progress information
     */
    getProgressInfo() {
        return {
            pointsToNextWave: this.pointsPerWave - (this.world.totalScore % this.pointsPerWave),
            maxWaveReached: this.baseSpeedMultiplier >= this.maxSpeedMultiplier,
            maxChickensReached: this.getCurrentEnemyCount() >= (this.baseMinEnemies + this.maxExtraChickens),
            maxEndbossesReached: this.getCurrentEndbossCount() >= this.maxEndbosses
        };
    }

    /**
     * Gets scaling information for wave 35+
     * @returns {Object} Scaling information
     */
    getScalingInfo() {
        return {
            damageMultiplier: this.getDamageMultiplier(),
            damagePercentage: Math.round(this.getDamageMultiplier() * 100),
            healthMultiplier: this.getHealthMultiplier(),
            healthPercentage: Math.round(this.getHealthMultiplier() * 100),
            scaledEnemyDamage: this.getScaledEnemyDamage(),
            scaledEndbossDamage: this.getScaledEndbossDamage(),
            scaledEndbossHealth: this.getScaledEndbossHealth(),
            isDamageScaling: this.currentWave >= this.scalingStartWave
        };
    }

    /**
     * Reset wave system
     */
    reset() {
        this.currentWave = 1;
        this.baseSpeedMultiplier = 1.0;
        this.lastCheckedScore = 0;
        if (this.world.endlessMode) {
            this.world.endlessMode.updateConfig({ 
                minEnemies: this.baseMinEnemies,
                minEndbosses: this.baseMinEndbosses
            });
        }
    }
}
