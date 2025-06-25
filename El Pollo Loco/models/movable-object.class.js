class MovableObject {
    currentImage = 0; // Aktuelles Bild für die Animation
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
    lastHit = 0;

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
        try {
            this.img = new Image();
            this.img.onload = () => {
                // Das Bild wurde erfolgreich geladen
            };
            this.img.onerror = () => {
                console.error('Failed to load image:', path);
            };
            this.img.src = path;
        } catch (e) {
            console.error('Error loading image:', e);
        }
    }

    draw(ctx) {
        try {
            // Überprüfe, ob this.img gültig ist, bevor wir versuchen es zu zeichnen
            if (this.img && this.img.complete && this.img.naturalWidth > 0) {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            } else {
                // Zeige in der Entwicklungsphase ein Platzhalter-Rechteck
                this.playAnimation(this.IMAGES_IDLE); // Sicherstellen, dass ein Bild gesetzt ist
                ctx.fillRect(this.x, this.y, this.width, this.height);
                console.warn('Image not fully loaded for', this.constructor.name);
            }
        } catch (e) {
            console.error('Error drawing image:', e);
            console.info('Object info:', {
                type: this.constructor.name,
                image: this.img,
                position: { x: this.x, y: this.y },
                size: { width: this.width, height: this.height }
            });
        }
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
        if (!arr || !Array.isArray(arr)) {
            console.error('Invalid images array provided');
            return;
        }
        
        arr.forEach((path) => {
            try {
                let img = new Image();
                img.onload = () => {
                    // Das Bild wurde erfolgreich in den Cache geladen
                };
                img.onerror = () => {
                    console.error('Failed to load image for cache:', path);
                };
                img.src = path;
                this.imageCache[path] = img;
            } catch (e) {
                console.error('Error caching image:', e, 'Path:', path);
            }
        });
    }

    playAnimation(images) {
        if (!images || images.length === 0) {
            console.error('No images provided for animation');
            return;
        }
        
        // Verwende die Länge des übergebenen images-Arrays statt this.images
        let i = this.currentImage % images.length;
        let path = images[i];
        
        if (this.imageCache[path]) {
            this.img = this.imageCache[path];
            this.currentImage++;
        } else {
            console.error('Image not found in cache:', path);
        }
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

hit(damage) {
    this.energy -= damage; // Verringert die Energie des Charakters um den angegebenen Schaden
    if (this.energy < 0) {
        this.energy = 0; // Stellt sicher, dass die Energie
} else{
        this.lastHit = new Date().getTime(); // Speichert den Zeitpunkt des letzten Treffers
    }
}


isHurt() {
let timepassed = new Date().getTime() - this.lastHit; // Berechnet die Zeit seit dem letzten Treffer
timepassed = timepassed / 1000; // Konvertiert die Zeit in Sekunden
return timepassed < 0.3; // Gibt true zurück, wenn weniger als 1 Sekunde
}

isDead() {
    return this.energy == 0; // Gibt true zurück, wenn die Energie des Charakters 0 oder weniger ist    

}
}
