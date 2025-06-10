class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 700; // Setzt die Endposition des Levels

    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies; // Setzt die Gegner für das Level
        this.clouds = clouds; // Setzt die Wolken für das Level
        this.backgroundObjects = backgroundObjects; // Setzt die Hintergrundobjekte für das Level
    }
}