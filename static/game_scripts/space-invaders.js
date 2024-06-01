const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// function sendScoreToServer(score) {
//   let userInput = prompt("Enter your initals:");
  
//   fetch('/submit_score', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ score: score, title: "space-invaders", username: userInput || "Anonymous"}),
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log('Score submitted successfully:', data.message);
//     // Optionally, you can handle the response from the server here
//   })
//   .catch(error => {
//     console.error('Error submitting score:', error);
//     // Optionally, you can handle errors here
//   });
// }

 
// Game constants
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;
const ENEMY_WIDTH = 20;
const ENEMY_HEIGHT = 20;
const ENEMY_SPEED = 1;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const BULLET_SPEED = 10;
 
let score = 0;
let enemyCount = 1;
let gameOver = false;  // Game over state
 
const player = {
  x: canvas.width / 2 - PLAYER_WIDTH / 2,
  y: canvas.height - PLAYER_HEIGHT - 10,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
};
 
const enemies = [];
const bullets = [];
const enemyBullets = [];
 
function initEnemies() {
  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: i * ENEMY_WIDTH * 2,
      y: 0,
      width: ENEMY_WIDTH,
      height: ENEMY_HEIGHT,
    });
  }
}
initEnemies();
 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
 
let rightPressed = false;
let leftPressed = false;
 
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === " " || e.key === "Spacebar") {
    shootBullet(player.x + player.width / 2 - BULLET_WIDTH / 2, player.y, -BULLET_SPEED);
  }
}
 
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}
 
window.addEventListener('keydown', function(e) {
  if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', " "].includes(e.key)) {
    e.preventDefault();
  }
}, false);
 
const FIRE_RATE = 300;
let lastFireTime = 0;
 
function shootBullet(x, y, speed) {
  const currentTime = Date.now();
  if (currentTime - lastFireTime < FIRE_RATE) {
    return;
  }
  lastFireTime = currentTime;
  bullets.push({ x, y, width: BULLET_WIDTH, height: BULLET_HEIGHT, speed: speed });
}
 
function enemiesShoot() {
  enemies.forEach(enemy => {
    if (Math.random() < 0.01) {
      enemyBullets.push({
        x: enemy.x + enemy.width / 2 - BULLET_WIDTH / 2,
        y: enemy.y + enemy.height,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        speed: BULLET_SPEED
      });
    }
  });
}
 
function update() {
  if (gameOver) return;  // Stop updating if game is over
 
  if (rightPressed && player.x < canvas.width - player.width) {
    player.x += PLAYER_SPEED;
  } else if (leftPressed && player.x > 0) {
    player.x -= PLAYER_SPEED;
  }
 
  enemies.forEach(enemy => {
    enemy.x += ENEMY_SPEED;
    if (enemy.x > canvas.width) {
      enemy.x = 0;
      enemy.y += 30;
      if (enemy.y > canvas.height) {
        enemy.y = 0;
        enemyCount *= 2;
        initEnemies();
      }
    }
  });
 
  bullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;
    if (bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(index, 1);
    }
  });
 
  enemyBullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;
    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });
 
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        score++;
        document.getElementById("score").innerText = score;
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        if (enemies.length === 0) {
          enemyCount *= 2;
          initEnemies();
        }
      }
    });
  });
 
  enemyBullets.forEach((bullet, index) => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      console.log("Player hit!");
      gameOver = true;  // Set game over state
      enemyBullets.splice(index, 1);
    }
  });
 
  enemiesShoot();
}
 
function draw() {
  if (gameOver) return;  // Stop drawing if game is over
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  var playerImg = new Image();
  playerImg.src = "/static/images/space-invaders-assets/player.png";
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
 
  var enemyImg = new Image();
  enemyImg.src = "/static/images/space-invaders-assets/enemy1.png";
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
  });
 
  var bulletImg = new Image();
  bulletImg.src = "/static/images/space-invaders-assets/bullet.png";
  bullets.forEach(bullet => {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });
 
  enemyBullets.forEach(bullet => {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });
}
 
function resetGame() {
  score = 0;
  document.getElementById("score").innerText = score;
  enemyCount = 1;
  gameOver = false;
  player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
  player.y = canvas.height - PLAYER_HEIGHT - 10;
  bullets.length = 0;
  enemyBullets.length = 0;
  enemies.length = 0;
  initEnemies();
}

function showGameOverMessage() {
  
  // sendScoreToServer(score);
  // You can replace this with your preferred toast message implementation
  alert("Game Over! Score: " + score);

  // Reset the game after showing the message
  resetGame();
}

function gameLoop() {
  update();
  draw();
  if (gameOver) {
    showGameOverMessage();
    gameLoop();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

 
gameLoop();
