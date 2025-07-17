/**
 * Prevents default spacebar behavior for the pause button
 */
document.getElementById('pauseButton').addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
    }
});
