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
    totalScore = 0;
    coinScore = 0;
    
    // Manager Systems
    audioManager;
    collisionManager;
    uiManager;
    itemCollector;
    endlessMode;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        
        this.totalCoinsInLevel = this.level.coins.length;
        this.totalBottlesInLevel = this.level.bottles.length;
        
        // Initialize UI components
        this.statusbar = new StatusBar();
        this.coinstatusbar = new CoinStatusBar();
        this.bottlestatusbar = new BottleStatusBar();
        
        // Initialize character
        this.character = new Character();
        this.bottlestatusbar.setBottleCount(this.character.bottles);
        
        // Initialize Manager Systems
        this.audioManager = new AudioManager();
        this.collisionManager = new CollisionManager(this);
        this.uiManager = new UIManager(this);
        this.itemCollector = new ItemCollector(this);
        this.waveManager = new WaveManager(this);
        this.endlessMode = new EndlessMode(this);
        
        // Start the game
        this.draw();
        this.setWorld();
        this.runWorld();
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
                this.collisionManager.checkAllCollisions();
                this.checkThrowObjects();
                this.character.updateWarning();
                this.endlessMode.update();
                this.waveManager.update(); // Update wave system
            }
        }, 10);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.audioManager.pauseBackgroundMusic();
        } else {
            this.audioManager.resumeBackgroundMusic();
        }
        
        console.log('Game paused:', this.isPaused);
    }

    /**
     * Enable or disable endless mode
     */
    toggleEndlessMode() {
        this.endlessMode.setActive(!this.endlessMode.isActive);
        return this.endlessMode.isActive;
    }

    /**
     * Get endless mode status for debugging
     */
    getEndlessModeStatus() {
        return this.endlessMode.getStatus();
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
            
            this.audioManager.playThrowSound();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.updateBackgroundPosition();

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.cacti);
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
        
        // Use UIManager for all UI drawing
        this.uiManager.drawUI();

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

        this.level.cacti.forEach(cactus => {
            if (cactus.updatePosition) {
                cactus.updatePosition(this.character.x);
            }
        });
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