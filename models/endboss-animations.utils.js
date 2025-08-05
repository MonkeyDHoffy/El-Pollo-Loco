/**
 * Animation utilities for Endboss
 * Contains all animation playback and frame management functions
 */

/**
 * Play alert animation exactly twice, frame by frame
 * @param {Endboss} endboss - Reference to Endboss instance
 */
function playAlertAnimationOnce(endboss) {
    endboss.alertAnimationTimer -= 1000 / 10;
    let timeElapsed = 800 - endboss.alertAnimationTimer;
    let frameIndex = Math.floor(timeElapsed / 100);
    if (frameIndex >= endboss.IMAGES_ALERT.length) {
        handleAlertCycle(endboss);
        frameIndex = endboss.IMAGES_ALERT.length - 1;
    }
    let path = endboss.IMAGES_ALERT[frameIndex];
    if (endboss.imageCache[path] && endboss.imageCache[path].complete) {
        endboss.img = endboss.imageCache[path];
    }
    if (frameIndex !== endboss.alertFrameIndex) {
        endboss.alertFrameIndex = frameIndex;
    }
}

/**
 * Handle alert animation cycle management
 * @param {Endboss} endboss - Reference to Endboss instance
 */
function handleAlertCycle(endboss) {
    endboss.alertCycleCount++;
    if (endboss.alertCycleCount < endboss.maxAlertCycles) {
        endboss.alertAnimationTimer = 800;
        endboss.alertFrameIndex = 0;
    } else {
        endboss.alertAnimationComplete = true;
        endboss.isAlert = false;
    }
}

/**
 * Play attack animation exactly once, frame by frame  
 * @param {Endboss} endboss - Reference to Endboss instance
 */
function playAttackAnimationOnce(endboss) {
    endboss.attackAnimationTimer -= 1000 / 10;
    let timeElapsed = 800 - endboss.attackAnimationTimer;
    let frameIndex = Math.floor(timeElapsed / 100); // Change frame every 100ms
    if (frameIndex >= endboss.IMAGES_ATTACK.length) {
        frameIndex = endboss.IMAGES_ATTACK.length - 1;
        endboss.attackAnimationComplete = true;
        endboss.isAttacking = false; // End attack animation
    }
    let path = endboss.IMAGES_ATTACK[frameIndex];
    if (endboss.imageCache[path] && endboss.imageCache[path].complete) {
        endboss.img = endboss.imageCache[path];
    }
    if (frameIndex !== endboss.attackFrameIndex) {
        endboss.attackFrameIndex = frameIndex;
    }
}

/**
 * Play death animation exactly once, frame by frame
 * @param {Endboss} endboss - Reference to Endboss instance
 */
function playDeathAnimationOnce(endboss) {
    endboss.deathAnimationTimer -= 1000 / 10;
    let timeElapsed = 1000 - endboss.deathAnimationTimer;
    let frameIndex = Math.floor(timeElapsed / 200); // Change frame every 200ms
    if (frameIndex >= endboss.IMAGES_DEAD.length) {
        frameIndex = endboss.IMAGES_DEAD.length - 1;
        endboss.deathAnimationComplete = true;
    }
    let path = endboss.IMAGES_DEAD[frameIndex];
    if (endboss.imageCache[path] && endboss.imageCache[path].complete) {
        endboss.img = endboss.imageCache[path];
    }
    if (frameIndex !== endboss.deathFrameIndex) {
        endboss.deathFrameIndex = frameIndex;
    }
}
