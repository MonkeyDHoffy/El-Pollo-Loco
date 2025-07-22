/**
 * Manages all audio elements including sound effects and background music
 */
class AudioManager {
    /**
     * Initialize audio manager with all sound systems
     */
    constructor() {
        this.initializeAudioState();
        this.initializeSoundArrays();
        this.initializeAudioSources();
    }

    /**
     * Initialize audio state variables
     */
    initializeAudioState() {
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        this.isMuted = false;
        this.walkingSound = null;
    }

    /**
     * Initialize audio source objects
     */
    initializeAudioSources() {
        this.initBackgroundMusic();
        this.initWalkingSound();
    }

    /**
     * Initializes all sound effect arrays
     */
    initializeSoundArrays() {
        this.initializeCoinSounds();
        this.initializeBottleSounds();
        this.initializeJumpSounds();
        this.initializeChickenAttackSounds();
        this.initializeHurtSounds();
    }

    /**
     * Initialize coin collecting sound effects
     */
    initializeCoinSounds() {
        this.coinCollectingSounds = [
            'audio/sounds/coincollecting(1).mp3',
            'audio/sounds/coincollecting(2).wav',
            'audio/sounds/coincollecting(3).wav'
        ];
    }

    /**
     * Initialize bottle collecting sound effects
     */
    initializeBottleSounds() {
        this.bottleCollectingSounds = [
            'audio/sounds/collect1.wav',
            'audio/sounds/collect2.mp3',
            'audio/sounds/collectbottle.wav'
        ];
    }

    /**
     * Initialize jump sound effects
     */
    initializeJumpSounds() {
        this.jumpSounds = [
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jump1.wav',
            'audio/sounds/jumpfart1.wav',
            'audio/sounds/jumpfart2.wav',
            'audio/sounds/jumpfart3.mp3',
            'audio/sounds/jumpjump.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav',
            'audio/sounds/jumpjump1.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav',
            'audio/sounds/jumpjump1.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav',
            'audio/sounds/jumpjump1.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav',
            'audio/sounds/jumpjump1.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav',
            'audio/sounds/jumpjump1.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav',
            'audio/sounds/jumpjump1.wav',
            'audio/sounds/jumpjump2.wav',
            'audio/sounds/jumpjump3.wav',
            'audio/sounds/jumpjump4.wav'
          
        ];
    }

    /**
     * Initialize chicken attack sound effects
     */
    initializeChickenAttackSounds() {
        this.chickenAttackSounds = [
            'audio/sounds/chickenattack/chicken1.wav',
            'audio/sounds/chickenattack/chicken2.wav',
            'audio/sounds/chickenattack/chicken3.wav',
            'audio/sounds/chickenattack/pop.flac',
            'audio/sounds/chickenattack/popp.mp3',
            'audio/sounds/chickenattack/poppp.flac',
            'audio/sounds/chickenattack/poppp.wav',
            'audio/sounds/chickenattack/chicken2.wav',
            'audio/sounds/chickenattack/chicken3.wav',
            'audio/sounds/chickenattack/pop.flac',
            'audio/sounds/chickenattack/popp.mp3',
            'audio/sounds/chickenattack/poppp.flac',
            'audio/sounds/chickenattack/poppp.wav'
        ];
    }

    /**
     * Initialize hurt sound effects
     */
    initializeHurtSounds() {
        this.hurtSounds = [
            'audio/sounds/ouch1.wav',
            'audio/sounds/ouch2.wav',
            'audio/sounds/ouch3.wav',
            'audio/sounds/ouch4.wav'
        ];
    }

    /**
     * Initialize background music
     */
    initBackgroundMusic() {
        this.backgroundMusic = new Audio('audio/sounds/music/chicken_background.wav');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.7;
        
        setTimeout(() => {
            this.startBackgroundMusic();
        }, 1000);
    }

    /**
     * Initialize walking sound
     */
    initWalkingSound() {
        this.walkingSound = new Audio('audio/sounds/walkigmud.wav');
        this.walkingSound.loop = true;
        this.walkingSound.volume = 0.3;
    }

    /**
     * Start background music
     */
    startBackgroundMusic() {
        if (this.backgroundMusic && !this.isMusicPlaying) {
            this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
            this.isMusicPlaying = true;
        }
    }

    /**
     * Pause background music
     */
    pauseBackgroundMusic() {
        if (this.backgroundMusic && this.isMusicPlaying) {
            this.backgroundMusic.pause();
            this.isMusicPlaying = false;
        }
    }

    /**
     * Resume background music
     */
    resumeBackgroundMusic() {
        if (this.backgroundMusic && !this.isMusicPlaying) {
            this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
            this.isMusicPlaying = true;
        }
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.isMusicPlaying = false;
        }
    }

    /**
     * Play glass break sound effect
     */
    playGlassBreakSound() {
        this.playSound('audio/sounds/glas_breaks.wav');
    }

    /**
     * Play throw sound effect
     */
    playThrowSound() {
        this.playSound('audio/sounds/throw1.wav',0.7);
    }

    /**
     * Play random coin collecting sound
     */
    playRandomCoinCollectingSound() {
        this.playRandomSound(this.coinCollectingSounds);
    }

    /**
     * Play random bottle collecting sound
     */
    playRandomBottleCollectingSound() {
        this.playRandomSound(this.bottleCollectingSounds, 0.3);
    }

    /**
     * Play coin respawn sound
     */
    playCoinRespawnSound() {
        this.playSound('audio/sounds/coinrespawn.wav');
    }

    /**
     * Play random jump sound
     */
    playRandomJumpSound() {
        this.playRandomSound(this.jumpSounds, 0.7);
    }

    /**
     * Play random chicken attack sound
     */
    playRandomChickenAttackSound() {
        if (this.isMuted || !this.chickenAttackSounds || this.chickenAttackSounds.length === 0) return;
        let randomSound = this.chickenAttackSounds[Math.floor(Math.random() * this.chickenAttackSounds.length)];
        let volume = randomSound.includes('chicken1.wav') ? 0.1 : 0.7;
        this.playSound(randomSound, volume);
    }

    /**
     * Play random hurt sound
     */
    playRandomHurtSound() {
        this.playRandomSound(this.hurtSounds, 0.7);
    }

    /**
     * Play walking sound
     */
    playWalkingSound() {
        if (this.isMuted) return;
        
        if (this.walkingSound && this.walkingSound.paused) {
            this.walkingSound.play().catch(e => console.log('Walking sound play failed:', e));
        }
    }

    /**
     * Stop walking sound
     */
    stopWalkingSound() {
        if (this.walkingSound && !this.walkingSound.paused) {
            this.walkingSound.pause();
            this.walkingSound.currentTime = 0;
        }
    }

    /**
     * Set background music volume
     */
    setMusicVolume(volume) {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Get current music status
     */
    getMusicStatus() {
        return {
            isPlaying: this.isMusicPlaying,
            volume: this.backgroundMusic ? this.backgroundMusic.volume : 0,
            currentTime: this.backgroundMusic ? this.backgroundMusic.currentTime : 0,
            isMuted: this.isMuted
        };
    }

    /**
     * Sets mute state for all audio components
     * @param {boolean} muted - Whether to mute all audio
     */
    setMuted(muted) {
        this.isMuted = muted;
        this.muteBackgroundMusic(muted);
        this.muteWalkingSound(muted);
    }

    /**
     * Mutes or unmutes background music
     * @param {boolean} muted - Whether to mute background music
     */
    muteBackgroundMusic(muted) {
        if (this.backgroundMusic) {
            this.backgroundMusic.muted = muted;
        }
    }

    /**
     * Mutes or unmutes walking sound
     * @param {boolean} muted - Whether to mute walking sound
     */
    muteWalkingSound(muted) {
        if (this.walkingSound) {
            this.walkingSound.muted = muted;
        }
    }

    /**
     * Plays a sound file with mute check and volume control
     * @param {string} soundPath - Path to the sound file
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    playSound(soundPath, volume = 1.0) {
        if (this.isMuted) return;
        
        try {
            let audio = new Audio(soundPath);
            audio.volume = volume;
            audio.play().catch(e => console.log('Sound play failed:', e));
        } catch (e) {
            console.log('Sound creation failed:', e);
        }
    }

    /**
     * Plays a random sound from an array with mute check
     * @param {Array} soundArray - Array of sound file paths
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    playRandomSound(soundArray, volume = 1.0) {
        if (this.isMuted || !soundArray || soundArray.length === 0) return;
        
        let randomSound = soundArray[Math.floor(Math.random() * soundArray.length)];
        this.playSound(randomSound, volume);
    }
}
