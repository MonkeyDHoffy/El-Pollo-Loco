/**
 * Health status bar that displays character health percentage
 * @extends DrawableObject
 */
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
  currentHealth = 100;

  /**
   * Creates a new health status bar
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_LIFEPOINTS);
    this.initializePosition();
    this.setPercentage(100);
  }

  /**
   * Sets up status bar position and dimensions
   */
  initializePosition() {
    this.x = 10;
    this.y = 0;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Updates health percentage and corresponding image
   * @param {number} percentage - Health percentage (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.currentHealth = percentage;
    let path = this.IMAGES_LIFEPOINTS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Draws status bar and health text
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  draw(ctx) {
    super.draw(ctx);
    this.drawHealthCount(ctx);
  }

  /**
   * Draws health percentage text on the status bar
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawHealthCount(ctx) {
    ctx.save();
    this.setupHealthTextStyle(ctx);
    this.renderHealthText(ctx);
    ctx.restore();
  }

  /**
   * Sets up text styling for health display
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  setupHealthTextStyle(ctx) {
    ctx.font = '28px Comic Sans MS';
    ctx.fillStyle = '#ff0000';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'left';
  }

  /**
   * Renders health text with outline
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  renderHealthText(ctx) {
    let text = `${this.currentHealth}%`;
    let textX = this.x + 60;
    let textY = this.y + 35;
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
  }

  /**
   * Determines which status bar image to display based on percentage
   * @returns {number} Image index for current health percentage
   */
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

/**
 * Coin status bar that displays collected coin count
 * @extends DrawableObject
 */
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

  /**
   * Creates a new coin status bar
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.initializePosition();
    this.setPercentage(0);
  }

  /**
   * Sets up coin status bar position and dimensions
   */
  initializePosition() {
    this.x = 10;
    this.y = 50;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Updates coin percentage and corresponding image
   * @param {number} percentage - Coin collection percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Sets the coin count for display
   * @param {number} count - Number of coins collected
   */
  setCoinCount(count) {
    this.coinCount = count;
  }

  /**
   * Draws status bar and coin count
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  draw(ctx) {
    super.draw(ctx);
    this.drawCoinCount(ctx);
  }

  /**
   * Draws coin count text on the status bar
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawCoinCount(ctx) {
    ctx.save();
    this.setupCoinTextStyle(ctx);
    this.renderCoinText(ctx);
    ctx.restore();
  }

  /**
   * Sets up text styling for coin display
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  setupCoinTextStyle(ctx) {
    ctx.font = '28px Comic Sans MS';
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'left';
  }

  /**
   * Renders coin count text with outline
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  renderCoinText(ctx) {
    let text = `x ${this.coinCount}`;
    let textX = this.x + 60;
    let textY = this.y + 35;
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
  }

  /**
   * Determines which status bar image to display based on percentage
   * @returns {number} Image index for current coin percentage
   */
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

/**
 * Bottle status bar that displays bottle inventory with max limit
 * @extends DrawableObject
 */
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
  bottleCount = 0;
  maxBottles = 10;

  /**
   * Creates a new bottle status bar
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.initializePosition();
    this.setPercentage(0);
  }

  /**
   * Sets up bottle status bar position and dimensions
   */
  initializePosition() {
    this.x = 10;
    this.y = 100;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Calculates percentage based on max 10 bottles
   * @param {number} bottleCount - Current bottle count
   */
  setPercentage(bottleCount) {
    this.percentage = (bottleCount / this.maxBottles) * 100;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Sets bottle count and updates percentage
   * @param {number} count - Number of bottles to set
   */
  setBottleCount(count) {
    this.bottleCount = Math.min(count, this.maxBottles);
    this.setPercentage(this.bottleCount);
  }

  /**
   * Draws status bar and bottle count
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  draw(ctx) {
    super.draw(ctx);
    this.drawBottleCount(ctx);
  }

  /**
   * Draws bottle count text on the status bar
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawBottleCount(ctx) {
    ctx.save();
    this.setupBottleTextStyle(ctx);
    this.renderBottleText(ctx);
    ctx.restore();
  }

  /**
   * Sets up text styling for bottle display
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  setupBottleTextStyle(ctx) {
    ctx.font = '28px Comic Sans MS';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'left';
  }

  /**
   * Renders bottle count text with outline
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  renderBottleText(ctx) {
    let text = `x ${this.bottleCount}`;
    let textX = this.x + 60;
    let textY = this.y + 35;   
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
  }

  /**
   * Determines which status bar image to display based on percentage
   * @returns {number} Image index for current bottle percentage
   */
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
