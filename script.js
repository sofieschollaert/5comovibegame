const obstacle = document.getElementById("obstacle");
const scoreBoard = document.getElementById("score-board");
const livesBoard = document.getElementById("lives-count");
const message = document.getElementById("message");
const container = document.getElementById("game-container");

let score = 0;
let lives = 5;
let isGameOver = true;
let posX = -60;
let speed = 4;

// De 4 Categorieën gekoppeld aan toetsen
const products = [
  // FRUIT (Links)
  { emoji: "🍎", val: 2, key: "ArrowLeft" },
  { emoji: "🍌", val: 2, key: "ArrowLeft" },
  { emoji: "🍓", val: 3, key: "ArrowLeft" },
  // DRANK (Omhoog)
  { emoji: "🍾", val: 15, key: "ArrowUp" },
  { emoji: "🥤", val: 2, key: "ArrowUp" },
  { emoji: "☕", val: 3, key: "ArrowUp" },
  // KANTOOR (Omlaag)
  { emoji: "✂️", val: 5, key: "ArrowDown" },
  { emoji: "📝", val: 1, key: "ArrowDown" },
  { emoji: "💻", val: 50, key: "ArrowDown" },
  // KLEDING (Rechts)
  { emoji: "👕", val: 20, key: "ArrowRight" },
  { emoji: "👗", val: 35, key: "ArrowRight" },
  { emoji: "👟", val: 40, key: "ArrowRight" }
];

let currentProduct = products[0];

function updateLives() {
  let h = "";
  for(let i=0; i<lives; i++) h += "❤️";
  livesBoard.innerHTML = h || "GEEN";
}

function spawn() {
  currentProduct = products[Math.floor(Math.random() * products.length)];
  obstacle.innerHTML = currentProduct.emoji;
  posX = -60;
}

function gameLoop() {
  if (isGameOver) return;
  posX += speed;
  obstacle.style.left = posX + "px";

  if (posX > 620) {
    loseLife();
    spawn();
  }
  requestAnimationFrame(gameLoop);
}

function loseLife() {
  lives--;
  updateLives();
  flash("flash-red");
  if (lives <= 0) endGame();
}

function flash(cls) {
  container.classList.add(cls);
  setTimeout(() => container.classList.remove(cls), 150);
}

document.addEventListener("keydown", function(e) {
  const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  
  if (isGameOver && validKeys.includes(e.key)) {
    startGame();
    return;
  }

  if (!isGameOver && validKeys.includes(e.key)) {
    // Scan-venster: tussen 400px en 500px vanaf links
    if (posX > 390 && posX < 510) {
      if (e.key === currentProduct.key) {
        score += currentProduct.val;
        scoreBoard.innerHTML = "Kassa: " + score + " Euro";
        flash("flash-green");
        speed += 0.15; // Iets sneller bij elke goede scan
        spawn();
      } else {
        loseLife(); // Verkeerde categorie
        spawn();
      }
    } else {
      loseLife(); // Te vroeg of te laat gedrukt
      spawn();
    }
  }
});

function endGame() {
  isGameOver = true;
  message.style.display = "block";
  message.innerHTML = "KASSA GEBLOKKEERD!<br>Dagomzet: " + score + " Euro<br>Druk een pijltoets";
}

function startGame() {
  score = 0;
  lives = 5;
  speed = 4;
  isGameOver = false;
  message.style.display = "none";
  scoreBoard.innerHTML = "Kassa: 0 Euro";
  updateLives();
  spawn();
  gameLoop();
}