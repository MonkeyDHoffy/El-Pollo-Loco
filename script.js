// Füge einen Event Listener für den Pause-Button hinzu
document.getElementById('pauseButton').addEventListener('keydown', function(event) {
    // Verhindere die Standard-Leertasten-Aktivierung für diesen Button
    if (event.code === 'Space') {
        event.preventDefault();
    }
});
