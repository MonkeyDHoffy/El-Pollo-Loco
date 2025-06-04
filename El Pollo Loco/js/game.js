let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  
    canvas = document.getElementById("canvas");
    world = new World(canvas);
    world.draw();

    console.log('My character:', world.character);
   
}

window.addEventListener('keypress', (event) => {
    console.log(event);
    // if (event.code === 'ArrowRight') {
    //     world.character.moveRight();
    // }
    // if (event.code === 'ArrowLeft') {
    //     world.character.moveLeft();
    // }
    // if (event.code === 'ArrowUp') {
    //     world.character.jump();
    // }
    // if (event.code === 'Space') {
    //     world.character.attack();
    
});