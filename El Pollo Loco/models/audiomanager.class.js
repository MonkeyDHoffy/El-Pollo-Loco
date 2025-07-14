class AudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        this.isMuted = false; // Add mute state
        this.walkingSound = null; // Walking sound reference
        
        this.coinCollectingSounds = [
            'audio/sounds/coincollecting(1).mp3',
            'audio/sounds/coincollecting(1).wav',
            'audio/sounds/coincollecting(2).wav',
            'audio/sounds/coincollecting(3).wav'
        ];

        this.bottleCollectingSounds = [
            'audio/sounds/collect1.wav',
            'audio/sounds/collect2.mp3',
            'audio/sounds/collectbottle.wav'
        ];

        // Character sounds
        this.jumpSounds = [
            'audio/sounds/jump1.wav',
            'audio/sounds/jumpfart1.wav',
            'audio/sounds/jumpfart2.wav',
            'audio/sounds/jumpfart3.mp3'
        ];

        this.chickenAttackSounds = [
            'audio/sounds/chickenattack/chicken1.wav',
            'audio/sounds/chickenattack/chicken2.wav',
            'audio/sounds/chickenattack/chicken3.wav',
            'audio/sounds/chickenattack/pop.flac',
            'audio/sounds/chickenattack/popp.mp3',
            'audio/sounds/chickenattack/poppp.flac',
            'audio/sounds/chickenattack/poppp.wav'
        ];

        this.hurtSounds = [
            'audio/sounds/ouch1.wav',
            'audio/sounds/ouch2.wav',
            'audio/sounds/ouch3.wav',
            'audio/sounds/ouch4.wav'
        ];
        
        this.initBackgroundMusic();
        this.initWalkingSound();
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
        this.playSound('audio/sounds/throw1.wav');
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
        this.playRandomSound(this.bottleCollectingSounds);
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
        this.playRandomSound(this.jumpSounds);
    }

    /**
     * Play random chicken attack sound
     */
    playRandomChickenAttackSound() {
        this.playRandomSound(this.chickenAttackSounds);
    }

    /**
     * Play random hurt sound
     */
    playRandomHurtSound() {
        this.playRandomSound(this.hurtSounds);
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
     * Set mute state for all audio
     */
    setMuted(muted) {
        this.isMuted = muted;
        
        // Mute/unmute background music
        if (this.backgroundMusic) {
            this.backgroundMusic.muted = muted;
        }
        
        // Mute/unmute walking sound
        if (this.walkingSound) {
            this.walkingSound.muted = muted;
        }
        
        console.log(`[AudioManager] Audio ${muted ? 'muted' : 'unmuted'}`);
    }

    /**
     * Play sound with mute check
     */
    playSound(soundPath, volume = 1.0) {
        if (this.isMuted) return; // Don't play if muted
        
        try {
            let audio = new Audio(soundPath);
            audio.volume = volume;
            audio.play().catch(e => console.log('Sound play failed:', e));
        } catch (e) {
            console.log('Sound creation failed:', e);
        }
    }

    /**
     * Play random sound from array with mute check
     */
    playRandomSound(soundArray, volume = 1.0) {
        if (this.isMuted || !soundArray || soundArray.length === 0) return;
        
        let randomSound = soundArray[Math.floor(Math.random() * soundArray.length)];
        this.playSound(randomSound, volume);
    }
}
