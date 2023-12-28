import TileMap2 from "./TileMapLevel2.js";

const tileSize = 32;
const velocity = 2; //pacman and enemies speed

let buttonChooseMap = document.getElementById("chooseMap");
let buttonReset = document.getElementById("retry");

//let score;
let showScore = document.getElementById("score");

const canvas2 = document.getElementById("gameCanvas2");
const ctx2 = canvas2.getContext("2d");
const tileMap2 = new TileMap2(tileSize);
const pacman2 = tileMap2.getPacman(velocity);
const enemies2 = tileMap2.getEnemies(velocity);

document.getElementById("retry").style.visibility = "hidden"; //set buttons to hidden while the game is on
document.getElementById("chooseMap").style.visibility = "hidden";

let gameOver = false;
let gameWin = false;

const gameOverSound = new Audio("./sounds/gameOver.wav");
const gameWinSound = new Audio("./sounds/gameWin.wav");


function gameLoop() {
    tileMap2.draw(ctx2);
    drawGameEnd();
    pacman2.draw(ctx2, pause(), enemies2);
    enemies2.forEach((enemy) => enemy.draw(ctx2, pause(), pacman2));
    calculateScore();
    checkGameOver();
    checkGameWin();
}

function loadMaps() {
    window.location.href = "./chooseLevel.html";
}

function resetLevel() {
    window.location.href = "./level2.html";
}

function calculateScore() {
    let result;
    result = showScore.innerHTML = tileMap2.score;
}

function checkGameWin() {
    if (!gameWin) {
        gameWin = tileMap2.didWin();
        if (gameWin) {
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
    return enemies2.some(
        (enemy) => !pacman2.powerDotActive && enemy.collideWith(pacman2)
    );
}

function pause() {
    return !pacman2.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
    if (gameOver || gameWin) {
        let text = "       You Win!";
        if (gameOver) {
            text = "      Game Over";
        }

        ctx2.fillStyle = "black";
        ctx2.fillRect(0, canvas2.height / 3.2, canvas2.width, 120);

        ctx2.font = "75px comic sans";
        const gradient = ctx2.createLinearGradient(0, 0, canvas2.width, 0);
        gradient.addColorStop("0", "green");

        gradient.addColorStop("1.0", "blue");

        ctx2.fillStyle = gradient;
        ctx2.fillText(text, 10, canvas2.height / 2);
    }
}

tileMap2.setCanvasSize(canvas2);
setInterval(gameLoop, 1000 / 75);