/**
 * Character Collision Manager
 * Handles all collision detection for the character
 */
class CharacterCollisionManager {
    constructor(character) {
        this.character = character;
    }

    /**
     * Checks collision with another object
     * @param {Object} mobject - Object to check collision with
     * @returns {boolean} True if collision detected
     */
    isColliding(mobject) {
        let charBounds = this.getCharacterBounds();
        
        if (mobject instanceof Coin || mobject instanceof Bottle) {
            return this.checkItemCollision(mobject, charBounds);
        }

        return this.checkStandardCollision(mobject, charBounds);
    }

    /**
     * Gets character collision bounds
     * @returns {Object} Character bounds object
     */
    getCharacterBounds() {
        return {
            left: this.character.x + 20,
            right: this.character.x + this.character.width - 30,
            top: this.character.y + 90,
            bottom: this.character.y + this.character.height - 10
        };
    }

    /**
     * Checks collision with collectible items (coins/bottles)
     * @param {Object} mobject - Item to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkItemCollision(mobject, charBounds) {
        if (mobject instanceof Coin) {
            return this.checkCoinCollision(mobject, charBounds);
        } else if (mobject instanceof Bottle) {
            return this.checkBottleCollision(mobject, charBounds);
        }
    }

    /**
     * Checks collision with coin
     * @param {Coin} coin - Coin to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkCoinCollision(coin, charBounds) {
        return (coin.x + 60) + (coin.width - 120) > charBounds.left &&
               (coin.x + 60) < charBounds.right &&
               (coin.y + 60) + (coin.height - 120) > charBounds.top &&
               (coin.y + 60) < charBounds.bottom;
    }

    /**
     * Checks collision with bottle
     * @param {Bottle} bottle - Bottle to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkBottleCollision(bottle, charBounds) {
        return (bottle.x + 15) + (bottle.width - 30) > charBounds.left &&
               (bottle.x + 15) < charBounds.right &&
               (bottle.y + 15) + (bottle.height - 30) > charBounds.top &&
               (bottle.y + 15) < charBounds.bottom;
    }

    /**
     * Checks standard collision with other objects
     * @param {Object} mobject - Object to check collision with
     * @param {Object} charBounds - Character bounds
     * @returns {boolean} True if collision detected
     */
    checkStandardCollision(mobject, charBounds) {
        return charBounds.left + (charBounds.right - charBounds.left) > mobject.x &&
               charBounds.left < mobject.x + mobject.width &&
               charBounds.top + (charBounds.bottom - charBounds.top) > mobject.y &&
               charBounds.top < mobject.y + mobject.height;
    }
}
