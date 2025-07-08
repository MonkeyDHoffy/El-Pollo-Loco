let canvas;
let world;
let keyboard = new Keyboard();

// Initialize the game
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas);
    world.draw();
    
    // Add click listener to enable audio on first user interaction
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
}

// Enable audio on first user interaction
function enableAudio() {
    if (world && world.backgroundMusic) {
        world.startBackgroundMusic();
    }
}

// Toggle pause function
function togglePause() {
    if (world) {
        world.togglePause();
        
        // Update button text and style
        const pauseButton = document.getElementById('pauseButton');
        if (world.isPaused) {
            pauseButton.textContent = 'RESUME';
            pauseButton.classList.add('paused');
        } else {
            pauseButton.textContent = 'PAUSE';
            pauseButton.classList.remove('paused');
        }
    }
}

// Toggle fullscreen function
function toggleFullscreen() {
    const canvas = document.getElementById('canvas');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const body = document.body;
    
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        
        // Calculate scale factor based on screen size
        const scaleX = window.screen.width / 720;
        const scaleY = window.screen.height / 480;
        const scaleFactor = Math.min(scaleX, scaleY) * 0.9; // 0.9 for some padding
        
        // Set CSS custom property for scale
        document.documentElement.style.setProperty('--scale-factor', scaleFactor);
        
        // Add fullscreen classes
        canvas.classList.add('fullscreen');
        body.classList.add('fullscreen-active');
        fullscreenButton.textContent = 'EXIT FULLSCREEN';
        fullscreenButton.classList.add('active');
        
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // Remove fullscreen classes
        canvas.classList.remove('fullscreen');
        body.classList.remove('fullscreen-active');
        fullscreenButton.textContent = 'FULLSCREEN';
        fullscreenButton.classList.remove('active');
        
        // Reset scale factor
        document.documentElement.style.setProperty('--scale-factor', '1');
    }
}

// Handle fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const canvas = document.getElementById('canvas');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const body = document.body;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // Exited fullscreen
        canvas.classList.remove('fullscreen');
        body.classList.remove('fullscreen-active');
        fullscreenButton.textContent = 'FULLSCREEN';
        fullscreenButton.classList.remove('active');
        
        // Reset scale factor
        document.documentElement.style.setProperty('--scale-factor', '1');
    }
}

// Handle escape key to exit fullscreen
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.fullscreenElement) {
        toggleFullscreen();
    }
});

// Event listener for debugging keyboard events
window.addEventListener('keypress', (event) => {
    console.log(event);
});