let level1;

/**
 * Initializes level 1 with all game objects including enemies, backgrounds, collectibles and obstacles
 */
function initLevel1() {

level1 = new Level(
    [  // Enemies
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new MiniChicken(),
        new MiniChicken(),
        new MiniChicken(),
        new MiniChicken()
    ],
    [  // Endbosses
        new Endboss(0),
        new Endboss(1)
    ],
    [  // Clouds - more clouds with wider distribution
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],
    [  // Background Objects - Grouped by layers for proper Z-ordering
        // === AIR LAYER (ganz hinten) ===
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 4314),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 5752),

        // === THIRD LAYER (dahinter) ===
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", -1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 4314),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 5752),

        // === SECOND LAYER (davor) ===
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", -1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 4314),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 5752),

        // === FIRST LAYER (ganz vorne - lückenlos nebeneinander) ===
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", -1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 4314),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 5752)
    ],
    [  // Coins - randomly placed
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin()
    ],
    [  // Bottles - randomly placed
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),   
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle()
    ],
    [  // Cacti - at beginning and end of level
        new Cactus(-125),  // Beginning of level
        new Cactus(4430)
    ]
);}
