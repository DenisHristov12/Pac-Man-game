import MovingDirection from "./MovingDirection.js";

export default class Enemy {  //export class so we can use it in other files
  constructor(x, y, tileSize, velocity, tileMap) {  
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    // Private methods used to set the enemy's image and move it around the map
    this.#loadImages();

    // Set the initial direction for the enemy
    this.movingDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);

    // Set up timers for changing direction when the enemy hits an obstacle or a period of time elapses
    this.directionTimerDefault = this.#random(10, 25);
    this.directionTimer = this.directionTimerDefault;

    // Set up a timer for changing the enemy's image when it is blue (due to the pacman eating a power dot)
    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
  }

  draw(ctx, pause, pacman) {
    if (!pause) {  // Only move and change direction if the game is not paused 
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, pacman);
  }

  // check if pacman colides with enemy
  collideWith(pacman) {
    const size = this.tileSize / 2;
    if (this.x < pacman.x + size && this.x + size > pacman.x && this.y < pacman.y + size && this.y + size > pacman.y) {
      return true;
    }else{
      return false;
    }
  }

  // Set the enemy's image, depending on whether pacman character has picked up a power dot
  #setImage(ctx, pacman) {
    if (pacman.powerDotActive) {
      this.#setImageWhenPowerDotIsActive(pacman);
    }else{
      this.image = this.normalGhost;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #setImageWhenPowerDotIsActive(pacman) {
    if (pacman.powerDotAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if (this.image === this.scaredGhost) {
          this.image = this.scaredGhost2;
        }else{
          this.image = this.scaredGhost;
        }
      }
    }else{
      this.image = this.scaredGhost;
    }
  }

  // Change the direction the enemy is moving in
  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) {
        if (!this.tileMap.didCollideWithEnvironment(this.x,this.y,newMoveDirection)) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  // If the enemy can move in the current direction without colliding with the environment, move it in that direction
  #move() {
    if (!this.tileMap.didCollideWithEnvironment(this.x,this.y,this.movingDirection)) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
      }
    }
  }

  // Generate a random integer between min and max (inclusive)
  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Loads the images for the enemies, including their normal and scared state images (along with a second scared image for animation purposes)
  #loadImages() {
    this.normalGhost = new Image();
    this.normalGhost.src = "./images/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "./images/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "./images/scaredGhost2.png";

    this.image = this.normalGhost;
  }
}