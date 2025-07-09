const level1 = new Level(
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
    [  // Clouds
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],
    [  // Background Objects - Extended for longer level
        // Far left extension
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", -1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", -1438),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", -1438),

        // Left section
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719),

        // Center sections
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
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 2157),

        // Extended sections for longer level
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 2876),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 3595),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 4314),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 4314),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 4314),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 4314),

        // Far right extension
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 5033),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 5752),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 5752),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 5752),
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
        new Coin()
    ],
    [  // Bottles - randomly placed
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle()
    ]
);