/**
 * Manages collection of coins and bottles with respawn functionality
 */
class ItemCollector {
    /**
     * Initialize item collector with world reference
     * @param {World} world - Game world instance
     */
    constructor(world) {
        this.world = world;
        this.initializeConfiguration();
    }

    /**
     * Initialize collector configuration
     */
    initializeConfiguration() {
        this.config = {
            enableBottleRespawn: true,
            enableCoinRespawn: false,
            maxBottlesInLevel: 25,
            maxCoinsInLevel: 30
        };
    }

    /**
     * Collect a coin and update game state
     * @param {Coin} coin - Coin object
     * @param {number} index - Index in coins array
     */
    collectCoin(coin, index) {
        this.removeCoinFromLevel(index);
        this.updateCoinScores();
        this.updateCoinStatusBar();
        this.playCoinSound();
        this.logCoinCollection();
        this.checkCoinCollectionComplete();
    }

    /**
     * Remove coin from level
     * @param {number} index - Index in coins array
     */
    removeCoinFromLevel(index) {
        this.world.level.coins.splice(index, 1);
    }

    /**
     * Update coin-related scores
     */
    updateCoinScores() {
        this.world.coinScore += 1;
        this.world.character.coins += 1;
        this.world.totalScore += 5;
    }

    /**
     * Update coin status bar display
     */
    updateCoinStatusBar() {
        let collectedPercentage = (this.world.character.coins / this.world.totalCoinsInLevel) * 100;
        this.world.coinstatusbar.setPercentage(collectedPercentage);
        this.world.coinstatusbar.setCoinCount(this.world.character.coins);
    }

    /**
     * Play coin collection sound
     */
    playCoinSound() {
        this.world.audioManager.playRandomCoinCollectingSound();
    }

    /**
     * Log coin collection information
     */
    logCoinCollection() {
        let collectedPercentage = (this.world.character.coins / this.world.totalCoinsInLevel) * 100;
    }

    /**
     * Check if all coins collected and handle completion
     */
    checkCoinCollectionComplete() {
        if (this.world.character.coins === this.world.totalCoinsInLevel) {
            this.handleAllCoinsCollected();
        }
    }

    /**
     * Handle completion of coin collection
     */
    handleAllCoinsCollected() {
        this.world.character.energy = 100;
        this.world.statusbar.setPercentage(this.world.character.energy);
        setTimeout(() => {
            this.respawnAllCoins();
        }, 1000);
    }

    /**
     * Collect a bottle
     */
    collectBottle(bottle, index) {
        if (this.world.character.bottles >= 10) {
            return;
        }
        this.world.level.bottles.splice(index, 1);
        this.world.character.bottles += 1; 
        this.world.bottlestatusbar.setBottleCount(this.world.character.bottles);
        this.world.audioManager.playRandomBottleCollectingSound();
        if (this.config.enableBottleRespawn && this.world.level.bottles.length < this.config.maxBottlesInLevel) {
            this.spawnNewBottle();
        }
    }

    /**
     * Spawn a new bottle at a random location
     */
    spawnNewBottle() {
        let newBottle = new Bottle();
        let spawnX = 300 + Math.random() * 4200; 
        newBottle.x = spawnX;
        newBottle.y = 350; 
        newBottle.originalX = newBottle.x;
        this.world.level.bottles.push(newBottle);
    }

    /**
     * Spawn a new coin at a random location (for future use)
     */
    spawnNewCoin() {
        let newCoin = new Coin();
        let spawnX = 300 + Math.random() * 4075;
        newCoin.x = spawnX;
        newCoin.y = 50 + Math.random() * 200;
        newCoin.baseX = newCoin.x;
        newCoin.baseY = newCoin.y;
        newCoin.hasVerticalMovement = Math.random() < 0.5;
        newCoin.oscillationTime = Math.random() * Math.PI * 2;
        this.world.level.coins.push(newCoin);
    }

    /**
     * Respawn all coins when all have been collected
     */
    respawnAllCoins() {
        this.world.level.coins = [];
        this.world.character.coins = 0;
        this.world.coinScore = 0;
        let coinsToSpawn = this.world.totalCoinsInLevel;
        for (let i = 0; i < coinsToSpawn; i++) {
            this.spawnNewCoin();
        }
        this.world.coinstatusbar.setPercentage(0);
        this.world.coinstatusbar.setCoinCount(0);
        this.world.audioManager.playCoinRespawnSound();
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
        this.world.coinstatusbar.setPercentage(0);
        this.world.coinstatusbar.setCoinCount(0);
        this.world.bottlestatusbar.setBottleCount(0);
    }

    /**
     * Configure item respawn settings
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Enable/disable bottle respawning
     */
    setBottleRespawn(enabled) {
        this.config.enableBottleRespawn = enabled;
    }

    /**
     * Enable/disable coin respawning
     */
    setCoinRespawn(enabled) {
        this.config.enableCoinRespawn = enabled;
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
