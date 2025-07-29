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
        this.bottleCollisionManager = new BottleCollisionManager(world);
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
        this.bottleCollisionManager.checkBottleProjectileCollisions();
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
        let isFalling = this.world.character.speedY < 0;
        let endbossTopOffset = 140; 
        let collisionMargin = 15; 
        let horizontalPadding = 10; 
        let characterBottom = this.world.character.y + this.world.character.height;
        let characterCenterX = this.world.character.x + this.world.character.width / 2;
        let endbossJumpTop = endboss.y + endbossTopOffset; 
        let endbossLeft = endboss.x + horizontalPadding;
        let endbossRight = endboss.x + endboss.width - horizontalPadding;
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
        endboss.attack();
        this.world.character.addComboKill();
        this.world.character.speedY = 15;
        this.world.character.playRandomChickenAttackSound();
    }
    /**
     * Handle character being hit by enemy
     */
    handleCharacterHitByEnemy(damage) {
        this.world.character.hit(damage);
        this.world.statusbar.setPercentage(this.world.character.energy);
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
        this.world.statusbar.setPercentage(this.world.character.energy);
    }
}
