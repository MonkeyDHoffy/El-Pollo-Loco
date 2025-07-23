/**
 * Manages keyboard input state for game controls
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;

    /**
     * Initialize keyboard input handler
     */
    constructor() {
        this.bindKeyPressEvents();
    }

    /**
     * Sets up event listeners for keyboard input handling
     */
    bindKeyPressEvents() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }

    /**
     * Handles keydown events and sets appropriate flags
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        switch(event.code) {
            case 'ArrowRight':
            case 'KeyD':
                this.RIGHT = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.LEFT = true;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.UP = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.DOWN = true;
                this.SPACE = true; // Pfeiltaste nach unten wirft auch Flaschen
                break;
            case 'Space':
                this.SPACE = true;
                break;
        }
    }

    /**
     * Handles keyup events and resets appropriate flags
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyUp(event) {
        switch(event.code) {
            case 'ArrowRight':
            case 'KeyD':
                this.RIGHT = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.LEFT = false;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.UP = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.DOWN = false;
                this.SPACE = false; // Pfeiltaste nach unten hört auf Flaschen zu werfen
                break;
            case 'Space':
                this.SPACE = false;
                break;
        }
    }
}
