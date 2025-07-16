let canvas;
let world;
let startScreen;
let gameOver;
let keyboard = new Keyboard();
let gameStarted = false;
let mobileControls;

// Initialize the game
function init() {
    canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    
    // Setup responsive canvas and auto-fullscreen for mobile
    setupResponsiveCanvas();
    
    // Initialize mobile controls
    mobileControls = new MobileControls(canvas, ctx);
    window.keyboard = keyboard; // Make keyboard globally accessible for mobile controls
    window.mobileControls = mobileControls; // Make mobile controls globally accessible
    
    // Setup handling for user touch interactions to enable fullscreen
    if (isMobileDevice()) {
        // Add touch listener to go fullscreen on first touch
        document.addEventListener('touchstart', enableFullscreen, { once: true });
    }
    
    // Create start screen first
    startScreen = new StartScreen(canvas, ctx);
    
    // Create game over screen
    gameOver = new GameOver(canvas, ctx);
    
    // Set up start game callback
    window.onStartGame = function() {
        startGame();
    };
    
    // Set up game restart callback
    window.onGameRestart = function() {
        restartGame();
    };
    
    // Start the start screen loop
    startScreenLoop();
    
    console.log('[Game] Start screen initialized');
}

// Detect if device is mobile
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

// Request fullscreen function
function requestFullscreen() {
    const canvas = document.getElementById('canvas');
    const body = document.body;
    
    try {
        // Try document element first for better browser compatibility
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
                .catch(err => console.log('Fullscreen failed: ', err));
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } 
        // If document element doesn't work, try canvas
        else if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
                .catch(err => console.log('Canvas fullscreen failed: ', err));
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        } else {
            console.log('Fullscreen API not supported');
        }
    } catch (error) {
        console.log('Error trying to enter fullscreen: ', error);
    }
}

// Setup responsive canvas for different mobile sizes
function setupResponsiveCanvas() {
    function resizeCanvas() {
        const canvas = document.getElementById('canvas');
        const container = document.querySelector('.mexican-section');
        const mexicanTitle = document.querySelector('.mexican-title');
        const brownGround = document.getElementById('brownGround');
        
        // Get current viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isLandscape = viewportWidth > viewportHeight;
        const isMobile = isMobileDevice();
        
        if (isMobile) {
            // Hide the title and other elements on mobile for fullscreen experience
            if (mexicanTitle) mexicanTitle.style.display = 'none';
            if (brownGround) brownGround.style.display = 'none';
            
            // Make container full viewport
            if (container) {
                container.style.width = '100vw';
                container.style.height = '100vh';
                container.style.padding = '0';
                container.style.margin = '0';
            }
            
            // Always use fullscreen approach on mobile
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '9999';
            canvas.style.borderRadius = '0'; // Remove rounded corners for full-screen
            
            // Preserve aspect ratio by adding black bars if needed (letterboxing)
            const gameAspectRatio = 720 / 480; // Original game aspect ratio
            const screenAspectRatio = viewportWidth / viewportHeight;
            
            if (screenAspectRatio > gameAspectRatio) {
                // Screen is wider than game - add horizontal bars
                const gameHeight = viewportHeight;
                const gameWidth = gameHeight * gameAspectRatio;
                const horizontalPadding = (viewportWidth - gameWidth) / 2;
                
                canvas.style.width = gameWidth + 'px';
                canvas.style.height = viewportHeight + 'px';
                canvas.style.left = horizontalPadding + 'px';
            } else {
                // Screen is taller than game - add vertical bars
                const gameWidth = viewportWidth;
                const gameHeight = gameWidth / gameAspectRatio;
                const verticalPadding = (viewportHeight - gameHeight) / 2;
                
                canvas.style.width = viewportWidth + 'px';
                canvas.style.height = gameHeight + 'px';
                canvas.style.top = verticalPadding + 'px';
            }
            
            // Update mobile controls layout
            if (mobileControls) {
                mobileControls.updateLayout();
            }
            
            // Automatically request fullscreen on mobile
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.msFullscreenElement) {
                requestFullscreen();
            }
        } else {
            // Desktop: use original size
            canvas.style.width = '720px';
            canvas.style.height = '480px';
            canvas.style.position = 'relative';
            canvas.style.transform = 'none';
            canvas.style.borderRadius = '20px'; // Restore rounded corners
            
            // Show the title on desktop
            if (mexicanTitle) mexicanTitle.style.display = 'block';
            if (brownGround) brownGround.style.display = 'block';
        }
    }
    
    // Initial resize
    resizeCanvas();
    
    // Resize on window resize and orientation change
    window.addEventListener('resize', () => {
        setTimeout(resizeCanvas, 100);
    });
    window.addEventListener('orientationchange', () => {
        // Delay to ensure orientation change is complete
        setTimeout(resizeCanvas, 300);
    });
    
    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', resizeCanvas);
    document.addEventListener('webkitfullscreenchange', resizeCanvas);
    document.addEventListener('msfullscreenchange', resizeCanvas);
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

// Restart the game
function restartGame() {
    console.log('[Game] Restarting game...');
    
    // Reset game state completely
    gameStarted = false;
    
    // Clear existing world and intervals
    if (world) {
        world.isPaused = true; // Stop any ongoing processes
        world = null;
    }
    
    // Clear any existing level data
    if (typeof level1 !== 'undefined') {
        level1 = null;
    }
    
    // Small delay to ensure cleanup
    setTimeout(() => {
        // Re-initialize level completely
        initLevel1();
        console.log('[Game] Level re-initialized');
        
        // Create completely new world instance
        world = new World(canvas);
        world.isPaused = false; // Ensure game is not paused
        world.draw();
        
        // Set game as started
        gameStarted = true;
        
        console.log('[Game] Game restarted successfully');
    }, 100);
}

// Enable audio on first user interaction
function enableAudio() {
    if (world && world.backgroundMusic) {
        world.startBackgroundMusic();
    }
}

// Enable fullscreen on touch for mobile devices
function enableFullscreen() {
    if (isMobileDevice()) {
        setTimeout(() => {
            requestFullscreen();
            // Also call setupResponsiveCanvas to ensure proper sizing
            setupResponsiveCanvas();
        }, 300);
        
        // Enable audio at the same time
        enableAudio();
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