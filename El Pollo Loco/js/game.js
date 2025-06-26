let canvas;
let world;
let keyboard = new Keyboard();

// Initialize the game
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas);
    world.draw();

    console.log('My character:', world.character);
}

// Event listener for debugging keyboard events
window.addEventListener('keypress', (event) => {
    console.log(event);
});