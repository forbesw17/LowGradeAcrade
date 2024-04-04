const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define game constants
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;
const ENEMY_WIDTH = 20;
const ENEMY_HEIGHT = 20;
const ENEMY_SPEED = 1;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const BULLET_SPEED = 5;

// Player object
const player = {
  x: canvas.width / 2 - PLAYER_WIDTH / 2,
  y: canvas.height - PLAYER_HEIGHT - 10,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
};

// Enemy object
const enemy = {
  x: 0,
  y: 0,
  width: ENEMY_WIDTH,
  height: ENEMY_HEIGHT,
};

// Bullet object
const bullets = [];

// Keyboard event listeners
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
    // Add spacebar key detection
    shootBullet();
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Prevent arrow keys & spacebar from scrolling the page
window.addEventListener('keydown', function(e) {
  if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', " "].includes(e.key)) {
      e.preventDefault();
  }
}, false);

const FIRE_RATE = 500; // Fire rate in milliseconds
let lastFireTime = 0; // Timestamp of the last bullet fired

function shootBullet() {
  // Check if enough time has passed since the last bullet was fired
  const currentTime = Date.now();
  if (currentTime - lastFireTime < FIRE_RATE) {
    return; // Don't shoot if fire rate limit is not reached
  }

  // Update last fire time
  lastFireTime = currentTime;

  // Create a new bullet
  var newBullet = {
    x: player.x + player.width / 2 - BULLET_WIDTH / 2,
    y: player.y,
    width: BULLET_WIDTH,
    height: BULLET_HEIGHT,
    visible: true
  };

  // Add the new bullet to the bullets array
  bullets.push(newBullet);
}

// Update game state
function update() {
  // Move player
  if (rightPressed && player.x < canvas.width - player.width) {
    player.x += PLAYER_SPEED;
  } else if (leftPressed && player.x > 0) {
    player.x -= PLAYER_SPEED;
  }

  // Move enemy
  enemy.x += ENEMY_SPEED;
  if (enemy.x > canvas.width) {
    enemy.x = 0;
    enemy.y += 30;
  }

  // Move bullets
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= BULLET_SPEED;
    // If the bullet is off the screen, remove it from the array
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }

  // Collision detection
  for (let i = 0; i < bullets.length; i++) {
    if (
      bullets[i].x < enemy.x + enemy.width &&
      bullets[i].x + bullets[i].width > enemy.x &&
      bullets[i].y < enemy.y + enemy.height &&
      bullets[i].y + bullets[i].height > enemy.y
    ) {
      bullets.splice(i, 1);
      enemy.x = 0;
      enemy.y = 0;
      break; // Exit loop after first collision
    }
  }
}

// Draw objects on canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw player image
  var playerImg = new Image();
  playerImg.src = "/static/images/space-invaders-assets/player.png";
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Draw enemy image
  var enemyImg = new Image();
  enemyImg.src = "/static/images/space-invaders-assets/enemy1.png";
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // Draw bullet image
  var bulletImg = new Image();
  bulletImg.src = "/static/images/space-invaders-assets/bullet.png";
  for (let i = 0; i < bullets.length; i++) {
    ctx.drawImage(bulletImg, bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
  }
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();