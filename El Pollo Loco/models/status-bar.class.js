class StatusBar extends DrawableObject {

  IMAGES_LIFEPOINTS = [
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
  ];

  IMAGES_COINS = [
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/coin/0.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/coin/20.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/coin/40.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/coin/60.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/coin/80.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/coin/100.png'
  ];

  IMAGES_BOTTLE = [
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/bottle/0.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/bottle/20.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/bottle/40.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/bottle/60.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/bottle/80.png',
    'img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/bottle/100.png'
  ];

  percentage = 100; // Lebenspunkte in Prozent

  constructor() {
    super();
    this.loadImages(this.IMAGES_LIFEPOINTS);
    this.x = 10;
    this.y = 0;
    this.width = 200; // Breite der Statusleiste
    this.height = 60; // Höhe der Statusleiste
    this.setPercentage(100); // Setzt die Lebenspunkte auf 100%
  }

  setPercentage(percentage,value) {
    this.percentage = percentage;
    let images;
    if (value === 'coins') {
      images = this.IMAGES_COINS;
    } else if (value === 'bottle') {
      images = this.IMAGES_BOTTLE;
    } else {
      images = this.IMAGES_LIFEPOINTS;
    }
    let path = images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if(this.percentage == 100) {
      return 5; // 100% Lebenspunkte
    } else if(this.percentage >= 80) {
      return 4; // 80% Lebenspunkte
    } else if(this.percentage >= 60) { 
      return 3; // 60% Lebenspunkte
    } else if(this.percentage >= 40) {
      return 2; // 40% Lebenspunkte
    } else if(this.percentage >= 20) {
      return 1; // 20% Lebenspunkte
    } else {
      return 0; // 0% Lebenspunkte
    }
  }
}