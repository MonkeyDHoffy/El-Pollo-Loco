class ItemCollector {
    constructor(world) {
        this.world = world;
        this.config = {
            enableBottleRespawn: true,  // Automatically spawn new bottles
            enableCoinRespawn: false,   // Disable coin respawn by default
            maxBottlesInLevel: 25,      // Maximum bottles at any time
            maxCoinsInLevel: 30         // Maximum coins at any time
        };
    }

    /**
     * Collect a coin
     */
    collectCoin(coin, index) {
        this.world.level.coins.splice(index, 1);
        this.world.coinScore += 1;
        this.world.character.coins += 1;
        this.world.totalScore += 5;
        
        let collectedPercentage = (this.world.character.coins / this.world.totalCoinsInLevel) * 100;    
        this.world.coinstatusbar.setPercentage(collectedPercentage);
        this.world.coinstatusbar.setCoinCount(this.world.character.coins);
        
        this.world.audioManager.playRandomCoinCollectingSound();
        
        console.log('Münze gesammelt! Score:', this.world.coinScore);
        console.log(`Coins gesammelt: ${this.world.character.coins}/${this.world.totalCoinsInLevel} (${Math.round(collectedPercentage)}%)`);
        
        // Special bonus: restore full energy when all coins collected
        if (this.world.character.coins === this.world.totalCoinsInLevel) {
            this.world.character.energy = 100;
            this.world.statusbar.setPercentage(this.world.character.energy);
            console.log('Alle Münzen gesammelt! Energie vollständig wiederhergestellt!');
            
            // Respawn all coins after short delay
            setTimeout(() => {
                this.respawnAllCoins();
            }, 1000); // 1 second delay
        }
    }

    /**
     * Collect a bottle
     */
    collectBottle(bottle, index) {
        if (this.world.character.bottles >= 10) {
            console.log('Maximum bottles reached! Cannot collect more.');
            return;
        }
        
        this.world.level.bottles.splice(index, 1);
        this.world.character.bottles += 1; 
        
        this.world.bottlestatusbar.setBottleCount(this.world.character.bottles);
        
        this.world.audioManager.playRandomBottleCollectingSound();
        
        console.log('Flasche gesammelt! Bottles:', this.world.character.bottles);
        console.log(`Bottles gesammelt: ${this.world.character.bottles}/10`);
        
        // Spawn new bottle immediately when one is collected (if enabled and under limit)
        if (this.config.enableBottleRespawn && this.world.level.bottles.length < this.config.maxBottlesInLevel) {
            this.spawnNewBottle();
        }
    }

    /**
     * Spawn a new bottle at a random location
     */
    spawnNewBottle() {
        // Create new bottle
        let newBottle = new Bottle();
        
        // Random spawn location - spread across the level (only X-axis)
        let spawnX = 300 + Math.random() * 4200; // Between 300 and 4500
        newBottle.x = spawnX;
        newBottle.y = 350; // Fixed Y position on ground (same as original bottles)
        
        // Update originalX for parallax effect
        newBottle.originalX = newBottle.x;
        
        // Add to bottles array
        this.world.level.bottles.push(newBottle);
        
        console.log(`[ItemCollector] New bottle spawned at x: ${Math.round(newBottle.x)}, y: ${Math.round(newBottle.y)} (ground level)`);
    }

    /**
     * Spawn a new coin at a random location (for future use)
     */
    spawnNewCoin() {
        // Create new coin
        let newCoin = new Coin();
        
        // Random spawn location - spread across the level
        let spawnX = 300 + Math.random() * 4075; // Same as original coin spawn range
        newCoin.x = spawnX;
        newCoin.y = 50 + Math.random() * 200; // Random height
        
        // Set base positions for oscillation
        newCoin.baseX = newCoin.x;
        newCoin.baseY = newCoin.y;
        
        // Random vertical movement
        newCoin.hasVerticalMovement = Math.random() < 0.5;
        newCoin.oscillationTime = Math.random() * Math.PI * 2;
        
        // Add to coins array
        this.world.level.coins.push(newCoin);
        
        console.log(`[ItemCollector] New coin spawned at x: ${Math.round(newCoin.x)}, y: ${Math.round(newCoin.y)}`);
    }

    /**
     * Respawn all coins when all have been collected
     */
    respawnAllCoins() {
        // Clear existing coins (should be empty anyway)
        this.world.level.coins = [];
        
        // Reset coin counter
        this.world.character.coins = 0;
        this.world.coinScore = 0;
        
        // Spawn the original amount of coins (same as level start)
        let coinsToSpawn = this.world.totalCoinsInLevel;
        
        for (let i = 0; i < coinsToSpawn; i++) {
            this.spawnNewCoin();
        }
        
        // Update UI to reflect the reset
        this.world.coinstatusbar.setPercentage(0);
        this.world.coinstatusbar.setCoinCount(0);
        
        // Play respawn sound
        this.world.audioManager.playCoinRespawnSound();
        
        console.log(`[ItemCollector] All ${coinsToSpawn} coins respawned! Coin counter reset.`);
    }

    /**
     * Get collection statistics
     */
    getCollectionStats() {
        return {
            coins: {
                collected: this.world.character.coins,
                total: this.world.totalCoinsInLevel,
                percentage: Math.round((this.world.character.coins / this.world.totalCoinsInLevel) * 100)
            },
            bottles: {
                collected: this.world.character.bottles,
                max: 10,
                percentage: Math.round((this.world.character.bottles / 10) * 100)
            },
            totalScore: this.world.totalScore
        };
    }

    /**
     * Check if all collectibles are gathered
     */
    isLevelComplete() {
        return this.world.character.coins === this.world.totalCoinsInLevel;
    }

    /**
     * Reset collection stats (for new level)
     */
    reset() {
        this.world.coinScore = 0;
        this.world.character.coins = 0;
        this.world.character.bottles = 0;
        this.world.totalScore = 0;
        
        // Update UI
        this.world.coinstatusbar.setPercentage(0);
        this.world.coinstatusbar.setCoinCount(0);
        this.world.bottlestatusbar.setBottleCount(0);
        
        console.log('Collection stats reset');
    }

    /**
     * Configure item respawn settings
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('[ItemCollector] Configuration updated:', this.config);
    }

    /**
     * Enable/disable bottle respawning
     */
    setBottleRespawn(enabled) {
        this.config.enableBottleRespawn = enabled;
        console.log(`[ItemCollector] Bottle respawn ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Enable/disable coin respawning
     */
    setCoinRespawn(enabled) {
        this.config.enableCoinRespawn = enabled;
        console.log(`[ItemCollector] Coin respawn ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
