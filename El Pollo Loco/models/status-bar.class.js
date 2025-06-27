class StatusBar extends DrawableObject {

  IMAGES_LIFEPOINTS = [
    'El Pollo Loco/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
    'El Pollo Loco/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
    'El Pollo Loco/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
    'El Pollo Loco/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
    'El Pollo Loco/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
    'El Pollo Loco/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
  ];

  percentage = 100; // Lebenspunkte in Prozent

  constructor() {
    super();
    this.loadImages(this.IMAGES_LIFEPOINTS);
    this.x = 10;
    this.y = 10;
    this.width = 200; // Breite der Statusleiste
    this.height = 60; // Höhe der Statusleiste
    this.setPercentage(100); // Setzt die Lebenspunkte auf 100%
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let imagePath = this.IMAGES_LIFEPOINTS[this.resolveImageIndex()];
    this.img = this.imageCache[imagePath];
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