class BackgroundObject extends MovableObject {
  width = 720;
height = 480;

  constructor(imagePath, x, y = 0) {
    super().loadImage(imagePath);
   this.x = x;   
   this.y = 480 - this.height - y; // Adjust the y position based on the height of the object
}}