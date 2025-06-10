// Definiert die Klasse World (Welt)
class World{

    // Variablen für das Canvas-Element und den Zeichenkontext


// Erstellt eine neue Instanz des Charakters
character = new Character();

level = level1; // Hier wird angenommen, dass level1 eine Instanz der Klasse level ist, die die Level-Daten enthält;
// Erstellt ein Array mit drei Gegnern (Hühner)
enemies = level1.enemies; // Hier wird angenommen, dass level1 eine Instanz der Klasse level ist, die die Gegner enthält;

// Erstellt ein Array mit drei Wolken
clouds = level1.clouds; // Hier wird angenommen, dass level1 eine Instanz der Klasse level ist, die die Wolken enthält;

// Erstellt ein Array mit Hintergrundobjekten (verschiedene Ebenen)
backgroundObjects = level1.backgroundObjects; // Hier wird angenommen, dass level

canvas;
ctx;
keyboard; // Tastatursteuerung, die extern definiert sein muss
camera_x = 0; // X-Position der Kamera, die die Ansicht verschiebt


// Konstruktor, der beim Erstellen einer neuen World-Instanz aufgerufen wird
constructor(canvas){
    this.ctx = canvas.getContext("2d"); // Holt sich den 2D-Kontext des Canvas
    this.canvas = canvas; // Speichert das Canvas-Element
    this.keyboard = keyboard; // Speichert die Tastatursteuerung (muss extern definiert sein)
    this.draw(); // Startet die Zeichenroutine
    this.setWorld(); // Setzt die Referenz auf die Welt in allen Objekten
}

// Setzt die Referenz auf die aktuelle Welt in allen relevanten Objekten
setWorld(){
    this.character.world = this; // Setzt die Welt für den Charakter
    this.enemies.forEach(enemy => enemy.world = this); // Setzt die Welt für jeden Gegner
    this.clouds.forEach(cloud => cloud.world = this); // Setzt die Welt für jede Wolke
    this.backgroundObjects.forEach(bgo => bgo.world = this); // Setzt die Welt für jedes Hintergrundobjekt
}

// Zeichnet alle Objekte auf das Canvas
draw(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Löscht das Canvas vor jedem Frame

    this.ctx.translate(this.camera_x, 0); // Verschiebt den Ursprung des Koordinatensystems, um die Kamera-Position zu berücksichtigen. die 0 ist die y-Position, da wir nur horizontal scrollen
    // Fügt die Hintergrundobjekte zur Karte hinzu
    this.addObjectsToMap(this.level.backgroundObjects); 
    // Fügt den Charakter zur Karte hinzu
    this.addToMap(this.character); 
    // Fügt die Wolken zur Karte hinzu
    this.addObjectsToMap(this.level.clouds); 
    // Fügt die Gegner zur Karte hinzu
    this.addObjectsToMap(this.level.enemies); 

    this.addToMap(this.level.endboss); // Fügt den Endboss zur Karte hinzu

    this.ctx.translate(-this.camera_x, 0); // Setzt den Ursprung des Koordinatensystems zurück, um die Kamera-Position zu berücksichtigen

    // Speichert den Kontext von 'this', um ihn in der Callback-Funktion zu verwenden
    let self = this;
    // Ruft die draw-Methode erneut auf, um eine Animationsschleife zu erzeugen
    requestAnimationFrame(function() {
        self.draw();
    }); 
}

// Fügt mehrere Objekte zur Karte hinzu, indem für jedes Objekt addToMap aufgerufen wird
addObjectsToMap(objects){
    objects.forEach(object => {
        this.addToMap(object);
    });
}

// Zeichnet ein einzelnes Objekt auf das Canvas
addToMap(mobject){
    if(mobject.otherDirection) {
        this.flipImage(mobject); // Spiegelt das Bild, wenn otherDirection wahr ist
    }
    this.ctx.drawImage(mobject.img, mobject.x, mobject.y, mobject.width, mobject.height);
    if(mobject.otherDirection) {
  this.flipImageBack(mobject); // Spiegelt das Bild zurück, um den ursprünglichen Zustand wiederherzustellen
    }
}

flipImage(mobject) {
    this.ctx.save(); // Speichert den aktuellen Zustand des Kontextes
        this.ctx.translate(mobject.width, 0); // Verschiebt den Ursprung des Koordinatensystems nach rechts um die Breite des Objekts
        this.ctx.scale(-1, 1); // Spiegelt das Koordinatensystem horizontal
        mobject.x = -mobject.x;// Passt die x-Position an, um die Spiegelung zu berücksichtigen

}

flipImageBack(mobject) {
      mobject.x = -mobject.x;// Stellt die x-Position nach der Spiegelung wieder her
        this.ctx.restore(); // Stellt den vorherigen Zustand des Kontextes wieder her
}
}