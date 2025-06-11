class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 120;
    width = 100;
    imageCache = {}; // Cache for loaded images
    speed = 0.9; // Default speed for movement
    otherDirection = false; // Flag to indicate if the object is moving in the opposite direction
    speedY = 0; // Vertical speed for jumping
    acceleration = 1; // Acceleration for jumping

    applyGravity(){
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) { // Assuming 250 is the ground level
                this.y -= this.speedY;
                this.speedY -= this.acceleration; // Move down by 2 pixels
            } else {
                this.speedY = 0;
            }
        }, 1000 / 60); // 60 frames per second
    }

    isAboveGround() {
        return this.y < 250; // Assuming 250 is the ground level
    }

    // loadImage(./img/test.png) {
    loadImage(path) {
        this.img = new Image(); // Create a new image object
        this.img.src = path;
    }

    /**
     * Lädt eine Reihe von Bildern anhand der angegebenen Pfade und speichert sie im Image-Cache.
     * 
     * @param {string[]} arr - Ein Array von Bildpfaden, die geladen werden sollen.
     */
    loadImages(arr) {
        arr.forEach((path) => {
             let img = new Image();
        img.src = path;
        this.imageCache[path] = img // Store the image in the cache
        });
       
    }

moveRight() {
    
           this.otherDirection = false; // Set direction to right
        this.x += this.speed; // Move the object to the right
 
}

moveLeft() {
  
           this.otherDirection = false; // Set direction to right
            this.x -= this.speed; // Move the cloud to the left
}

playAnimation(images) {
      let i = this.currentImageWalking % this.IMAGES_WALKING.length; // Use modulo to cycle through images
                let walkingPath = images[i];
                this.img = this.imageCache[walkingPath];
                this.currentImageWalking++;

}
}