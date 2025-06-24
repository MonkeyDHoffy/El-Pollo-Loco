class Level {
    enemies;
    endboss;
    clouds;
    backgroundObjects;
    coins;
    level_end_x = 2200; // Setzt die Endposition des Levels


    constructor(enemies, endboss, clouds, backgroundObjects, coins) {
        this.enemies = enemies; // Setzt die Gegner für das Level
        this.endboss = endboss; // Setzt den Endboss für das Level
        this.clouds = clouds; // Setzt die Wolken für das Level
        this.backgroundObjects = backgroundObjects; // Setzt die Hintergrundobjekte für das Level
        this.coins = coins; // Setzt die Münzen für das Level
    }
}