/**
 * Represents a game level containing all game objects and entities
 */
class Level {
    enemies;
    endboss;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    cacti;
    level_end_x = 4400;

    /**
     * Creates a new level with all game objects
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} endboss - Array of endboss objects
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} coins - Array of coin objects
     * @param {Array} bottles - Array of bottle objects
     * @param {Array} cacti - Array of cactus objects
     */
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