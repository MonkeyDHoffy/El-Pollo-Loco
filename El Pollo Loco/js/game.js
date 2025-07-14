let canvas;
let world;
let startScreen;
let keyboard = new Keyboard();
let gameStarted = false;

// Initialize the game
function init() {
    canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    
    // Create start screen first
    startScreen = new StartScreen(canvas, ctx);
    
    // Set up start game callback
    window.onStartGame = function() {
        startGame();
    };
    
    // Start the start screen loop
    startScreenLoop();
    
    console.log('[Game] Start screen initialized');
}

// Start screen animation loop
function startScreenLoop() {
    if (startScreen && startScreen.isStartScreenActive()) {
        startScreen.update();
        startScreen.draw();
        requestAnimationFrame(startScreenLoop);
    }
}

// Start the actual game
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    console.log('[Game] Starting main game...');
    
    // Hide start screen
    if (startScreen) {
        startScreen.hide();
    }
    
    // Initialize level first
    initLevel1();
    console.log('[Game] Level initialized');
    
    // Initialize world and start game
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
    // Don't allow pause if game hasn't started yet
    if (!gameStarted || !world) return;
    
    if (world) {
        world.togglePause();
        
        // Update button text and style
        let pauseButton = document.getElementById('pauseButton');
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
    let canvas = document.getElementById('canvas');
    let fullscreenButton = document.getElementById('fullscreenButton');
    let body = document.body;
    
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
        let scaleX = window.screen.width / 720;
        let scaleY = window.screen.height / 480;
        let scaleFactor = Math.min(scaleX, scaleY) * 0.9; // 0.9 for some padding
        
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
    let canvas = document.getElementById('canvas');
    let fullscreenButton = document.getElementById('fullscreenButton');
    let body = document.body;
    
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