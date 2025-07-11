class AudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        
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
        
        this.initBackgroundMusic();
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
        let glassBreakSound = new Audio('audio/sounds/glas_breaks.wav');
        glassBreakSound.play().catch(e => console.log('Glass break sound failed:', e));
    }

    /**
     * Play throw sound effect
     */
    playThrowSound() {
        let throwSound = new Audio('audio/sounds/throw1.wav');
        throwSound.play().catch(e => console.log('Throw sound failed:', e));
    }

    /**
     * Play random coin collecting sound
     */
    playRandomCoinCollectingSound() {
        let randomIndex = Math.floor(Math.random() * this.coinCollectingSounds.length);
        let randomSound = new Audio(this.coinCollectingSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Coin collecting audio playback failed:', error);
        });
    }

    /**
     * Play random bottle collecting sound
     */
    playRandomBottleCollectingSound() {
        let randomIndex = Math.floor(Math.random() * this.bottleCollectingSounds.length);
        let randomSound = new Audio(this.bottleCollectingSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Bottle collecting audio playback failed:', error);
        });
    }

    /**
     * Play coin respawn sound
     */
    playCoinRespawnSound() {
        let coinRespawnSound = new Audio('audio/sounds/coinrespawn.wav');
        coinRespawnSound.play().catch(error => {
            console.log('Coin respawn audio playback failed:', error);
        });
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
            currentTime: this.backgroundMusic ? this.backgroundMusic.currentTime : 0
        };
    }
}
