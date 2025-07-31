function checkOrientation() {
    let isMobile = window.innerWidth <= 768;
    let isPortrait = window.innerHeight > window.innerWidth;
    let orientationOverlay = document.getElementById('orientation-message');

    if (isMobile && isPortrait) {
        orientationOverlay.style.display = 'flex';
    } else {
        orientationOverlay.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 100);
});
