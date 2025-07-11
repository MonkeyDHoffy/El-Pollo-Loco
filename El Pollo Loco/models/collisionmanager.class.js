class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Main collision check function
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
     * Check collisions between character and enemies
     */
    checkCharacterEnemyCollisions() {
        this.world.level.enemies.forEach((enemy, index) => {
            if (this.world.character.isColliding(enemy) && !this.world.character.isHurt()) {
                if (this.isCharacterJumpingOnEnemy(enemy)) {
                    this.handleCharacterKillsEnemy(enemy);
                } else {
                    // Only take damage from enemies if character is on ground (not airborne)
                    if (!this.world.character.isAboveGround()) {
                        this.handleCharacterHitByEnemy(10);
                    }
                    // If character is airborne, no damage but also no kill - just collision
                }
            }
        });
    }

    /**
     * Check collisions between character and endbosses
     */
    checkCharacterEndbossCollisions() {
        this.world.level.endboss.forEach(endboss => {
            if (this.world.character.isColliding(endboss) && !this.world.character.isHurt()) {
                // Only deal damage if endboss is not dead or dying
                if (!endboss.isDead && !endboss.isDying) {
                    // Trigger attack animation before dealing damage
                    endboss.attack();
                    this.handleCharacterHitByEnemy(20);
                }
                // If endboss is dead/dying, no damage dealt
            }
        });
    }

    /**
     * Check collisions between character and coins
     */
    checkCharacterCoinCollisions() {
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin)) {
                this.world.itemCollector.collectCoin(coin, index);
            }
        });
    }

    /**
     * Check collisions between character and bottles
     */
    checkCharacterBottleCollisions() {
        this.world.level.bottles.forEach((bottle, index) => {
            if (this.world.character.isColliding(bottle)) {
                this.world.itemCollector.collectBottle(bottle, index);
            }
        });
    }

    /**
     * Check collisions between character and cacti
     */
    checkCharacterCactusCollisions() {
        this.world.level.cacti.forEach(cactus => {
            if (this.isCharacterCollidingWithCactus(cactus) && !this.world.character.isHurt()) {
                this.handleCharacterHitByCactus(cactus);
            }
        });
    }

    /**
     * Check if character is colliding with cactus (precise collision detection)
     */
    isCharacterCollidingWithCactus(cactus) {
        let charLeft = this.world.character.x + 20;
        let charRight = this.world.character.x + this.world.character.width - 30;
        let charTop = this.world.character.y + 90;
        let charBottom = this.world.character.y + this.world.character.height - 10;

        let cactusLeft = cactus.x + 60;
        let cactusRight = cactus.x + cactus.width - 51;
        let cactusTop = cactus.y + 50;
        let cactusBottom = cactus.y + cactus.height - 30;

        return charRight > cactusLeft &&
               charLeft < cactusRight &&
               charBottom > cactusTop &&
               charTop < cactusBottom;
    }

    /**
     * Check if character is jumping on enemy
     */
    isCharacterJumpingOnEnemy(enemy) {
        return this.world.character.speedY < 0 && 
               this.world.character.y + this.world.character.height - 30 < enemy.y + 20;
    }

    /**
     * Handle character killing an enemy
     */
    handleCharacterKillsEnemy(enemy) {
        console.log("huhn besiegt");
        
        // Add to combo if character is airborne
        this.world.character.addComboKill();
        
        // Create dust particles at enemy position
        let enemyCenterX = enemy.x + enemy.width / 2;
        let enemyBottomY = enemy.y + enemy.height; // Bottom of enemy (ground level)
        this.world.particleManager.createDustParticles(enemyCenterX, enemyBottomY, 12);
        
        this.world.character.playRandomChickenAttackSound();
        enemy.die();
        this.world.character.speedY = 15;
        
        if (enemy instanceof MiniChicken) {
            this.world.totalScore += 10;
        } else if (enemy instanceof Chicken) {
            this.world.totalScore += 20;
        }
        
        // Notify endless mode about enemy kill
        this.world.endlessMode.onEnemyKilled(enemy);
        
        setTimeout(() => {
            const chickenIndex = this.world.level.enemies.indexOf(enemy);
            if (chickenIndex > -1) {
                this.world.level.enemies.splice(chickenIndex, 1);
            }
        }, 500);
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
            const enemyIdx = this.world.level.enemies.indexOf(enemy);
            if (enemyIdx > -1) {
                this.world.level.enemies.splice(enemyIdx, 1);
            }
        }, 500);
        console.log("Gegner von Flasche getroffen!");
    }

    /**
     * Handle bottle hitting an endboss
     */
    handleBottleHitsEndboss(throwableObject, endboss) {
        throwableObject.hasHit = true;
        throwableObject.splash();
        endboss.hit(10);
        this.world.audioManager.playGlassBreakSound();
        console.log("Endboss von Flasche getroffen!");
        
        if (endboss.isDead) {
            this.world.totalScore += 50;
            
            // Notify endless mode about endboss kill
            this.world.endlessMode.onEndbossKilled(endboss);
            
            setTimeout(() => {
                const bossIdx = this.world.level.endboss.indexOf(endboss);
                if (bossIdx > -1) {
                    this.world.level.endboss.splice(bossIdx, 1);
                }
            }, 1000);
        }
    }
}
