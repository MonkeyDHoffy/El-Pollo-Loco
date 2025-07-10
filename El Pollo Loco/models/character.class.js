class Character extends MovableObject {
    height = 200;
    energy = 100;
    coins = 0;
    bottles = 0;
    speed = 8;
    world;
    showWrongDirectionWarning = false;
    warningStartTime = 0;

    IMAGES_JUMPING = [
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [  
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
        'img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_WALKING = [
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        'img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_HURT = [
        'img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
        'img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
        'img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png',
        'img/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png'
    ];

    jumpSounds = [
        'audio/sounds/jump1.wav',
        'audio/sounds/jump1.wav',
        'audio/sounds/jump1.wav',
        'audio/sounds/jump1.wav',
        'audio/sounds/jump1.wav',
        'audio/sounds/jumpfart1.wav',
        'audio/sounds/jumpfart2.wav',
        'audio/sounds/jumpfart3.mp3'
    ];

    chickenAttackSounds = [
        'audio/sounds/chickenattack/chicken1.wav',
        'audio/sounds/chickenattack/chicken2.wav',
        'audio/sounds/chickenattack/chicken3.wav',
        'audio/sounds/chickenattack/pop.flac',
        'audio/sounds/chickenattack/popp.mp3',
        'audio/sounds/chickenattack/poppp.flac',
        'audio/sounds/chickenattack/poppp.wav'
    ];

    hurtSounds = [
        'audio/sounds/ouch1.wav',
        'audio/sounds/ouch2.wav',
        'audio/sounds/ouch3.wav',
        'audio/sounds/ouch4.wav'
    ];

    walkingSound;
    isWalkingSoundPlaying = false;

    constructor() {
        super().loadImage('img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        
        console.log('Verifying image loading...');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        
        this.walkingSound = new Audio('audio/sounds/walkigmud.wav');
        this.walkingSound.loop = true;
        this.walkingSound.volume = 0.3;
        
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.world.isPaused) {
                if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                    this.moveRight();
                    this.playWalkingSound();
                } else if (this.world.keyboard.LEFT && this.x > 0) {
                    this.moveLeft(true);
                    this.playWalkingSound();
                } else if (this.world.keyboard.LEFT && this.x <= 0) {
                    this.showWrongDirectionWarning = true;
                    this.warningStartTime = Date.now();
                    this.stopWalkingSound();
                } else {
                    this.stopWalkingSound();
                }
                
                if (this.world.keyboard.UP && !this.isAboveGround()) {
                    this.jump(20);
                }

                this.world.camera_x = -this.x + this.world.canvas.width / 2 - this.width / 2;
            } else {
                this.stopWalkingSound();
            }
        }, 1000 / 32);

        setInterval(() => {
            if (!this.world.isPaused) {
                if (this.isDead()) {
                    this.playAnimation(this.IMAGES_DEAD);
                } else if (this.isHurt()) {
                    this.playAnimation(this.IMAGES_HURT);
                } else if (this.isAboveGround()) {
                    this.playAnimation(this.IMAGES_JUMPING);
                } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 100);

        setInterval(() => {
            if (!this.world.isPaused && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && 
                !this.world.keyboard.UP && !this.world.keyboard.DOWN) {
                
                let idlePath = this.IMAGES_IDLE[this.currentImage];
                this.img = this.imageCache[idlePath];
                this.currentImage++;
                if (this.currentImage >= this.IMAGES_IDLE.length) {
                    this.currentImage = 0;
                }
            }
        }, 1000 / 5);
    }

    updateWarning() {
        if (this.showWrongDirectionWarning && Date.now() - this.warningStartTime > 2000) {
            this.showWrongDirectionWarning = false;
        }
    }

    jump(howhigh) {
        this.speedY = howhigh;
        this.playRandomJumpSound();
        console.log("character is jumping");
    }

    canThrowBottle() {
        return this.bottles > 0;
    }

    useBottle() {
        if (this.bottles > 0) {
            this.bottles--;
            console.log(`Bottle thrown! Remaining bottles: ${this.bottles}`);
            return true;
        }
        return false;
    }

    playRandomJumpSound() {
        let randomIndex = Math.floor(Math.random() * this.jumpSounds.length);
        let randomSound = new Audio(this.jumpSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    }

    playRandomChickenAttackSound() {
        let randomIndex = Math.floor(Math.random() * this.chickenAttackSounds.length);
        let randomSound = new Audio(this.chickenAttackSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Chicken attack audio playback failed:', error);
        });
    }

    playRandomHurtSound() {
        let randomIndex = Math.floor(Math.random() * this.hurtSounds.length);
        let randomSound = new Audio(this.hurtSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Hurt sound playback failed:', error);
        });
    }

    playWalkingSound() {
        if (!this.isAboveGround() && !this.isWalkingSoundPlaying) {
            this.walkingSound.play().catch(error => {
                console.log('Walking sound playback failed:', error);
            });
            this.isWalkingSoundPlaying = true;
        }
        
        if (this.isAboveGround() && this.isWalkingSoundPlaying) {
            this.stopWalkingSound();
        }
    }

    stopWalkingSound() {
        if (this.isWalkingSoundPlaying) {
            this.walkingSound.pause();
            this.walkingSound.currentTime = 0;
            this.isWalkingSoundPlaying = false;
        }
    }

    isColliding(mobject) {
        let charLeft = this.x + 20;
        let charRight = this.x + this.width - 30;
        let charTop = this.y + 90;
        let charBottom = this.y + this.height - 10;

        if (mobject instanceof Coin || mobject instanceof Bottle) {
            if (mobject instanceof Coin) {
                return (mobject.x + 60) + (mobject.width - 120) > charLeft &&
                       (mobject.x + 60) < charRight &&
                       (mobject.y + 60) + (mobject.height - 120) > charTop &&
                       (mobject.y + 60) < charBottom;
            } else if (mobject instanceof Bottle) {
                return (mobject.x + 15) + (mobject.width - 30) > charLeft &&
                       (mobject.x + 15) < charRight &&
                       (mobject.y + 15) + (mobject.height - 30) > charTop &&
                       (mobject.y + 15) < charBottom;
            }
        }

        return charLeft + (charRight - charLeft) > mobject.x &&
               charLeft < mobject.x + mobject.width &&
               charTop + (charBottom - charTop) > mobject.y &&
               charTop < mobject.y + mobject.height;
    }
}