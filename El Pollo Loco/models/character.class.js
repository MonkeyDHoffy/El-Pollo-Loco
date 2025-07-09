class Character extends MovableObject {
    height = 200;
    energy = 100; // Changed from 900 to 100
    coins = 0;
    bottles = 0;
    speed = 8;

    IMAGES_JUMPING = [
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png', 
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        'img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
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

    world;
    showWrongDirectionWarning = false;
    warningStartTime = 0;

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


    constructor() {
        super().loadImage('img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        
        console.log('Verifying image loading...');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        
        this.applyGravity();
        this.animate();
    }

    // Controls character movement, animation and camera position
    animate() {
        setInterval(() => {
            if (!this.world.isPaused) {
                if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                    this.moveRight();
                }
                if (this.world.keyboard.LEFT && this.x > 0) {
                    this.moveLeft(true);
                } else if (this.world.keyboard.LEFT && this.x <= 0) {
                    // Character is at level start and trying to move left
                    this.showWrongDirectionWarning = true;
                    this.warningStartTime = Date.now();
                }
                if (this.world.keyboard.UP && !this.isAboveGround()) {
                    this.jump(20);
                }

                // Update camera position
                this.world.camera_x = -this.x + this.world.canvas.width / 2 - this.width / 2;
            }
        }, 1000 / 32);

        // Animation state management - optimized timing for jump animation
        setInterval(() => {
            if (!this.world.isPaused) {
                if (this.isDead()) {
                    this.playAnimation(this.IMAGES_DEAD);
                } else if (this.isHurt()) {
                    this.playAnimation(this.IMAGES_HURT);
                } else if (this.isAboveGround() || this.speedY > 0) {
                    this.playAnimation(this.IMAGES_JUMPING);
                } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 80); // Increased from 50ms to 80ms for smoother jump animation

        // Idle animation when not moving - kept at original speed
        setInterval(() => {
            if (!this.world.isPaused && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && 
                !this.world.keyboard.UP && !this.world.keyboard.DOWN && 
                !this.world.keyboard.SPACE) {
                
                let idlePath = this.IMAGES_IDLE[this.currentImage];
                this.img = this.imageCache[idlePath];
                this.currentImage++;
                if (this.currentImage >= this.IMAGES_IDLE.length) {
                    this.currentImage = 0;
                }
            }
        }, 1000 / 5);
    }

    // Check if warning should be hidden
    updateWarning() {
        if (this.showWrongDirectionWarning && Date.now() - this.warningStartTime > 2000) {
            this.showWrongDirectionWarning = false;
        }
    }

    // Play random jump sound
    playRandomJumpSound() {
        let randomIndex = Math.floor(Math.random() * this.jumpSounds.length);
        let randomSound = new Audio(this.jumpSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    }

    // Play random chicken attack sound
    playRandomChickenAttackSound() {
        let randomIndex = Math.floor(Math.random() * this.chickenAttackSounds.length);
        let randomSound = new Audio(this.chickenAttackSounds[randomIndex]);
        randomSound.play().catch(error => {
            console.log('Chicken attack audio playback failed:', error);
        });
    }

    // Makes character jump
    jump(howhigh) {
        this.speedY = howhigh;
        this.playRandomJumpSound();
        console.log("character is jumping");
    }

    // Override collision detection to use adjusted collision box
    isColliding(mobject) {
        // Character's collision box (adjusted)
        let charLeft = this.x + 20;
        let charRight = this.x + this.width - 30; // 20 + 50 = 70 offset from right
        let charTop = this.y + 90;
        let charBottom = this.y + this.height - 10; // 90 + 100 = 190 offset from bottom

        // Check if the other object has custom collision detection
        if (mobject instanceof Coin || mobject instanceof Bottle) {
            // Use the object's own collision method but check against character's adjusted box
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

        // Default collision for other objects (enemies, etc.)
        return charLeft + (charRight - charLeft) > mobject.x &&
               charLeft < mobject.x + mobject.width &&
               charTop + (charBottom - charTop) > mobject.y &&
               charTop < mobject.y + mobject.height;
    }
}