let canvas;
let world;

function init() {
  
    canvas = document.getElementById("canvas");
    world = new World(canvas);
world.draw();

    console.log('My character:', world.character);
   
}