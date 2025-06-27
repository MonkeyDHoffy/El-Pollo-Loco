let canvas;
let world;
let keyboard = new Keyboard();

// Initialize the game
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas);
    world.draw();
}

// Event listener for debugging keyboard events
window.addEventListener('keypress', (event) => {
    console.log(event);
});