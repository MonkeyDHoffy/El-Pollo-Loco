/**
 * Base class for all drawable objects in the game with image handling and animation support
 */
class DrawableObject {
    img;
    imageCache = {};
    x = 120;
    y = 250;
    height = 120;
    width = 100;
    currentImage = 0;

    /**
     * Loads a single image from the specified path
     * @param {string} path - Path to the image file
     */
    loadImage(path) {
        try {
            this.img = new Image();
            this.img.src = path;
        } catch (e) {
            console.error('Error loading image:', e);
        }
    }

    /**
     * Draws the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    draw(ctx) {
        try {
            if (this.isImageLoaded()) {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            } else {
                this.handleUnloadedImage();
            }
        } catch (e) {
            this.logDrawError(e);
        }
    }

    /**
     * Checks if the current image is properly loaded
     * @returns {boolean} True if image is loaded and ready
     */
    isImageLoaded() {
        return this.img && this.img.complete && this.img.naturalWidth > 0;
    }

    /**
     * Handles drawing when image is not loaded
     */
    handleUnloadedImage() {
        if (this.IMAGES_IDLE) {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Logs detailed error information for drawing failures
     * @param {Error} e - The error that occurred
     */
    logDrawError(e) {
        console.error('Error drawing image:', e);
        console.info('Object info:', {
            type: this.constructor.name,
            image: this.img,
            position: { x: this.x, y: this.y },
            size: { width: this.width, height: this.height }
        });
    }

    /**
     * Loads multiple images and stores them in cache for animations
     * @param {Array} arr - Array of image paths to load
     */
    loadImages(arr) {
        if (!this.isValidImageArray(arr)) {
            return;
        }
        
        arr.forEach((path) => {
            this.cacheImage(path);
        });
    }

    /**
     * Validates if the provided array is suitable for image loading
     * @param {Array} arr - Array to validate
     * @returns {boolean} True if valid, false otherwise
     */
    isValidImageArray(arr) {
        return arr && Array.isArray(arr);
    }

    /**
     * Caches a single image for later use
     * @param {string} path - Path to the image file
     */
    cacheImage(path) {
        try {
            let img = new Image();
            this.setupImageEvents(img, path);
            img.src = path;
            this.imageCache[path] = img;
        } catch (e) {
            console.error('Error caching image:', e, 'Path:', path);
        }
    }

    /**
     * Sets up event handlers for image loading
     * @param {Image} img - The image element
     * @param {string} path - Path to the image file
     */
    setupImageEvents(img, path) {
        img.onload = () => {
            // Image successfully loaded
        };
        img.onerror = () => {
            console.error('Failed to load image for cache:', path);
        };
    }

    /**
     * Plays animation by cycling through image array
     * @param {Array} images - Array of image paths for animation
     */
    playAnimation(images) {
        if (!this.isValidAnimationArray(images)) {
            return;
        }
        
        let i = this.currentImage % images.length;
        let path = images[i];
        
        if (this.isCachedImageReady(path)) {
            this.updateAnimationFrame(path, images.length);
        }
    }

    /**
     * Validates if the animation array is suitable for playback
     * @param {Array} images - Array to validate
     * @returns {boolean} True if valid, false otherwise
     */
    isValidAnimationArray(images) {
        return images && images.length > 0;
    }

    /**
     * Checks if a cached image is ready for display
     * @param {string} path - Path to the cached image
     * @returns {boolean} True if ready, false otherwise
     */
    isCachedImageReady(path) {
        return this.imageCache[path] && 
               this.imageCache[path].complete && 
               this.imageCache[path].naturalWidth > 0;
    }

    /**
     * Updates the current animation frame
     * @param {string} path - Path to the current frame image
     * @param {number} totalFrames - Total number of frames in animation
     */
    updateAnimationFrame(path, totalFrames) {
        this.img = this.imageCache[path];
        this.currentImage++;
        
        if (this.currentImage >= totalFrames * 10) {
            this.currentImage = 0;
        }
    }

    /**
     * Draws collision frames for debugging purposes
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    drawFrame(ctx) {
        if (this.shouldDrawCollisionFrame()) {
            this.setupFrameDrawing(ctx);
            this.drawCollisionBox(ctx);
            ctx.stroke();
        }
    }

    /**
     * Determines if collision frame should be drawn for this object
     * @returns {boolean} True if frame should be drawn
     */
    shouldDrawCollisionFrame() {
        return this instanceof Character || this instanceof Chicken || 
               this instanceof MiniChicken || this instanceof Endboss || 
               this instanceof Coin || this instanceof Bottle;
    }

    /**
     * Sets up the drawing context for collision frames
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    setupFrameDrawing(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "rgba(255, 0, 0, 0)";
    }

    /**
     * Draws the appropriate collision box based on object type
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawCollisionBox(ctx) {
        if (this instanceof Character) {
            this.drawCharacterCollisionBox(ctx);
        } else if (this instanceof Endboss) {
            this.drawEndbossCollisionBox(ctx);
        } else if (this instanceof MiniChicken) {
            this.drawMiniChickenCollisionBox(ctx);
        } else if (this instanceof Coin) {
            this.drawCoinCollisionBox(ctx);
        } else if (this instanceof Bottle) {
            this.drawBottleCollisionBox(ctx);
        } else {
            this.drawChickenCollisionBox(ctx);
        }
    }

    /**
     * Draws collision box for Character
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawCharacterCollisionBox(ctx) {
        ctx.rect(this.x + 20, this.y + 90, this.width - 50, this.height - 100);
    }

    /**
     * Draws collision box for Endboss
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawEndbossCollisionBox(ctx) {
        ctx.rect(this.x + 30, this.y + 60, this.width - 45, this.height - 80);
    }

    /**
     * Draws collision box for MiniChicken
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawMiniChickenCollisionBox(ctx) {
        ctx.rect(this.x, this.y, this.width - 10, this.height - 5);
    }

    /**
     * Draws collision box for Coin
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawCoinCollisionBox(ctx) {
        ctx.rect(this.x + 60, this.y + 60, this.width - 120, this.height - 120);
    }

    /**
     * Draws collision box for Bottle
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawBottleCollisionBox(ctx) {
        ctx.rect(this.x + 15, this.y + 15, this.width - 30, this.height - 30);
    }

    /**
     * Draws collision box for regular Chicken
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawChickenCollisionBox(ctx) {
        ctx.rect(this.x, this.y, this.width - 15, this.height - 10);
    }
}
