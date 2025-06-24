class Coin extends MovableObject {
heigt = 30;
width = 30;

IMAGE_COIN = [
    'El Pollo Loco/img/img_pollo_locco/img/8_coin/coin_1.png',
    'El Pollo Loco/img/img_pollo_locco/img/8_coin/coin_2.png',
];

    constructor() {
        super();
        this.loadImage(this.IMAGE_COIN);
      
    }
}