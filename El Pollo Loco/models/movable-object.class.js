class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 120;
    width = 100;
    imageCache = {};
    speed = 0.9;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        return this.y < 250;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
         ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // Zeichnet das Bild des Objekts auf das Canva

    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
ctx.beginPath(); // Beginnt einen neuen Pfad für die Zeichnung
ctx.lineWidth = "4"; // Setzt die Linienbreite für den Pfad
ctx.strokeStyle = "red"; // Setzt die Linienfarbe für den Pfad       
ctx.rect(this.x, this.y, this.width, this.height); // Fügt ein Rechteck zum Pfad hinzu, das die Position und Größe des Objekts repräsentiert
ctx.stroke(); // Zeichnet den Pfad auf das Canvas
    }}

    /**
     * Lädt eine Reihe von Bildern anhand der angegebenen Pfade und speichert sie im Image-Cache.
     * @param {string[]} arr - Ein Array von Bildpfaden, die geladen werden sollen.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images) {
        let i = this.currentImageWalking % this.IMAGES_WALKING.length;
        let walkingPath = images[i];
        this.img = this.imageCache[walkingPath];
        this.currentImageWalking++;
    }

    moveRight() {
        this.otherDirection = false;
        this.x += this.speed;
    }

    moveLeft(direction) {
        this.otherDirection = direction;
        this.x -= this.speed;
    }

    
flipImage(mobject) {
    this.ctx.save(); // Speichert den aktuellen Zustand des Kontextes
        this.ctx.translate(mobject.width, 0); // Verschiebt den Ursprung des Koordinatensystems nach rechts um die Breite des Objekts
        this.ctx.scale(-1, 1); // Spiegelt das Koordinatensystem horizontal
        mobject.x = -mobject.x;// Passt die x-Position an, um die Spiegelung zu berücksichtigen

}

flipImageBack(mobject) {
      mobject.x = -mobject.x;// Stellt die x-Position nach der Spiegelung wieder her
        this.ctx.restore(); // Stellt den vorherigen Zustand des Kontextes wieder her
}

isColliding(mobject) {
    return this.x + this.width > mobject.x &&
           this.x < mobject.x + mobject.width &&
           this.y + this.height > mobject.y &&
           this.y < mobject.y + mobject.height;

}
}
