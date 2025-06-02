class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 120;
    width = 100;
    imageCache = {}; // Cache for loaded images
    speed = 0.9; // Default speed for movement

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
    setInterval(() => {
        this.x += this.speed; // Move the object to the right
    }, 1000 / 60);
}

moveLeft() {
       setInterval(() => {
            this.x -= this.speed; // Move the cloud to the left
        }, 1000 / 60);
}
}