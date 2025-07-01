class DrawableObject {
    img;
    imageCache = {};
    x = 120;
    y = 250;
    height = 120;
    width = 100;
    currentImage = 0; // Added this property that was missing

     // Loads a single image
    loadImage(path) {
        try {
            this.img = new Image();
            this.img.onload = () => {};
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
            if (this.img && this.img.complete && this.img.naturalWidth > 0) {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            } else {
                // If image is not loaded, play idle animation if available
                
                    this.playAnimation(this.IMAGES_IDLE);
              
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

      // Loads multiple images and stores them in cache
    loadImages(arr) {
        if (!arr || !Array.isArray(arr)) {
            // console.error('Invalid images array provided');
            return;
        }
        
        arr.forEach((path) => {
            try {
                let img = new Image();
                img.onload = () => {
                    // Bild erfolgreich geladen
                };
                img.onerror = () => {
                    // console.error('Failed to load image for cache:', path);
                };
                img.src = path;
                this.imageCache[path] = img;
            } catch (e) {
                // console.error('Error caching image:', e, 'Path:', path);
            }
        });
    }

    // Plays animation by cycling through image array
    playAnimation(images) {
        if (!images || images.length === 0) {
            // console.error('No images provided for animation');
            return;
        }
        
        let i = this.currentImage % images.length;
        let path = images[i];
        
        if (this.imageCache[path] && this.imageCache[path].complete && this.imageCache[path].naturalWidth > 0) {
            this.img = this.imageCache[path];
            this.currentImage++;
        }
        // Wenn das Bild noch nicht geladen ist, wird einfach das vorherige Bild beibehalten
    }

    // Leere drawFrame Methode als Standard
    drawFrame(ctx) {
        // Keine Implementierung - wird in MovableObject überschrieben
    }
}