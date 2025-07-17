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
                this.RIGHT = true;
                break;
            case 'ArrowLeft':
                this.LEFT = true;
                break;
            case 'ArrowUp':
                this.UP = true;
                break;
            case 'ArrowDown':
                this.DOWN = true;
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
                this.RIGHT = false;
                break;
            case 'ArrowLeft':
                this.LEFT = false;
                break;
            case 'ArrowUp':
                this.UP = false;
                break;
            case 'ArrowDown':
                this.DOWN = false;
                break;
            case 'Space':
                this.SPACE = false;
                break;
        }
    }
}