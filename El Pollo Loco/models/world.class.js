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
    lastThrowTime = 0; // Füge diese Eigenschaft zur World-Klasse hinzu

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
        
        this.draw();
        this.setWorld();
        this.runWorld();
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
        console.log('Game paused:', this.isPaused);
    }

    checkThrowObjects() { 
        if(this.keyboard.SPACE) {
            // Verhindere Spam-Werfen (nur alle 300ms)
            let currentTime = Date.now();
            if (currentTime - this.lastThrowTime < 300) {
                return;
            }
            this.lastThrowTime = currentTime;
            
            // Einfache, präzise Berechnung
            let throwX = this.character.x + (this.character.width / 2);
            let throwY = this.character.y + (this.character.height / 2);
            
            // Anpassung für Wurfrichtung
            if (this.character.otherDirection) {
                throwX -= 30; // Links vom Charakter
            } else {
                throwX += 30; // Rechts vom Charakter
            }
            
            let bottle = new ThrowableObject(throwX, throwY);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() { // Überprüft Kollisionen mit Gegnern
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy)) {
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
                    // Normal collision - character takes damage
                    this.character.hit(1);
                    console.log("Kollision mit Gegner! Energie:", this.character.energy);
                    this.statusbar.setPercentage(this.character.energy);
                }
            }
        });

        // Überprüft Kollision mit Endboss
        this.level.endboss.forEach(endboss => {
            if (this.character.isColliding(endboss)) {
                this.character.hit(3);
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
        console.log('Münze gesammelt! Score:', this.coinScore);
        console.log(`Coins gesammelt: ${this.character.coins}/${this.totalCoinsInLevel} (${Math.round(collectedPercentage)}%)`);
    }

    /**
     * Sammelt eine Flasche ein und entfernt sie aus dem Spiel
     * @param {Bottle} bottle - Die eingesammelte Flasche
     * @param {number} index - Der Index der Flasche im bottles-Array
     */
    collectBottle(bottle, index) {
        // Flasche aus dem Array entfernen
        this.level.bottles.splice(index, 1);
        // Bottles in der Character-Klasse erhöhen
        this.character.bottles += 1; 
        // Berechne Prozentsatz basierend auf ursprünglicher Anzahl
        let collectedPercentage = (this.character.bottles / this.totalBottlesInLevel) * 100;    
        this.bottlestatusbar.setPercentage(collectedPercentage);  
        console.log('Flasche gesammelt! Bottles:', this.character.bottles);
        console.log(`Bottles gesammelt: ${this.character.bottles}/${this.totalBottlesInLevel} (${Math.round(collectedPercentage)}%)`);
    }

    // Zeichnet alle Objekte auf das Canvas
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.endboss);
        
        // Draw level marker
        if (this.level.levelMarker) {
            this.addToMap(this.level.levelMarker);
        }

        this.ctx.translate(-this.camera_x, 0);

        // Alle drei StatusBars zeichnen
        this.addToMap(this.statusbar);
        this.addToMap(this.coinstatusbar);
        this.addToMap(this.bottlestatusbar);

        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);

        this.addObjectsToMap(this.throwableObjects);

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