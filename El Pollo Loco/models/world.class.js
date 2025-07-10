// Definiert die Klasse World (Welt)
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
        // Removed coincollecting(4).wav as it's not found
    ];

    bottleCollectingSounds = [
        'audio/sounds/collect1.wav',
        'audio/sounds/collect2.mp3',
        'audio/sounds/collectbottle.wav'
    ];

    // Konstruktor, der beim Erstellen einer neuen World-Instanz aufgerufen wird
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.coinScore = 0;
        
        // Speichere die ursprüngliche Anzahl der Coins im Level
        this.totalCoinsInLevel = this.level.coins.length;
        this.totalBottlesInLevel = this.level.bottles.length;
        
        this.statusbar = new StatusBar();
        this.coinstatusbar = new CoinStatusBar();
        this.bottlestatusbar = new BottleStatusBar();
        
        this.character = new Character();
        
        // Initialize bottle count display based on character's existing bottles
        this.bottlestatusbar.setBottleCount(this.character.bottles);
        
        // Initialize background music
        this.initBackgroundMusic();
        
        this.draw();
        this.setWorld();
        this.runWorld();
    }

    // Initialize and start background music
    initBackgroundMusic() {
        this.backgroundMusic = new Audio('audio/sounds/music/chicken_background.wav');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        
        // Start music automatically
        setTimeout(() => {
            this.startBackgroundMusic();
        }, 1000); // Small delay to ensure page is fully loaded
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

    // Setzt die Referenz auf die aktuelle Welt in allen relevanten Objekten
    setWorld() {
        this.character.world = this;
        this.enemies.forEach(enemy => enemy.world = this);
        this.clouds.forEach(cloud => cloud.world = this);
        this.backgroundObjects.forEach(bgo => bgo.world = this);
        this.level.endboss.forEach(boss => boss.world = this);
    }

    // Überprüft regelmäßig Kollisionen zwischen dem Charakter und anderen Objekten
    runWorld() {
        setInterval(() => {
            if (!this.isPaused) {
                this.checkCollisions();
                this.checkThrowObjects();
                this.character.updateWarning();
            }
        }, 10);
    }

    // Pausiert oder setzt das Spiel fort
    togglePause() {
        this.isPaused = !this.isPaused;
        
        // Control background music based on pause state
        if (this.isPaused) {
            this.pauseBackgroundMusic();
        } else {
            this.resumeBackgroundMusic();
        }
        
        console.log('Game paused:', this.isPaused);
    }

    checkThrowObjects() { 
        if(this.keyboard.SPACE) {
            // Check if character has bottles to throw
            if (!this.character.canThrowBottle()) {
                console.log("No bottles available to throw!");
                return;
            }
            
            // Verhindere Spam-Werfen (nur alle 300ms)
            let currentTime = Date.now();
            if (currentTime - this.lastThrowTime < 300) {
                return;
            }
            this.lastThrowTime = currentTime;
            
            // Consume a bottle
            if (!this.character.useBottle()) {
                return; // Failed to use bottle
            }
            
            // Update bottle status bar and count display (now based on max 10 bottles)
            this.bottlestatusbar.setBottleCount(this.character.bottles);
            
            // Position und Richtung basierend auf Character-Richtung
            let throwX, throwDirection;
            if (this.character.otherDirection) {
                // Character schaut nach links - werfe nach links
                throwX = this.character.x - 10; // Links vom Character
                throwDirection = -1;
            } else {
                // Character schaut nach rechts - werfe nach rechts
                throwX = this.character.x + 50; // Rechts vom Character
                throwDirection = 1;
            }
            let throwY = this.character.y + 100; // Mittlere Höhe des Characters
            
            let bottle = new ThrowableObject(throwX, throwY, throwDirection);
            this.throwableObjects.push(bottle);
            
            // Play throw sound
            let throwSound = new Audio('audio/sounds/throw1.wav');
            throwSound.play().catch(e => console.log('Throw sound failed:', e));
        }
    }

    checkCollisions() { // Überprüft Kollisionen mit Gegnern
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy) && !this.character.isHurt()) { // Added invincibility check
                // Check if character is jumping on chicken
                // Character must be falling AND above the chicken
                if (this.character.speedY < 0 && 
                    this.character.y + this.character.height - 30 < enemy.y + 20) {
                    console.log("huhn besiegt");
                    this.character.playRandomChickenAttackSound();
                    // Kill the chicken and show death animation
                    enemy.die();
                    // Make character bounce slightly
                    this.character.speedY = 15;
                    // Remove chicken after death animation
                    setTimeout(() => {
                        const chickenIndex = this.level.enemies.indexOf(enemy);
                        if (chickenIndex > -1) {
                            this.level.enemies.splice(chickenIndex, 1);
                        }
                    }, 500); // Show death animation for 500ms
                } else {
                    // Normal collision - character takes damage (10 instead of 1)
                    this.character.hit(10);
                    console.log("Kollision mit Gegner! Energie:", this.character.energy);
                    this.statusbar.setPercentage(this.character.energy);
                }
            }
        });

        // Überprüft Kollision mit Endboss
        this.level.endboss.forEach(endboss => {
            if (this.character.isColliding(endboss) && !this.character.isHurt()) { // Added invincibility check
                this.character.hit(20); // Changed from 3 to 20
                console.log("Kollision mit Endboss! Energie:", this.character.energy);
                this.statusbar.setPercentage(this.character.energy);
            }
        });

        // Überprüft Kollisionen mit Münzen
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin, index);
            }
        });

        // Überprüft Kollisionen mit Flaschen
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(bottle, index);
            }
        });

        // Überprüft Kollisionen zwischen geworfenen Flaschen und Gegnern
        this.throwableObjects.forEach((throwableObject, throwableIndex) => {
            // Skip if bottle already hit something
            if (throwableObject.hasHit) return;
            
            // Kollision mit normalen Gegnern
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (throwableObject.isColliding(enemy) && !throwableObject.hasHit) {
                    throwableObject.hasHit = true; // Mark as hit
                    throwableObject.splash();
                    enemy.die();
                    // Play glass break sound
                    let glassBreakSound = new Audio('audio/sounds/glas_breaks.wav');
                    glassBreakSound.play().catch(e => console.log('Glass break sound failed:', e));
                    setTimeout(() => {
                        const enemyIdx = this.level.enemies.indexOf(enemy);
                        if (enemyIdx > -1) {
                            this.level.enemies.splice(enemyIdx, 1);
                        }
                    }, 500);
                    console.log("Gegner von Flasche getroffen!");
                }
            });

            // Kollision mit Endboss
            this.level.endboss.forEach((endboss, endbossIndex) => {
                if (throwableObject.isColliding(endboss) && !endboss.isDead && !throwableObject.hasHit) {
                    throwableObject.hasHit = true; // Mark as hit
                    throwableObject.splash();
                    endboss.hit(10);
                    // Play glass break sound
                    let glassBreakSound = new Audio('audio/sounds/glas_breaks.wav');
                    glassBreakSound.play().catch(e => console.log('Glass break sound failed:', e));
                    console.log("Endboss von Flasche getroffen!");
                    
                    // Remove endboss if dead
                    if (endboss.isDead) {
                        setTimeout(() => {
                            const bossIdx = this.level.endboss.indexOf(endboss);
                            if (bossIdx > -1) {
                                this.level.endboss.splice(bossIdx, 1);
                            }
                        }, 1000);
                    }
                }
            });
        });
    }

    /**
     * Sammelt eine Münze ein und entfernt sie aus dem Spiel
     * @param {Coin} coin - Die eingesammelte Münze
     * @param {number} index - Der Index der Münze im coins-Array
     */
    collectCoin(coin, index) {
        // Münze aus dem Array entfernen
        this.level.coins.splice(index, 1);
        // Score erhöhen
        this.coinScore += 1;
        // Coins in der Character-Klasse erhöhen
        this.character.coins += 1; 
        // Berechne Prozentsatz basierend auf ursprünglicher Anzahl
        let collectedPercentage = (this.character.coins / this.totalCoinsInLevel) * 100;    
        this.coinstatusbar.setPercentage(collectedPercentage);  
        
        // Play random coin collecting sound
        this.playRandomCoinCollectingSound();
        
        console.log('Münze gesammelt! Score:', this.coinScore);
        console.log(`Coins gesammelt: ${this.character.coins}/${this.totalCoinsInLevel} (${Math.round(collectedPercentage)}%)`);
        
        // Prüfe ob alle Münzen gesammelt wurden
        if (this.character.coins === this.totalCoinsInLevel) {
            // Stelle volle Energie wieder her
            this.character.energy = 100;
            this.statusbar.setPercentage(this.character.energy);
            console.log('Alle Münzen gesammelt! Energie vollständig wiederhergestellt!');
        }
    }

    /**
     * Sammelt eine Flasche ein und entfernt sie aus dem Spiel
     * @param {Bottle} bottle - Die eingesammelte Flasche
     * @param {number} index - Der Index der Flasche im bottles-Array
     */
    collectBottle(bottle, index) {
        // Check if character already has maximum bottles
        if (this.character.bottles >= 10) {
            console.log('Maximum bottles reached! Cannot collect more.');
            return; // Don't collect if at maximum
        }
        
        // Flasche aus dem Array entfernen
        this.level.bottles.splice(index, 1);
        // Bottles in der Character-Klasse erhöhen
        this.character.bottles += 1; 
        
        // Update bottle status bar and count display (now based on max 10 bottles)
        this.bottlestatusbar.setBottleCount(this.character.bottles);
        
        // Play random bottle collecting sound
        this.playRandomBottleCollectingSound();
        
        console.log('Flasche gesammelt! Bottles:', this.character.bottles);
        console.log(`Bottles gesammelt: ${this.character.bottles}/10`);
    }

    // Play random coin collecting sound
    playRandomCoinCollectingSound() {
        let randomIndex = Math.floor(Math.random() * this.coinCollectingSounds.length);
        let randomSound = new Audio(this.coinCollectingSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Coin collecting audio playback failed:', error);
        });
    }

    // Play random bottle collecting sound
    playRandomBottleCollectingSound() {
        let randomIndex = Math.floor(Math.random() * this.bottleCollectingSounds.length);
        let randomSound = new Audio(this.bottleCollectingSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Bottle collecting audio playback failed:', error);
        });
    }

    // Zeichnet alle Objekte auf das Canvas
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        // Update parallax for background objects before drawing
        this.updateBackgroundPosition();

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
         this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
       
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        // Draw level marker
        if (this.level.levelMarker) {
            this.addToMap(this.level.levelMarker);
        }

        this.ctx.translate(-this.camera_x, 0);

        // Alle drei StatusBars zeichnen
        this.addToMap(this.statusbar);
        this.addToMap(this.coinstatusbar);
        this.addToMap(this.bottlestatusbar);

        // Pause-Overlay anzeigen
        if (this.isPaused) {
            this.drawPauseOverlay();
        }

        // Wrong direction warning anzeigen
        if (this.character.showWrongDirectionWarning) {
            this.drawWrongDirectionWarning();
        }

        // Speichert den Kontext von 'this', um ihn in der Callback-Funktion zu verwenden
        let self = this;
        // Ruft die draw-Methode erneut auf, um eine Animationsschleife zu erzeugen
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    // Update parallax effect for background objects
    updateBackgroundPosition() {
        this.level.backgroundObjects.forEach(bgObject => {
            if (bgObject.updatePosition) {
                bgObject.updatePosition(this.character.x);
            }
        });
        
        // Update bottles position with same parallax as first layer
        this.level.bottles.forEach(bottle => {
            if (bottle.updatePosition) {
                bottle.updatePosition(this.character.x);
            }
        });
    }

    // Zeichnet das Pause-Overlay
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

    // Zeichnet die "Wrong Direction" Warnung
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

    // Fügt mehrere Objekte zur Karte hinzu, indem für jedes Objekt addToMap aufgerufen wird
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }
    
    // Spiegelt das Bild für Richtungsänderung
    flipImage(mobject) {
        this.ctx.save();
        this.ctx.translate(mobject.width, 0);
        this.ctx.scale(-1, 1);
        mobject.x = -mobject.x;
    }

    // Stellt das Bild nach dem Spiegeln wieder her
    flipImageBack(mobject) {
        mobject.x = -mobject.x;
        this.ctx.restore();
    }

    // Fügt ein einzelnes Objekt zur Karte hinzu
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