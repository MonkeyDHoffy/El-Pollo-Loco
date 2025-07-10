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
  coinCount = 0;

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

  setCoinCount(count) {
    this.coinCount = count;
  }

  draw(ctx) {
    super.draw(ctx);
    this.drawCoinCount(ctx);
  }

  drawCoinCount(ctx) {
    ctx.save();
    ctx.font = '28px Comic Sans MS';
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'left';
    
    let text = `x ${this.coinCount}`;
    let textX = this.x + 60;
    let textY = this.y + 35;
    
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
    ctx.restore();
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
  bottleCount = 0; // Track actual bottle count
  maxBottles = 10; // Maximum bottles character can carry

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = 10;
    this.y = 100; // Unterhalb der Coin-Bar
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  // Calculate percentage based on max 10 bottles
  setPercentage(bottleCount) {
    this.percentage = (bottleCount / this.maxBottles) * 100;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  // Set bottle count for display and update percentage
  setBottleCount(count) {
    this.bottleCount = Math.min(count, this.maxBottles); // Cap at max bottles
    this.setPercentage(this.bottleCount);
  }

  // Override draw method to include bottle count
  draw(ctx) {
    // Draw the status bar image
    super.draw(ctx);
    
    // Draw bottle count number
    this.drawBottleCount(ctx);
  }

  // Draw the bottle count number with max bottles info
  drawBottleCount(ctx) {
    ctx.save();
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.textAlign = 'left';
    
    let countText = `x${this.bottleCount}/${this.maxBottles}`;
    let textX = this.x + 10;
    let textY = this.y + this.height + 25;
    
    // Draw text outline
    ctx.strokeText(countText, textX, textY);
    // Draw text fill
    ctx.fillText(countText, textX, textY);
    
    ctx.restore();
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