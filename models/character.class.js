class Character extends MovableObject {
    // ...existing code...
    
    jumpSounds = [
        'El Pollo Loco/audio/sounds/jump1.wav',
        'El Pollo Loco/audio/sounds/jumpfart1.wav',
        'El Pollo Loco/audio/sounds/jumpfart2.wav',
        'El Pollo Loco/audio/sounds/jumpfart3.mp3'
    ];

    // ...existing code...

    playRandomJumpSound() {
        const randomIndex = Math.floor(Math.random() * this.jumpSounds.length);
        const randomSound = new Audio(this.jumpSounds[randomIndex]);
        randomSound.play();
    }

    jump() {
        this.speedY = 30;
        this.playRandomJumpSound();
    }

    // ...existing code...
}