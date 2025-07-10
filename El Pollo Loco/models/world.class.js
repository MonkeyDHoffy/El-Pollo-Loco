class World {
    character;
    level = level1;
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusbar;
    coinstatusbar;
    bottlestatusbar;
    totalCoinsInLevel; 
    totalBottlesInLevel;
    throwableObjects = [];
    isPaused = false;
    lastThrowTime = 0;
    backgroundMusic;

    coinCollectingSounds = [
        'audio/sounds/coincollecting(1).mp3',
        'audio/sounds/coincollecting(1).wav',
        'audio/sounds/coincollecting(2).wav',
        'audio/sounds/coincollecting(3).wav'
    ];

    bottleCollectingSounds = [
        'audio/sounds/collect1.wav',
        'audio/sounds/collect2.mp3',
        'audio/sounds/collectbottle.wav'
    ];

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.coinScore = 0;
        
        this.totalCoinsInLevel = this.level.coins.length;
        this.totalBottlesInLevel = this.level.bottles.length;
        
        this.statusbar = new StatusBar();
        this.coinstatusbar = new CoinStatusBar();
        this.bottlestatusbar = new BottleStatusBar();
        
        this.character = new Character();
        
        this.bottlestatusbar.setBottleCount(this.character.bottles);
        
        this.initBackgroundMusic();
        
        this.draw();
        this.setWorld();
        this.runWorld();
    }

    initBackgroundMusic() {
        this.backgroundMusic = new Audio('audio/sounds/music/chicken_background.wav');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        
        setTimeout(() => {
            this.startBackgroundMusic();
        }, 1000);
    }

    startBackgroundMusic() {
        this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }

    pauseBackgroundMusic() {
        this.backgroundMusic.pause();
    }

    resumeBackgroundMusic() {
        this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }

    stopBackgroundMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    setWorld() {
        this.character.world = this;
        this.enemies.forEach(enemy => enemy.world = this);
        this.clouds.forEach(cloud => cloud.world = this);
        this.backgroundObjects.forEach(bgo => bgo.world = this);
        this.level.endboss.forEach(boss => boss.world = this);
    }

    runWorld() {
        setInterval(() => {
            if (!this.isPaused) {
                this.checkCollisions();
                this.checkThrowObjects();
                this.character.updateWarning();
            }
        }, 10);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseBackgroundMusic();
        } else {
            this.resumeBackgroundMusic();
        }
        
        console.log('Game paused:', this.isPaused);
    }

    checkThrowObjects() {
        if(this.keyboard.SPACE) {
            if (!this.character.canThrowBottle()) {
                console.log("No bottles available to throw!");
                return;
            }
            
            let currentTime = Date.now();
            if (currentTime - this.lastThrowTime < 300) {
                return;
            }
            this.lastThrowTime = currentTime;
            
            if (!this.character.useBottle()) {
                return;
            }
            
            this.bottlestatusbar.setBottleCount(this.character.bottles);
            
            let throwX, throwDirection;
            if (this.character.otherDirection) {
                throwX = this.character.x - 10;
                throwDirection = -1;
            } else {
                throwX = this.character.x + 50;
                throwDirection = 1;
            }
            let throwY = this.character.y + 100;
            
            let bottle = new ThrowableObject(throwX, throwY, throwDirection);
            this.throwableObjects.push(bottle);
            
            let throwSound = new Audio('audio/sounds/throw1.wav');
            throwSound.play().catch(e => console.log('Throw sound failed:', e));
        }
    }

    checkCollisions() {
        this.checkCharacterEnemyCollisions();
        this.checkCharacterEndbossCollisions();
        this.checkCharacterCoinCollisions();
        this.checkCharacterBottleCollisions();
        this.checkBottleProjectileCollisions();
    }

    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                if (this.isCharacterJumpingOnEnemy(enemy)) {
                    this.handleCharacterKillsEnemy(enemy);
                } else {
                    this.handleCharacterHitByEnemy(10);
                }
            }
        });
    }

    checkCharacterEndbossCollisions() {
        this.level.endboss.forEach(endboss => {
            if (this.character.isColliding(endboss) && !this.character.isHurt()) {
                this.handleCharacterHitByEnemy(20);
            }
        });
    }

    checkCharacterCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin, index);
            }
        });
    }

    checkCharacterBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(bottle, index);
            }
        });
    }

    checkBottleProjectileCollisions() {
        this.throwableObjects.forEach((throwableObject, throwableIndex) => {
            if (throwableObject.hasHit) return;
            
            this.checkBottleHitsEnemies(throwableObject);
            this.checkBottleHitsEndboss(throwableObject);
        });
    }

    isCharacterJumpingOnEnemy(enemy) {
        return this.character.speedY < 0 && 
               this.character.y + this.character.height - 30 < enemy.y + 20;
    }

    handleCharacterKillsEnemy(enemy) {
        console.log("huhn besiegt");
        this.character.playRandomChickenAttackSound();
        enemy.die();
        this.character.speedY = 15;
        setTimeout(() => {
            const chickenIndex = this.level.enemies.indexOf(enemy);
            if (chickenIndex > -1) {
                this.level.enemies.splice(chickenIndex, 1);
            }
        }, 500);
    }

    handleCharacterHitByEnemy(damage) {
        this.character.hit(damage);
        console.log("Kollision mit Gegner! Energie:", this.character.energy);
        this.statusbar.setPercentage(this.character.energy);
    }

    checkBottleHitsEnemies(throwableObject) {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            if (throwableObject.isColliding(enemy) && !throwableObject.hasHit) {
                this.handleBottleHitsEnemy(throwableObject, enemy);
            }
        });
    }

    checkBottleHitsEndboss(throwableObject) {
        this.level.endboss.forEach((endboss, endbossIndex) => {
            if (throwableObject.isColliding(endboss) && !endboss.isDead && !throwableObject.hasHit) {
                this.handleBottleHitsEndboss(throwableObject, endboss);
            }
        });
    }

    handleBottleHitsEnemy(throwableObject, enemy) {
        throwableObject.hasHit = true;
        throwableObject.splash();
        enemy.die();
        this.playGlassBreakSound();
        setTimeout(() => {
            const enemyIdx = this.level.enemies.indexOf(enemy);
            if (enemyIdx > -1) {
                this.level.enemies.splice(enemyIdx, 1);
            }
        }, 500);
        console.log("Gegner von Flasche getroffen!");
    }

    handleBottleHitsEndboss(throwableObject, endboss) {
        throwableObject.hasHit = true;
        throwableObject.splash();
        endboss.hit(10);
        this.playGlassBreakSound();
        console.log("Endboss von Flasche getroffen!");
        
        if (endboss.isDead) {
            setTimeout(() => {
                const bossIdx = this.level.endboss.indexOf(endboss);
                if (bossIdx > -1) {
                    this.level.endboss.splice(bossIdx, 1);
                }
            }, 1000);
        }
    }

    playGlassBreakSound() {
        let glassBreakSound = new Audio('audio/sounds/glas_breaks.wav');
        glassBreakSound.play().catch(e => console.log('Glass break sound failed:', e));
    }

    collectCoin(coin, index) {
        this.level.coins.splice(index, 1);
        this.coinScore += 1;
        this.character.coins += 1; 
        let collectedPercentage = (this.character.coins / this.totalCoinsInLevel) * 100;    
        this.coinstatusbar.setPercentage(collectedPercentage);  
        
        this.playRandomCoinCollectingSound();
        
        console.log('Münze gesammelt! Score:', this.coinScore);
        console.log(`Coins gesammelt: ${this.character.coins}/${this.totalCoinsInLevel} (${Math.round(collectedPercentage)}%)`);
        
        if (this.character.coins === this.totalCoinsInLevel) {
            this.character.energy = 100;
            this.statusbar.setPercentage(this.character.energy);
            console.log('Alle Münzen gesammelt! Energie vollständig wiederhergestellt!');
        }
    }

    collectBottle(bottle, index) {
        if (this.character.bottles >= 10) {
            console.log('Maximum bottles reached! Cannot collect more.');
            return;
        }
        
        this.level.bottles.splice(index, 1);
        this.character.bottles += 1; 
        
        this.bottlestatusbar.setBottleCount(this.character.bottles);
        
        this.playRandomBottleCollectingSound();
        
        console.log('Flasche gesammelt! Bottles:', this.character.bottles);
        console.log(`Bottles gesammelt: ${this.character.bottles}/10`);
    }

    playRandomCoinCollectingSound() {
        let randomIndex = Math.floor(Math.random() * this.coinCollectingSounds.length);
        let randomSound = new Audio(this.coinCollectingSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Coin collecting audio playback failed:', error);
        });
    }

    playRandomBottleCollectingSound() {
        let randomIndex = Math.floor(Math.random() * this.bottleCollectingSounds.length);
        let randomSound = new Audio(this.bottleCollectingSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Bottle collecting audio playback failed:', error);
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.updateBackgroundPosition();

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        
        if (this.level.levelMarker) {
            this.addToMap(this.level.levelMarker);
        }

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusbar);
        this.addToMap(this.coinstatusbar);
        this.addToMap(this.bottlestatusbar);

        if (this.isPaused) {
            this.drawPauseOverlay();
        }

        if (this.character.showWrongDirectionWarning) {
            this.drawWrongDirectionWarning();
        }

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    updateBackgroundPosition() {
        this.level.backgroundObjects.forEach(bgObject => {
            if (bgObject.updatePosition) {
                bgObject.updatePosition(this.character.x);
            }
        });
        
        this.level.bottles.forEach(bottle => {
            if (bottle.updatePosition) {
                bottle.updatePosition(this.character.x);
            }
        });
    }

    drawPauseOverlay() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = Math.min(this.canvas.width / 15, 48) + 'px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.restore();
    }

    drawWrongDirectionWarning() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.ctx.font = '32px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 3;
        
        let warningText = 'WRONG DIRECTION!';
        let textX = this.canvas.width / 2;
        let textY = this.canvas.height / 2 - 100;
        
        this.ctx.strokeText(warningText, textX, textY);
        this.ctx.fillText(warningText, textX, textY);
        
        this.ctx.restore();
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }
    
    flipImage(mobject) {
        this.ctx.save();
        this.ctx.translate(mobject.width, 0);
        this.ctx.scale(-1, 1);
        mobject.x = -mobject.x;
    }

    flipImageBack(mobject) {
        mobject.x = -mobject.x;
        this.ctx.restore();
    }

    addToMap(mobject) {
        if(mobject.otherDirection) {
            this.flipImage(mobject);
        }

        mobject.draw(this.ctx);
        mobject.drawFrame(this.ctx);
      
        if(mobject.otherDirection) {
            this.flipImageBack(mobject);
        }
    }
}