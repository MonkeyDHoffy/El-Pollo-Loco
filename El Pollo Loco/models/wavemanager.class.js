class WaveManager {
    constructor(world) {
        this.world = world;
        this.currentWave = 1;
        this.baseSpeedMultiplier = 1.0; // 100% base speed
        this.maxSpeedMultiplier = 2.5; // 250% max speed
        this.speedIncreasePerWave = 0.05; // 5% per wave
        this.pointsPerWave = 100; // Points needed for next wave
        this.lastCheckedScore = 0;
        
        // Chicken spawning system
        this.baseMinEnemies = 5; // Original minEnemies from endless mode
        this.chickenIncreaseStartWave = 5; // Start increasing from wave 5
        this.maxExtraChickens = 31; // Maximum additional chickens
        
        console.log("[WaveManager] Initialized - Wave 1 started");
    }

    /**
     * Update wave system based on current score
     */
    update() {
        const currentScore = this.world.totalScore;
        
        // Check if we should advance to next wave
        const expectedWave = Math.floor(currentScore / this.pointsPerWave) + 1;
        
        if (expectedWave > this.currentWave) {
            this.advanceToWave(expectedWave);
        }
    }

    /**
     * Advance to a new wave
     */
    advanceToWave(newWave) {
        const oldWave = this.currentWave;
        this.currentWave = newWave;
        
        // Calculate new speed multiplier (capped at max)
        const newMultiplier = Math.min(
            1.0 + (this.currentWave - 1) * this.speedIncreasePerWave,
            this.maxSpeedMultiplier
        );
        
        this.baseSpeedMultiplier = newMultiplier;
        
        // Calculate and update enemy count for endless mode
        this.updateEnemyCount();
        
        // Apply speed increase to all existing enemies
        this.updateEnemySpeeds();
        
        console.log(`[WaveManager] Advanced from Wave ${oldWave} to Wave ${this.currentWave}`);
        console.log(`[WaveManager] Speed multiplier: ${(this.baseSpeedMultiplier * 100).toFixed(0)}%`);
        console.log(`[WaveManager] Enemy count: ${this.getCurrentEnemyCount()}`);
        
        // Show wave change notification
        this.showWaveChangeNotification();
    }

    /**
     * Update enemy count in endless mode based on current wave
     */
    updateEnemyCount() {
        if (this.world.endlessMode) {
            const newEnemyCount = this.getCurrentEnemyCount();
            this.world.endlessMode.updateConfig({ 
                minEnemies: newEnemyCount 
            });
        }
    }

    /**
     * Calculate current enemy count based on wave
     */
    getCurrentEnemyCount() {
        if (this.currentWave < this.chickenIncreaseStartWave) {
            return this.baseMinEnemies; // Waves 1-4: base amount
        }
        
        // From wave 5+: add 1 chicken per wave, capped at max
        const extraChickens = Math.min(
            this.currentWave - this.chickenIncreaseStartWave + 1,
            this.maxExtraChickens
        );
        
        return this.baseMinEnemies + extraChickens;
    }

    /**
     * Update speeds of all existing enemies
     */
    updateEnemySpeeds() {
        // Update normal enemies
        if (this.world.level && this.world.level.enemies) {
            this.world.level.enemies.forEach(enemy => {
                this.applySpeedToEnemy(enemy);
            });
        }

        // Update endbosses
        if (this.world.level && this.world.level.endboss) {
            this.world.level.endboss.forEach(endboss => {
                this.applySpeedToEnemy(endboss);
            });
        }
    }

    /**
     * Apply current wave speed to an enemy
     */
    applySpeedToEnemy(enemy) {
        if (!enemy.originalSpeed) {
            // Store original speed on first application
            enemy.originalSpeed = enemy.speed;
        }
        
        // Apply speed multiplier
        enemy.speed = enemy.originalSpeed * this.baseSpeedMultiplier;
        
        console.log(`[WaveManager] Updated ${enemy.constructor.name} speed to ${enemy.speed.toFixed(2)} (${(this.baseSpeedMultiplier * 100).toFixed(0)}%)`);
    }

    /**
     * Get speed multiplier for new enemies
     */
    getSpeedMultiplier() {
        return this.baseSpeedMultiplier;
    }

    /**
     * Show wave change notification (temporary)
     */
    showWaveChangeNotification() {
        // This will be handled by the UI manager
        if (this.world.uiManager) {
            this.world.uiManager.showWaveChangeNotification(this.currentWave);
        }
    }

    /**
     * Get current wave info for UI
     */
    getWaveInfo() {
        return {
            currentWave: this.currentWave,
            speedMultiplier: this.baseSpeedMultiplier,
            speedPercentage: Math.round(this.baseSpeedMultiplier * 100),
            enemyCount: this.getCurrentEnemyCount(),
            extraChickens: Math.max(0, this.getCurrentEnemyCount() - this.baseMinEnemies),
            pointsToNextWave: this.pointsPerWave - (this.world.totalScore % this.pointsPerWave),
            maxWaveReached: this.baseSpeedMultiplier >= this.maxSpeedMultiplier,
            maxChickensReached: this.getCurrentEnemyCount() >= (this.baseMinEnemies + this.maxExtraChickens)
        };
    }

    /**
     * Reset wave system
     */
    reset() {
        this.currentWave = 1;
        this.baseSpeedMultiplier = 1.0;
        this.lastCheckedScore = 0;
        
        // Reset enemy count to base
        if (this.world.endlessMode) {
            this.world.endlessMode.updateConfig({ 
                minEnemies: this.baseMinEnemies 
            });
        }
        
        console.log("[WaveManager] Reset to Wave 1");
    }
}
