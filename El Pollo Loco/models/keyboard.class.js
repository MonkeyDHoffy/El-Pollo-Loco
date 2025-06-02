class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;

    constructor() {
        this.bindKeyPressEvents();
    }

    /**
     * Binds the key press events to update the keyboard state
     */
    bindKeyPressEvents() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowRight') {
                this.RIGHT = true;
            }
            if (event.code === 'ArrowLeft') {
                this.LEFT = true;
            }
            if (event.code === 'ArrowUp') {
                this.UP = true;
            }
            if (event.code === 'ArrowDown') {
                this.DOWN = true;
            }
            if (event.code === 'Space') {
                this.SPACE = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.code === 'ArrowRight') {
                this.RIGHT = false;
            }
            if (event.code === 'ArrowLeft') {
                this.LEFT = false;
            }
            if (event.code === 'ArrowUp') {
                this.UP = false;
            }
            if (event.code === 'ArrowDown') {
                this.DOWN = false;
            }
            if (event.code === 'Space') {
                this.SPACE = false;
            }
        });
    }
}