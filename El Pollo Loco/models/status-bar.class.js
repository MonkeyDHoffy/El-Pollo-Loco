class StatusBar extends DrawableObject {
  IMAGES_LIFEPOINTS = [
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES_LIFEPOINTS);
    this.x = 10;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_LIFEPOINTS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if(this.percentage == 100) {
      return 5;
    } else if(this.percentage >= 80) {
      return 4;
    } else if(this.percentage >= 60) { 
      return 3;
    } else if(this.percentage >= 40) {
      return 2;
    } else if(this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}

class CoinStatusBar extends DrawableObject {
  IMAGES_COINS = [
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.x = 10;
    this.y = 50; // Unterhalb der Health-Bar
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if(this.percentage == 100) {
      return 5;
    } else if(this.percentage >= 80) {
      return 4;
    } else if(this.percentage >= 60) { 
      return 3;
    } else if(this.percentage >= 40) {
      return 2;
    } else if(this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}

class BottleStatusBar extends DrawableObject {
  IMAGES_BOTTLE = [
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = 10;
    this.y = 100; // Unterhalb der Coin-Bar
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if(this.percentage == 100) {
      return 5;
    } else if(this.percentage >= 80) {
      return 4;
    } else if(this.percentage >= 60) { 
      return 3;
    } else if(this.percentage >= 40) {
      return 2;
    } else if(this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}