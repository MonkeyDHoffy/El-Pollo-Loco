/**
 * Manages collision detection between bottles and targets
 */
class BottleCollisionManager {
    /**
     * Creates a new bottle collision manager
     * @param {World} world - Reference to game world
     */
    constructor(world) {
        this.world = world;
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
            this.world.totalScore += 15;
        } else if (enemy instanceof Chicken) {
            this.world.totalScore += 25;
        }
        this.world.endlessMode.onEnemyKilled(enemy);
        setTimeout(() => {
            let enemyIdx = this.world.level.enemies.indexOf(enemy);
            if (enemyIdx > -1) {
                this.world.level.enemies.splice(enemyIdx, 1);
            }
        }, 500);
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
        this.createHitEffects(endboss, damage);
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
        this.world.totalScore += 60;
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
        if (damage >= 50) {
            this.world.particleManager.createDustParticles(x, y + 50, 20);
        }
    }
}
