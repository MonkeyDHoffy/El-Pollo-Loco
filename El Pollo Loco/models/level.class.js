class Level {
    enemies;
    endboss;
    clouds;
    backgroundObjects;
    coins;
    level_end_x = 2200;

    constructor(enemies, endboss, clouds, backgroundObjects, coins) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}