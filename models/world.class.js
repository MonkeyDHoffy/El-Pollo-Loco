/**
 * Main game world class that manages all game objects, systems, and game loop
 */
class World {
    character;
    level;
    enemies;
    clouds;
    backgroundObjects;
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
    audioManager;
    collisionManager;
    uiManager;
    itemCollector;
    endlessMode;
    particleManager;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeLevel();
        this.initializeUI();
        this.initializeCharacter();
        this.initializeManagers();
        this.startGame();
    }

    /**
     * Initializes level properties and objects
     */
    initializeLevel() {
        this.level = level1;
        this.enemies = level1.enemies;
        this.clouds = level1.clouds;
        this.backgroundObjects = level1.backgroundObjects;   
        this.totalCoinsInLevel = this.level.coins.length;
        this.totalBottlesInLevel = this.level.bottles.length;
    }

    /**
     * Initializes UI components
     */
    initializeUI() {
        this.statusbar = new StatusBar();
        this.coinstatusbar = new CoinStatusBar();
        this.bottlestatusbar = new BottleStatusBar();
    }

    /**
     * Initializes character and sets initial bottle count
     */
    initializeCharacter() {
        this.character = new Character();
        this.bottlestatusbar.setBottleCount(this.character.bottles);
    }

    /**
     * Initializes all manager systems
     */
    initializeManagers() {
        this.audioManager = new AudioManager();
        this.collisionManager = new CollisionManager(this);
        this.uiManager = new UIManager(this);
        this.itemCollector = new ItemCollector(this);
        this.waveManager = new WaveManager(this);
        this.endlessMode = new EndlessMode(this);
        this.particleManager = new ParticleManager(this);
    }

    /**
     * Starts the game by setting up world references and running the game loop
     */
    startGame() {
        this.draw();
        this.setWorld();
        this.runWorld();
    }

    /**
     * Sets world reference for all game objects
     */
    setWorld() {
        this.character.world = this;
        this.setWorldForEnemies();
        this.setWorldForClouds();
        this.setWorldForBackgrounds();
        this.setWorldForEndbosses();
    }

    /**
     * Sets world reference for all enemies
     */
    setWorldForEnemies() {
        this.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * Sets world reference for all clouds
     */
    setWorldForClouds() {
        this.clouds.forEach(cloud => cloud.world = this);
    }

    /**
     * Sets world reference for all background objects
     */
    setWorldForBackgrounds() {
        this.backgroundObjects.forEach(bgo => bgo.world = this);
    }

    /**
     * Sets world reference for all endbosses with health scaling
     */
    setWorldForEndbosses() {
        this.level.endboss.forEach(boss => {
            if (boss.setWorld) {
                boss.setWorld(this);
            } else {
                boss.world = this;
            }
        });
    }

    /**
     * Main game loop that runs all game systems
     */
    runWorld() {
        setInterval(() => {
            if (!this.isPaused) {
                this.checkGameOver();
                this.updateGameSystems();
            }
        }, 1000 / 60);
    }

    /**
     * Checks if character is dead and triggers game over
     */
    checkGameOver() {
        if (this.character.isDead() && !gameOver.isGameOverActive()) {
            console.log('[World] Character died, triggering game over');
            gameOver.startGameOver(this.totalScore);
            this.isPaused = true;
            return;
        }
    }

    /**
     * Updates all game systems in the main loop
     */
    updateGameSystems() {
        this.collisionManager.checkAllCollisions();
        this.checkThrowObjects();
        this.character.updateWarning();
        this.endlessMode.update();
        this.waveManager.update();
        this.particleManager.update();
    }

    /**
     * Toggles game pause state and background music
     */
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
     * Toggles endless mode on/off
     * @returns {boolean} New endless mode state
     */
    toggleEndlessMode() {
        this.endlessMode.setActive(!this.endlessMode.isActive);
        return this.endlessMode.isActive;
    }

    /**
     * Gets endless mode status for debugging
    /**
     * Gets endless mode status for debugging
     * @returns {Object} Endless mode status object
     */
    getEndlessModeStatus() {
        return this.endlessMode.getStatus();
    }

    /**
     * Checks for spacebar input and handles bottle throwing
     */
    checkThrowObjects() {
        if(this.keyboard.SPACE) {
            this.handleBottleThrow();
        }
    }

    /**
     * Handles the bottle throwing logic with validation and timing
     */
    handleBottleThrow() {
        if (!this.character.canThrowBottle()) {
            return;
        }
        if (!this.checkThrowTiming()) {
            return;
        }     
        if (!this.character.useBottle()) {
            return;
        }
        this.createAndThrowBottle();
    }

    /**
     * Checks if enough time has passed since last throw
     * @returns {boolean} True if can throw, false otherwise
     */
    checkThrowTiming() {
        let currentTime = Date.now();
        if (currentTime - this.lastThrowTime < 300) {
            return false;
        }
        this.lastThrowTime = currentTime;
        return true;
    }

    /**
     * Creates and throws a bottle in the appropriate direction
     */
    createAndThrowBottle() {
        this.bottlestatusbar.setBottleCount(this.character.bottles);  
        let { throwX, throwDirection } = this.calculateThrowPosition();
        let throwY = this.character.y + 100;
        let bottle = new ThrowableObject(throwX, throwY, throwDirection);
        this.throwableObjects.push(bottle);  
        this.audioManager.playThrowSound();
    }

    /**
     * Calculates throw position and direction based on character orientation
     * @returns {Object} Object containing throwX and throwDirection
     */
    calculateThrowPosition() {
        if (this.character.otherDirection) {
            return {
                throwX: this.character.x - 10,
                throwDirection: -1
            };
        } else {
            return {
                throwX: this.character.x + 50,
                throwDirection: 1
            };
        }
    }

    /**
     * Main drawing function that renders all game objects and UI
     */
    draw() {
        this.clearCanvas();
        this.ctx.translate(this.camera_x, 0);
        
        this.updateBackgroundPosition();
        this.drawWorldObjects();
        this.drawParticles();
        this.drawLevelMarker();
        
        this.ctx.translate(-this.camera_x, 0);
        this.drawUI();
        this.drawMobileControls();
        
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Clears the canvas for the next frame
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws all world objects in the correct order
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.cacti);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
    }

    /**
     * Draws particle effects
     */
    drawParticles() {
        this.particleManager.draw();
    }

    /**
     * Draws level marker if available
     */
    drawLevelMarker() {
        if (this.level.levelMarker) {
            this.addToMap(this.level.levelMarker);
        }
    }

    /**
     * Draws all UI elements
     */
    drawUI() {
        this.addToMap(this.statusbar);
        this.addToMap(this.coinstatusbar);
        this.addToMap(this.bottlestatusbar);
        this.uiManager.drawUI();
    }

    /**
     * Draws mobile controls if available
     */
    drawMobileControls() {
        if (window.mobileControls) {
            window.mobileControls.draw();
        }      
        if (gameOver && gameOver.isGameOverActive()) {
            gameOver.draw();
        }
    }

    /**
     * Updates background object positions for parallax effect
     */
    updateBackgroundPosition() {
        this.updateBackgroundObjects();
    }

    /**
     * Updates background object positions
     */
    updateBackgroundObjects() {
        this.level.backgroundObjects.forEach(bgObject => {
            if (bgObject.updatePosition) {
                bgObject.updatePosition(this.character.x);
            }
        });
    }

    /**
     * Adds an array of objects to the map
     * @param {Array} objects - Array of objects to add to map
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Flips an image horizontally for directional rendering
     * @param {Object} mobject - Object to flip
     */
    flipImage(mobject) {
        this.ctx.save();
        this.ctx.translate(mobject.width, 0);
        this.ctx.scale(-1, 1);
        mobject.x = -mobject.x;
    }

    /**
     * Restores image to original orientation
     * @param {Object} mobject - Object to restore
     */
    flipImageBack(mobject) {
        mobject.x = -mobject.x;
        this.ctx.restore();
    }

    /**
     * Adds a single object to the map with directional handling
     * @param {Object} mobject - Object to add to map
     */
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
