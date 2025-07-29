/**
 * Character Combo Manager
 * Handles combo tracking and grace period management
 */
class CharacterComboManager {
    constructor(character) {
        this.character = character;
        this.combo = 0;
        this.lastGroundTouch = 0;
        this.wasOnGround = true;
        this.lastComboValue = 0;
        this.comboEndTime = 0;
        this.comboGracePeriod = 2000;
    }

    /**
     * Check if character is on ground and update combo tracking
     */
    updateComboTracking() {
        let isCurrentlyOnGround = !this.character.isAboveGround();
        if (isCurrentlyOnGround && !this.wasOnGround) {
            if (this.combo > 0) {
                this.lastComboValue = this.combo;
                this.comboEndTime = Date.now();
                this.combo = 0;
            }
            this.lastGroundTouch = Date.now();
        }
        this.wasOnGround = isCurrentlyOnGround;
    }

    /**
     * Add to combo when killing chicken while airborne
     */
    addComboKill() {
        if (this.character.isAboveGround()) {
            this.combo++;
            if (this.combo > 1) {
                this.character.world.audioManager.playRandomChickenAttackSound();
            }
        } else {
            this.combo = 0;
        }
    }

    /**
     * Reset combo (called when taking damage or other events)
     */
    resetCombo() {
        if (this.combo > 0) {
            this.lastComboValue = this.combo;
            this.comboEndTime = Date.now();
            this.combo = 0;
        }
    }

    /**
     * Get the effective combo value for damage calculation
     * Returns current combo or last combo if within grace period
     * @returns {number} Effective combo value
     */
    getEffectiveCombo() {
        if (this.combo > 0) {
            return this.combo;
        }
        let currentTime = Date.now();
        let timeSinceComboEnded = currentTime - this.comboEndTime;
        if (this.lastComboValue > 0 && timeSinceComboEnded <= this.comboGracePeriod) {
            return this.lastComboValue;
        }
        return 0;
    }
}
