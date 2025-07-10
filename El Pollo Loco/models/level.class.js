class Level {
    enemies;
    endboss;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    cacti;
    level_end_x = 4400; // Doubled from 2200 to 4400

    constructor(enemies, endboss, clouds, backgroundObjects, coins, bottles, cacti) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.cacti = cacti;
    }
}