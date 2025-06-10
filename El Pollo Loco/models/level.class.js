class Level {
    enemies;
    clouds;
    backgroundObjects;
    endboss;
    level_end_x = 2100; // Setzt die Endposition des Levels


    constructor(enemies,endboss, clouds, backgroundObjects) {
       
        this.enemies = enemies; // Setzt die Gegner für das Level
         this.endboss = endboss; // Setzt den Endboss für das Level
        this.clouds = clouds; // Setzt die Wolken für das Level
        this.backgroundObjects = backgroundObjects; // Setzt die Hintergrundobjekte für das Level
      
    }
}