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

    // Plays animation by cycling through image array - optimized for smoother playback
    playAnimation(images) {
        if (!images || images.length === 0) {
            return;
        }
        
        let i = this.currentImage % images.length;
        let path = images[i];
        
        if (this.imageCache[path] && this.imageCache[path].complete && this.imageCache[path].naturalWidth > 0) {
            this.img = this.imageCache[path];
            this.currentImage++;
            
            // Reset currentImage when reaching end to prevent endless counting
            if (this.currentImage >= images.length * 10) {
                this.currentImage = 0;
            }
        }
    }

      // Draws collision frame for debugging
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof MiniChicken || this instanceof Endboss || 
            this instanceof Coin || this instanceof Bottle) {
            ctx.beginPath();
            ctx.lineWidth = "4";
            ctx.strokeStyle = "rgba(255, 0, 0, 0.15)";
            
            if (this instanceof Character) {
                // Adjusted collision box for Character - smaller and lower
                ctx.rect(this.x + 20, this.y + 90, this.width - 50, this.height - 100);
            } else if (this instanceof Endboss) {
                // Adjusted collision box for Endboss - slightly lower
                ctx.rect(this.x + 30, this.y + 60, this.width - 45, this.height - 80);
            } else if (this instanceof MiniChicken) {
                // Smaller collision box for MiniChicken
                ctx.rect(this.x, this.y, this.width - 10, this.height - 5);
            } else if (this instanceof Coin) {
                // Much smaller collision box for Coin - centered and greatly reduced
                ctx.rect(this.x + 60, this.y + 60, this.width - 120, this.height - 120);
            } else if (this instanceof Bottle) {
                // Smaller collision box for Bottle - centered and reduced
                ctx.rect(this.x + 15, this.y + 15, this.width - 30, this.height - 30);
            } else {
                // Normal collision box for Chicken
                ctx.rect(this.x, this.y, this.width - 15, this.height - 10);
            }
            
            ctx.stroke();
        }
    }
}