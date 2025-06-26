const level1 = new Level(
    [  // Enemies
        new Chicken(),
        new Chicken(),
        new Chicken()
    ],
    [  // Endbosses
        new Endboss(0),
        new Endboss(1)
    ],
    [  // Clouds
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],
    [  // Background Objects
        // Left section
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719),

        // Center section
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 1438),

        // Right section
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 2157)
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
        new Coin()
    ]
);