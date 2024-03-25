const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define game constants
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
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

function shootBullet() {
  if (!bullet.visible) {
    bullet.x = player.x + player.width / 2 - BULLET_WIDTH / 2;
    bullet.y = player.y;
    bullet.visible = true;
  }
}

// Enemy object
const enemy = {
  x: 0,
  y: 0,
  width: ENEMY_WIDTH,
  height: ENEMY_HEIGHT,
};

// Bullet object
const bullet = {
  x: 0,
  y: 0,
  width: BULLET_WIDTH,
  height: BULLET_HEIGHT,
  visible: false,
};

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

  // Fire bullet
  if (bullet.visible) {
    bullet.y -= BULLET_SPEED;
    if (bullet.y < 0) {
      bullet.visible = false;
    }
  }

  // Collision detection
  if (
    bullet.visible &&
    bullet.x < enemy.x + enemy.width &&
    bullet.x + bullet.width > enemy.x &&
    bullet.y < enemy.y + enemy.height &&
    bullet.y + bullet.height > enemy.y
  ) {
    bullet.visible = false;
    enemy.x = 0;
    enemy.y = 0;
  }
}

// Draw objects on canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();

  if (bullet.visible) {
    ctx.beginPath();
    ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
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
