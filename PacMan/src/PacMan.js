import MovingDirection from "./MovingDirection.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    // Set the current and requested moving directions of Pacman, initially null
    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    // Set the timer for Pacman's animation
    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    // Set Pacman's initial rotation direction to right
    this.pacmanRotation = this.Rotation.right;

    // Load the sounds for Pacman
    this.wakaSound = new Audio("sounds/waka.wav");
    this.powerDotSound = new Audio("sounds/power_dot.wav");

    // Set the timers for power-ups
    this.powerDotActive = false;
    this.powerDotAboutToExpire = false;
    this.timers = [];

    this.eatGhostSound = new Audio("sounds/eat_ghost.wav");

    this.madeFirstMove = false;

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  // Define an enum, which maps rotation directions to numeric values
  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  // Draw Pacman on the canvas
  draw(ctx, pause, enemies) {
    // If the game is not paused, move Pacman and animate the changes
    if (!pause) {
      this.#move();
      this.#animate();
    }

    this.#eatDot();
    this.#eatPowerDot();
    this.#eatGhost(enemies);

    const size = this.tileSize / 2;

    // Save the current context
    ctx.save();
    // Move the origin to Pacman's position
    ctx.translate(this.x + size, this.y + size);
    // Rotate the context according to Pacman's current rotation direction
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    // Draw the current Pacman image on the canvas
    ctx.drawImage(this.pacmanImages[this.pacmanImageIndex],-size,-size,this.tileSize,this.tileSize);
    // Restore the previous context
    ctx.restore();

    // ctx.drawImage(
    //   this.pacmanImages[this.pacmanImageIndex],
    //   this.x,
    //   this.y,
    //   this.tileSize,
    //   this.tileSize
    // );
  }

  // Loads Pacman's four animation images into images array.
  #loadPacmanImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = "images/pac0.png";

    const pacmanImage2 = new Image();
    pacmanImage2.src = "images/pac1.png";

    const pacmanImage3 = new Image();
    pacmanImage3.src = "images/pac2.png";

    const pacmanImage4 = new Image();
    pacmanImage4.src = "images/pac1.png";

    this.pacmanImages = [pacmanImage1,pacmanImage2,pacmanImage3,pacmanImage4,];

    this.pacmanImageIndex = 0;
  }

  // According to the keydown event, set the requested moving direction of Pacman.
  #keydown = (event) => {
     // If the up arrow key is pressed, Pacman's requested move is up unless he is already moving down.
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
        this.requestedMovingDirection = MovingDirection.up;
        this.madeFirstMove = true;
    }
    // If the down arrow key is pressed, Pacman's requested move is down unless he is already moving up.
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
        this.requestedMovingDirection = MovingDirection.down;
        this.madeFirstMove = true;
    }
    // If the left arrow key is pressed, Pacman's requested move is left unless he is already moving right.
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
        this.requestedMovingDirection = MovingDirection.left;
        this.madeFirstMove = true;
    }
     // If the right arrow key is pressed, Pacman's requested move is right unless he is already moving left.
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
        this.requestedMovingDirection = MovingDirection.right;
        this.madeFirstMove = true;
    }
  };


  // If Pacman is currently moving in a different direction than his requested, check if the requested direction collides with wall before updating his direction.
  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) {
        if (!this.tileMap.didCollideWithEnvironment(this.x,this.y,this.requestedMovingDirection))
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    // If Pacman collides with wall in his current direction, sets the animation timer to null and loads the "mouth-closed" image.
    if (this.tileMap.didCollideWithEnvironment(this.x,this.y,this.currentMovingDirection)) {
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 1;
      return;
    }else if(this.currentMovingDirection != null && this.pacmanAnimationTimer == null) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

     // Updates Pacman's position and rotation based on his current moving direction.
    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.pacmanRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.pacmanRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.pacmanRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.pacmanRotation = this.Rotation.right;
        break;
    }
  }

  // Handles Pacman's animation and switches between his four animation images based on the current animation timer.
  #animate() {
    if (this.pacmanAnimationTimer == null) {
      return;
    }
    this.pacmanAnimationTimer--;
    // If the animation timer reaches 0, update the current image index and reset the timer to the default value.
    if (this.pacmanAnimationTimer == 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex++;
      if (this.pacmanImageIndex == this.pacmanImages.length)
        this.pacmanImageIndex = 0;
    }
  }

  // Check if Pacman has eaten a dot, if yes play the waka sound
  #eatDot() {
    if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
      this.wakaSound.play();
    }
  }

  // Check if Pacman has eaten a power dot, if yes activate power mode and set timers
  #eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotSound.play();
      this.powerDotActive = true;
      this.powerDotAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
      }, 1000 * 6);

      this.timers.push(powerDotTimer);

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotAboutToExpire = true;
      }, 1000 * 3);

      this.timers.push(powerDotAboutToExpireTimer);
    }
  }

  // Check if Pacman has eaten a ghost, if yes kill the ghost and play the eat ghost sound
  #eatGhost(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatGhostSound.play();
      });
    }
  }
}