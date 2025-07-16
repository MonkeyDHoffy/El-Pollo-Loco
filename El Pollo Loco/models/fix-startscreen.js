// Touch event handler für StartScreen
function addTouchSupportToStartScreen() {
    // Referenz zum StartScreen-Objekt
    const startScreen = window.startScreen;
    
    if (!startScreen) {
        console.error('StartScreen object not found');
        return;
    }
    
    console.log('Adding touch support to StartScreen');
    
    // Touch-Handler hinzufügen
    const touchHandler = function(event) {
        if (!startScreen.isActive) return;
        event.preventDefault();
        
        const rect = startScreen.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // Koordinaten skalieren, wenn Canvas skaliert ist
        const scaleX = startScreen.canvas.width / rect.width;
        const scaleY = startScreen.canvas.height / rect.height;
        const scaledX = touchX * scaleX;
        const scaledY = touchY * scaleY;
        
        console.log('Touch at:', scaledX, scaledY);
        console.log('Button:', startScreen.playButtonX, startScreen.playButtonY, 
                   startScreen.playButtonWidth, startScreen.playButtonHeight);
        
        // Prüfen, ob Touch auf dem Play-Button ist
        if (scaledX >= startScreen.playButtonX && 
            scaledX <= startScreen.playButtonX + startScreen.playButtonWidth &&
            scaledY >= startScreen.playButtonY && 
            scaledY <= startScreen.playButtonY + startScreen.playButtonHeight) {
            console.log('Play Button touched! Starting game...');
            
            // Original startGame-Methode aufrufen
            if (typeof startScreen.startGame === 'function') {
                startScreen.startGame();
            } else if (window.onStartGame) {
                // Falls startGame nicht existiert, direkt onStartGame aufrufen
                window.onStartGame();
            }
        }
    };
    
    // Event-Listener für Touch hinzufügen
    startScreen.canvas.addEventListener('touchstart', touchHandler, { passive: false });
    
    console.log('Touch support added successfully');
}

// Funktion beim Laden ausführen
document.addEventListener('DOMContentLoaded', function() {
    // Kurze Verzögerung, um sicherzustellen, dass StartScreen geladen wurde
    setTimeout(addTouchSupportToStartScreen, 500);
});
