function checkOrientation() {
    const isMobile = window.innerWidth <= 768;
    const isPortrait = window.innerHeight > window.innerWidth;
    const orientationOverlay = document.getElementById('orientation-message');

    if (isMobile && isPortrait) {
        // Mobile in portrait - show orientation message
        orientationOverlay.style.display = 'flex';
    } else {
        // Desktop or mobile in landscape - hide orientation message
        orientationOverlay.style.display = 'none';
    }
}

// Check orientation on load and resize
document.addEventListener('DOMContentLoaded', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 100); // Small delay for orientation change
});
