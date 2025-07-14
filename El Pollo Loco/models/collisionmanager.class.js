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
                        // Get scaled damage from wave manager
                        let enemyDamage = this.world.waveManager ? 
                            this.world.waveManager.getScaledEnemyDamage() : 10;
                        this.handleCharacterHitByEnemy(enemyDamage);
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
            if (!this.world.character.isHurt()) {
                // Check for jump collision first (independent of general collision)
                if (this.isCharacterJumpingOnEndboss(endboss)) {
                    // Character is jumping on endboss - no damage but catapult effect
                    this.handleCharacterBounceOffEndboss(endboss);
                } else if (this.world.character.isColliding(endboss)) {
                    // Normal collision - only deal damage if endboss is not dead or dying
                    if (!endboss.isDead && !endboss.isDying) {
                        // Only deal damage if character is on ground (not airborne)
                        if (!this.world.character.isAboveGround()) {
                            // Trigger attack animation before dealing damage
                            endboss.attack();
                            
                            // Get scaled damage from wave manager
                            let endbossDamage = this.world.waveManager ? 
                                this.world.waveManager.getScaledEndbossDamage() : 20;
                            this.handleCharacterHitByEnemy(endbossDamage);
                        }
                    }
                    // If endboss is dead/dying or character is airborne, no damage dealt
                }
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
     * Handle bottle hitting an endboss
     */
    handleBottleHitsEndboss(throwableObject, endboss) {
        throwableObject.hasHit = true;
        throwableObject.splash();
        
        // Calculate combo damage using effective combo (includes grace period)
        let baseDamage = 10;
        let effectiveCombo = this.world.character.getEffectiveCombo();
        let comboMultiplier = Math.max(1, effectiveCombo); // Minimum 1x damage
        let totalDamage = baseDamage * comboMultiplier;
        
        endboss.hit(totalDamage);
        this.world.audioManager.playGlassBreakSound();
        
        // Enhanced logging with combo information
        if (effectiveCombo > 0) {
            console.log(`Endboss von Flasche getroffen! Combo Damage: ${baseDamage} x ${comboMultiplier} = ${totalDamage}`);
            
            // Create combo particles for visual feedback on high combos
            if (effectiveCombo >= 3) {
                let endbossX = endboss.x + endboss.width / 2;
                let endbossY = endboss.y + endboss.height / 2;
                this.world.particleManager.createComboParticles(endbossX, endbossY, effectiveCombo);
            }
            
            // Show floating damage number for high damage
            if (totalDamage > 20) {
                this.showFloatingDamage(endboss.x + endboss.width / 2, endboss.y, totalDamage);
            }
        } else {
            console.log(`Endboss von Flasche getroffen! Base Damage: ${totalDamage}`);
        }
        
        if (endboss.isDead) {
            this.world.totalScore += 50;
            
            // Notify endless mode about endboss kill
            this.world.endlessMode.onEndbossKilled(endboss);
            
            setTimeout(() => {
                let bossIdx = this.world.level.endboss.indexOf(endboss);
                if (bossIdx > -1) {
                    this.world.level.endboss.splice(bossIdx, 1);
                }
            }, 1000);
        }
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
