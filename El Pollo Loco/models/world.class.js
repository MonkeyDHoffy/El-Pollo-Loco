class World{

character = new Character();
enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken()
];

clouds = [
    new Cloud(),
    new Cloud(),
    new Cloud()
];

backgroundObjects = [
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 0, 0),
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0, 0),
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 0, 0),
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0, 0),
];

canvas;
ctx;

    constructor(canvas){
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
        }

    draw(){
this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas before drawing the next frame

  

   this.addObjectsToMap(this.backgroundObjects); 
    this.addToMap(this.character); // Add the character to the map
   this.addObjectsToMap(this.clouds); // Add the clouds to the map
   this.addObjectsToMap(this.enemies); // Add the enemies to the map

        // this.backgroundObjects.forEach((bgo) => this.addToMap(bgo)); // Loop through each background object and add it to the map
        // this.clouds.forEach(cloud => this.addToMap(cloud)); // Loop through each cloud and add it to the map
        // this.enemies.forEach(enemy => this.addToMap(enemy)); // Loop through each enemy and add it to the map
        
let self = this; // Save the context of 'this' to use inside the requestAnimationFrame callback
requestAnimationFrame(function() {
    self.draw(); // Call the draw method again for the next frame, creating a loop
}); 
    }

    addObjectsToMap(objects){
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(mobject){
        this.ctx.drawImage(mobject.img, mobject.x, mobject.y, mobject.width, mobject.height);
    }
    
}

