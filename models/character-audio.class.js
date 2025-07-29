/**
 * Character Audio Manager
 * Handles all audio effects for the character
 */
class CharacterAudioManager {
    constructor(character) {
        this.character = character;
        this.isWalkingSoundPlaying = false;
    }

    /**
     * Plays a random jump sound effect
     */
    playRandomJumpSound() {
        if (this.character.world && this.character.world.audioManager) {
            this.character.world.audioManager.playRandomJumpSound();
        }
    }

    /**
     * Plays a random chicken attack sound effect
     */
    playRandomChickenAttackSound() {
        if (this.character.world && this.character.world.audioManager) {
            this.character.world.audioManager.playRandomChickenAttackSound();
        }
    }

    /**
     * Plays a random hurt sound effect
     */
    playRandomHurtSound() {
        if (this.character.world && this.character.world.audioManager) {
            this.character.world.audioManager.playRandomHurtSound();
        }
    }

    /**
     * Plays walking sound if character is on ground and not already playing
     */
    playWalkingSound() {
        if (!this.character.isAboveGround() && !this.isWalkingSoundPlaying) {
            if (this.character.world && this.character.world.audioManager) {
                this.character.world.audioManager.playWalkingSound();
            }
            this.isWalkingSoundPlaying = true;
        }
        
        if (this.character.isAboveGround() && this.isWalkingSoundPlaying) {
            this.stopWalkingSound();
        }
    }

    /**
     * Stops walking sound if currently playing
     */
    stopWalkingSound() {
        if (this.isWalkingSoundPlaying) {
            if (this.character.world && this.character.world.audioManager) {
                this.character.world.audioManager.stopWalkingSound();
            }
            this.isWalkingSoundPlaying = false;
        }
    }
}
