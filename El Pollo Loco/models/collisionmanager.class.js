/**
 * Manages all collision detection and handling in the game
 */
class CollisionManager {
    /**
     * Creates a new collision manager
     * @param {World} world - Reference to game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks all types of collisions in the game
     */
    checkAllCollisions() {
        this.checkCharacterEnemyCollisions();
        this.checkCharacterEndbossCollisions();
        this.checkCharacterCoinCollisions();
        this.checkCharacterBottleCollisions();
        this.checkCharacterCactusCollisions();
        this.checkBottleProjectileCollisions();
    }

    /**
     * Checks collisions between character and regular enemies
     */
    checkCharacterEnemyCollisions() {
        this.world.level.enemies.forEach((enemy, index) => {
            if (this.world.character.isColliding(enemy) && !this.world.character.isHurt()) {
                this.handleCharacterEnemyCollision(enemy);
            }
        });
    }

    /**
     * Handles collision between character and enemy
     * @param {Object} enemy - Enemy object that collided
     */
    handleCharacterEnemyCollision(enemy) {
        if (this.isCharacterJumpingOnEnemy(enemy)) {
            this.handleCharacterKillsEnemy(enemy);
        } else if (!this.world.character.isAboveGround()) {
            let enemyDamage = this.getScaledEnemyDamage();
            this.handleCharacterHitByEnemy(enemyDamage);
        }
    }

    /**
     * Gets scaled enemy damage based on current wave
     * @returns {number} Scaled damage amount
     */
    getScaledEnemyDamage() {
        return this.world.waveManager ? 
            this.world.waveManager.getScaledEnemyDamage() : 10;
    }

    /**
     * Checks collisions between character and endbosses
     */
    checkCharacterEndbossCollisions() {
        this.world.level.endboss.forEach(endboss => {
            if (!this.world.character.isHurt()) {
                this.handleCharacterEndbossInteraction(endboss);
            }
        });
    }

    /**
     * Handles all character-endboss interactions
     * @param {Endboss} endboss - Endboss to check interaction with
     */
    handleCharacterEndbossInteraction(endboss) {
        if (this.isCharacterJumpingOnEndboss(endboss)) {
            this.handleCharacterBounceOffEndboss(endboss);
        } else if (this.shouldEndbossDealDamage(endboss)) {
            this.handleEndbossAttack(endboss);
        }
    }

    /**
     * Checks if endboss should deal damage to character
     * @param {Endboss} endboss - Endboss to check
     * @returns {boolean} True if endboss should deal damage
     */
    shouldEndbossDealDamage(endboss) {
        return this.world.character.isColliding(endboss) && 
               !endboss.isDead && 
               !endboss.isDying && 
               !this.world.character.isAboveGround();
    }

    /**
     * Handles endboss attack on character
     * @param {Endboss} endboss - Attacking endboss
     */
    handleEndbossAttack(endboss) {
        endboss.attack();
        let endbossDamage = this.getScaledEndbossDamage();
        this.handleCharacterHitByEnemy(endbossDamage);
    }

    /**
     * Gets scaled endboss damage based on current wave
     * @returns {number} Scaled damage amount
     */
    getScaledEndbossDamage() {
        return this.world.waveManager ? 
            this.world.waveManager.getScaledEndbossDamage() : 20;
    }

    /**
     * Checks collisions between character and coins
     */
    checkCharacterCoinCollisions() {
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin)) {
                this.world.itemCollector.collectCoin(coin, index);
            }
        });
    }

    /**
     * Checks collisions between character and bottles
     */
    checkCharacterBottleCollisions() {
        this.world.level.bottles.forEach((bottle, index) => {
            if (this.world.character.isColliding(bottle)) {
                this.world.itemCollector.collectBottle(bottle, index);
            }
        });
    }

    /**
     * Checks collisions between character and cacti
     */
    checkCharacterCactusCollisions() {
        this.world.level.cacti.forEach(cactus => {
            if (this.isCharacterCollidingWithCactus(cactus) && !this.world.character.isHurt()) {
                this.handleCharacterHitByCactus(cactus);
            }
        });
    }

    /**
     * Checks precise collision between character and cactus
     * @param {Cactus} cactus - Cactus to check collision with
     * @returns {boolean} True if collision detected
     */
    isCharacterCollidingWithCactus(cactus) {
        let charBounds = this.getCharacterBounds();
        let cactusBounds = this.getCactusBounds(cactus);
        
        return charBounds.right > cactusBounds.left &&
               charBounds.left < cactusBounds.right &&
               charBounds.bottom > cactusBounds.top &&
               charBounds.top < cactusBounds.bottom;
    }

    /**
     * Gets character collision bounds
     * @returns {Object} Character bounds
     */
    getCharacterBounds() {
        return {
            left: this.world.character.x + 20,
            right: this.world.character.x + this.world.character.width - 30,
            top: this.world.character.y + 90,
            bottom: this.world.character.y + this.world.character.height - 10
        };
    }

    /**
     * Gets cactus collision bounds
     * @param {Cactus} cactus - Cactus object
     * @returns {Object} Cactus bounds
     */
    getCactusBounds(cactus) {
        return {
            left: cactus.x + 60,
            right: cactus.x + cactus.width - 51,
            top: cactus.y + 50,
            bottom: cactus.y + cactus.height - 30
        };
    }

    /**
     * Check if character is jumping on enemy
     */
    isCharacterJumpingOnEnemy(enemy) {
        return this.world.character.speedY < 0 && 
               this.world.character.y + this.world.character.height - 30 < enemy.y + 20;
    }

    /**
     * Check if character is jumping on endboss (more precise detection)
     * 
     * ANPASSBARE PARAMETER FÜR KOLLISIONSBOX:
     * 1. endbossTopOffset: Wie weit in den Endboss hinein die Kollision startet (aktuell: 80px)
     * 2. collisionMargin: Vertikaler Bereich über dem Endboss für Sprungerkennnung (aktuell: 15px)  
     * 3. horizontalPadding: Horizontaler Abstand vom Endboss-Rand (aktuell: 10px)
     */
    isCharacterJumpingOnEndboss(endboss) {
        // Character must be falling (negative speedY)
        let isFalling = this.world.character.speedY < 0;
        
        // PARAMETER 1: Vertikaler Offset in den Endboss hinein
        let endbossTopOffset = 140; // HIER ANPASSEN: Höher = Kollision startet tiefer im Endboss
        
        // PARAMETER 2: Kollisionsspielraum über dem Endboss  
        let collisionMargin = 15; // HIER ANPASSEN: Kleiner = Character muss näher sein
        
        // PARAMETER 3: Horizontaler Puffer
        let horizontalPadding = 10; // HIER ANPASSEN: Kleiner = schmalere Kollisionsbox
        
        // Calculate precise collision boundaries for jump detection
        let characterBottom = this.world.character.y + this.world.character.height;
        let characterCenterX = this.world.character.x + this.world.character.width / 2;
        
        let endbossJumpTop = endboss.y + endbossTopOffset; 
        let endbossLeft = endboss.x + horizontalPadding;
        let endbossRight = endboss.x + endboss.width - horizontalPadding;
        
        // Check if character is in the jump zone
        let isInJumpZoneVertically = characterBottom >= (endbossJumpTop - collisionMargin) && 
                                     characterBottom <= (endbossJumpTop + collisionMargin);
        let isInJumpZoneHorizontally = characterCenterX >= endbossLeft && characterCenterX <= endbossRight;
        
        return isFalling && isInJumpZoneVertically && isInJumpZoneHorizontally;
    }

    /**
     * Handles character killing an enemy by jumping on it
     * @param {Object} enemy - Enemy that was killed
     */
    handleCharacterKillsEnemy(enemy) {
        console.log("huhn besiegt");
        
        this.applyKillEffects(enemy);
        this.updateScoreForKill(enemy);
        this.scheduleEnemyRemoval(enemy);
    }

    /**
     * Applies visual and audio effects for enemy kill
     * @param {Object} enemy - Enemy that was killed
     */
    applyKillEffects(enemy) {
        this.world.character.addComboKill();
        this.createKillParticles(enemy);
        this.world.character.playRandomChickenAttackSound();
        enemy.die();
        this.world.character.speedY = 15;
    }

    /**
     * Creates dust particles at enemy position
     * @param {Object} enemy - Enemy to create particles for
     */
    createKillParticles(enemy) {
        let enemyCenterX = enemy.x + enemy.width / 2;
        let enemyBottomY = enemy.y + enemy.height;
        this.world.particleManager.createDustParticles(enemyCenterX, enemyBottomY, 12);
    }

    /**
     * Updates score based on enemy type
     * @param {Object} enemy - Enemy that was killed
     */
    updateScoreForKill(enemy) {
        if (enemy instanceof MiniChicken) {
            this.world.totalScore += 10;
        } else if (enemy instanceof Chicken) {
            this.world.totalScore += 20;
        }
        
        this.world.endlessMode.onEnemyKilled(enemy);
    }

    /**
     * Schedules enemy removal from game world
     * @param {Object} enemy - Enemy to remove
     */
    scheduleEnemyRemoval(enemy) {
        setTimeout(() => {
            let chickenIndex = this.world.level.enemies.indexOf(enemy);
            if (chickenIndex > -1) {
                this.world.level.enemies.splice(chickenIndex, 1);
            }
        }, 500);
    }

    /**
     * Handle character bouncing off endboss when jumping on it
     */
    handleCharacterBounceOffEndboss(endboss) {
        console.log("Character bounces off endboss");
        
        // Trigger attack animation when character jumps on endboss
        endboss.attack();
        
        // Add to combo for the bounce (even though no kill)
        this.world.character.addComboKill();
        
        // Create vertical catapult effect - same as when killing enemies
        this.world.character.speedY = 15;
        
        // Optional: Play a sound effect for bouncing
        this.world.character.playRandomChickenAttackSound();
    }

    /**
     * Handle character being hit by enemy
     */
    handleCharacterHitByEnemy(damage) {
        this.world.character.hit(damage);
        console.log("Kollision mit Gegner! Energie:", this.world.character.energy);
        this.world.statusbar.setPercentage(this.world.character.energy);
        
        // Create damage particles at character position
        let characterCenterX = this.world.character.x + this.world.character.width / 2;
        let characterCenterY = this.world.character.y + this.world.character.height / 2;
        this.world.particleManager.createDamageParticles(characterCenterX, characterCenterY, 8);
    }

    /**
     * Handle character being hit by cactus
     */
    handleCharacterHitByCactus(cactus) {
        this.world.character.hit(15);
        
        if (this.world.character.otherDirection) {
            this.world.character.x += 150;
        } else {
            this.world.character.x -= 150;
        }
        
        this.world.character.speedY = 15;
        
        console.log("Kollision mit Kaktus! Energie:", this.world.character.energy);
        this.world.statusbar.setPercentage(this.world.character.energy);
    }

    /**
     * Check collisions between throwable objects and targets
     */
    checkBottleProjectileCollisions() {
        this.world.throwableObjects.forEach((throwableObject, throwableIndex) => {
            if (throwableObject.hasHit) return;
            
            this.checkBottleHitsEnemies(throwableObject);
            this.checkBottleHitsEndboss(throwableObject);
        });
    }

    /**
     * Check if bottles hit enemies
     */
    checkBottleHitsEnemies(throwableObject) {
        this.world.level.enemies.forEach((enemy, enemyIndex) => {
            if (throwableObject.isColliding(enemy) && !throwableObject.hasHit) {
                this.handleBottleHitsEnemy(throwableObject, enemy);
            }
        });
    }

    /**
     * Check if bottles hit endboss
     */
    checkBottleHitsEndboss(throwableObject) {
        this.world.level.endboss.forEach((endboss, endbossIndex) => {
            if (throwableObject.isColliding(endboss) && !endboss.isDead && !throwableObject.hasHit) {
                this.handleBottleHitsEndboss(throwableObject, endboss);
            }
        });
    }

    /**
     * Handle bottle hitting an enemy
     */
    handleBottleHitsEnemy(throwableObject, enemy) {
        throwableObject.hasHit = true;
        throwableObject.splash();
        enemy.die();
        this.world.audioManager.playGlassBreakSound();
        
        if (enemy instanceof MiniChicken) {
            this.world.totalScore += 10;
        } else if (enemy instanceof Chicken) {
            this.world.totalScore += 20;
        }
        
        // Notify endless mode about enemy kill
        this.world.endlessMode.onEnemyKilled(enemy);
        
        setTimeout(() => {
            let enemyIdx = this.world.level.enemies.indexOf(enemy);
            if (enemyIdx > -1) {
                this.world.level.enemies.splice(enemyIdx, 1);
            }
        }, 500);
        console.log("Gegner von Flasche getroffen!");
    }

    /**
     * Handles bottle hitting an endboss with combo damage calculation
     * @param {ThrowableObject} throwableObject - Bottle that hit
     * @param {Endboss} endboss - Endboss that was hit
     */
    handleBottleHitsEndboss(throwableObject, endboss) {
        throwableObject.hasHit = true;
        throwableObject.splash();
        
        let damage = this.calculateComboDamage();
        this.applyDamageToEndboss(endboss, damage);
        this.handleEndbossHitEffects(endboss, damage);
        
        if (endboss.isDead) {
            this.handleEndbossDeath(endboss);
        }
    }

    /**
     * Calculates damage with combo multiplier
     * @returns {Object} Damage calculation details
     */
    calculateComboDamage() {
        let baseDamage = 10;
        let effectiveCombo = this.world.character.getEffectiveCombo();
        let comboMultiplier = Math.max(1, effectiveCombo);
        let totalDamage = baseDamage * comboMultiplier;
        
        return {
            base: baseDamage,
            combo: effectiveCombo,
            multiplier: comboMultiplier,
            total: totalDamage
        };
    }

    /**
     * Applies calculated damage to endboss
     * @param {Endboss} endboss - Endboss to damage
     * @param {Object} damage - Damage calculation object
     */
    applyDamageToEndboss(endboss, damage) {
        endboss.hit(damage.total);
        this.world.audioManager.playGlassBreakSound();
    }

    /**
     * Handles visual and audio effects for endboss hit
     * @param {Endboss} endboss - Endboss that was hit
     * @param {Object} damage - Damage calculation object
     */
    handleEndbossHitEffects(endboss, damage) {
        this.logDamageInfo(damage);
        this.createHitEffects(endboss, damage);
    }

    /**
     * Logs damage information to console
     * @param {Object} damage - Damage calculation object
     */
    logDamageInfo(damage) {
        if (damage.combo > 0) {
            console.log(`Endboss von Flasche getroffen! Combo Damage: ${damage.base} x ${damage.multiplier} = ${damage.total}`);
        } else {
            console.log(`Endboss von Flasche getroffen! Base Damage: ${damage.total}`);
        }
    }

    /**
     * Creates visual effects for high damage hits
     * @param {Endboss} endboss - Endboss that was hit
     * @param {Object} damage - Damage calculation object
     */
    createHitEffects(endboss, damage) {
        let endbossX = endboss.x + endboss.width / 2;
        let endbossY = endboss.y + endboss.height / 2;
        
        if (damage.combo >= 3) {
            this.world.particleManager.createComboParticles(endbossX, endbossY, damage.combo);
        }
        
        if (damage.total > 20) {
            this.showFloatingDamage(endbossX, endboss.y, damage.total);
        }
    }

    /**
     * Handles endboss death and cleanup
     * @param {Endboss} endboss - Endboss that died
     */
    handleEndbossDeath(endboss) {
        this.world.totalScore += 50;
        this.world.endlessMode.onEndbossKilled(endboss);
        
        setTimeout(() => {
            let bossIdx = this.world.level.endboss.indexOf(endboss);
            if (bossIdx > -1) {
                this.world.level.endboss.splice(bossIdx, 1);
            }
        }, 1000);
    }

    /**
     * Show floating damage number (visual feedback for high damage)
     */
    showFloatingDamage(x, y, damage) {
        // Simple console output for now - could be extended to visual floating text
        console.log(`💥 MASSIVE DAMAGE: ${damage}! 💥`);
        
        // Create extra visual particles for massive damage
        if (damage >= 50) {
            this.world.particleManager.createDustParticles(x, y + 50, 20); // Extra dust
        }
    }
}
