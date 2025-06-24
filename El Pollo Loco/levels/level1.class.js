const level1 = new Level(
    [  // Enemies Array
        new Chicken(),
        new Chicken(),
        new Chicken()
    ],
    [  // Endbosse als Array (bisher ein einzelnes Objekt)
        new Endboss(0),  // Erster Boss, weit rechts
        new Endboss(1)   // Zweiter Boss, etwas weiter links
    ],
    [  // Clouds Array
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],
    // Backgroundobjects bleiben unverändert
    [
        // Links (negativ)
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719),

        // Original
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

        // Rechts (weiter)
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 2157),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 2157)
    ]
);