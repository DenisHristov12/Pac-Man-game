import TileMap from "./TileMapLevel4.js"; //importing the maps we work with

const tileSize = 32;
const velocity = 2; //pacman and enemies speed

let buttonChooseMap = document.getElementById("chooseMap");
let buttonReset = document.getElementById("retry");

let showScore = document.getElementById("score");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize); //creating new map
const pacman = tileMap.getPacman(velocity); //creating pacman
const enemies = tileMap.getEnemies(velocity); //creating enemies

document.getElementById("retry").style.visibility = "hidden"; //set buttons to hidden while the game is on
document.getElementById("chooseMap").style.visibility = "hidden";

let gameOver = false;
let gameWin = false;

//sounds
const gameOverSound = new Audio("./sounds/gameOver.wav");
const gameWinSound = new Audio("./sounds/gameWin.wav");


// game function
function gameLoop() {
  tileMap.draw(ctx); //drawing map, pacman and the enemies
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  drawGameEnd(); //drawing game end
  calculateScore();
  checkGameOver();
  checkGameWin();
}

function loadMaps() {
  window.location.href = "./chooseLevel.html";
}

function resetLevel() {
  window.location.href = "./level4.html";
}

function calculateScore() {
  let result;
  result = showScore.innerHTML = tileMap.score;
}

function checkGameWin() {
  if (!gameWin) { //if gameWin is true we chek if there is any dots on the map
    gameWin = tileMap.didWin();
    if (gameWin) { //if there isn't we play sound
      gameWinSound.play();

      document.getElementById("chooseMap").style.visibility = "visible";

      buttonChooseMap.onclick = function () {
        loadMaps();
      };
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();

      document.getElementById("retry").style.visibility = "visible";

      buttonReset.onclick = function () {
        resetLevel();
      };
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman) //checks if whatever enemy colides with pacman when he hasnt eaten powerDot
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin; //until we start moving pacman the game is paused. It's also paused if we lose or we win
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "       You Win!";
    if (gameOver) {
      text = "      Game Over";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 120);

    ctx.font = "75px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "green");

    gradient.addColorStop("1.0", "blue");

    ctx.fillStyle = gradient;
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);