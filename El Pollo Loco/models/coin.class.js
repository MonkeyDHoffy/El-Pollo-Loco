class Coin extends MovableObject {
    height = 160;  // Korrigiert von "heigt" zu "height"
    width = 160;
    
    // Bilder für die Coins Animation
    IMAGES_COIN = [
        'img/img_pollo_locco/img/8_coin/coin_1.png',
        'img/img_pollo_locco/img/8_coin/coin_2.png',
    ];
    
    constructor() {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        
        // Zufällige Position innerhalb des Spielbereichs
        this.x = 200 + Math.random() * 2000; // X zwischen 200 und 2200
        this.y = 50 + Math.random() * 250;   // Y zwischen 50 und 300 (höher im Spiel)
        
        // Animation starten
        this.animate();
    }
    
    /**
     * Startet die Animation der Münze
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }
}