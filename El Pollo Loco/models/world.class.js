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
    throwableObjects = [new ThrowableObject()]; // Beispiel für ein Wurfobjekt

    // Konstruktor, der beim Erstellen einer neuen World-Instanz aufgerufen wird
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.coinScore = 0;
        
        // Speichere die ursprüngliche Anzahl der Coins im Level
        this.totalCoinsInLevel = this.level.coins.length;
        
        this.statusbar = new StatusBar();
        this.coinstatusbar = new CoinStatusBar();
        this.bottlestatusbar = new BottleStatusBar();
        
        this.character = new Character();
        
        this.draw();
        this.setWorld();
        this.checkCollisions();
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
    checkCollisions() {
        setInterval(() => {
            // Überprüft Kollisionen mit Gegnern
            this.level.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit(5);
                    console.log("Kollision mit Gegner! Energie:", this.character.energy);
                    this.statusbar.setPercentage(this.character.energy);
                }
            });
            
            // Überprüft Kollision mit Endboss
            this.level.endboss.forEach(endboss => {
                if (this.character.isColliding(endboss)) {
                    this.character.hit(10);
                    console.log("Kollision mit Endboss! Energie:", this.character.energy);
                }
            });
            
            // Überprüft Kollisionen mit Münzen
            this.level.coins.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    this.collectCoin(coin, index);
                }
            });
        }, 100);
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

    // Zeichnet alle Objekte auf das Canvas
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.endboss);

        this.ctx.translate(-this.camera_x, 0);

        // Alle drei StatusBars zeichnen
        this.addToMap(this.statusbar);
        this.addToMap(this.coinstatusbar);
        this.addToMap(this.bottlestatusbar);

        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);

        this.addObjectsToMap(this.throwableObjects);

        // Speichert den Kontext von 'this', um ihn in der Callback-Funktion zu verwenden
        let self = this;
        // Ruft die draw-Methode erneut auf, um eine Animationsschleife zu erzeugen
        requestAnimationFrame(function() {
            self.draw();
        });
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