const canvas = document.getElementById("gameCanvas");
console.log(canvas.style)
const ctx = canvas.getContext("2d");
const gridSize = 20;
const tileCount = canvas.width / gridSize;

const foodImg = new Image();
// foodImg.src = "../../images/python.jpg"; // replace with your image path

let snake = [{ x: 10, y: 10 }];
let score = 0;
let dx = 0;
let dy = 0;
let food = generateFood();

// function generateFood() {
//   return {
//     x: Math.floor(Math.random() * tileCount),
//     y: Math.floor(Math.random() * tileCount),
//   };
// }

function sendScoreToServer(score) {
  fetch('/submit_score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score: score }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Score submitted successfully:', data.message);
    // Optionally, you can handle the response from the server here
  })
  .catch(error => {
    console.error('Error submitting score:', error);
    // Optionally, you can handle errors here
  });
}

function generateFood() {
  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
      newFoodPosition = randomGridPosition();
  }
  return newFoodPosition;
}

function randomGridPosition() {
  return {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
  }
}

function onSnake(position) {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
}


function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  // ctx.drawImage(
  //   foodImg,
  //   food.x * gridSize,
  //   food.y * gridSize,
  //   gridSize,
  //   gridSize
  // );
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap around logic
  if (head.x < 0) head.x = tileCount - 1;
  else if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  else if (head.y >= tileCount) head.y = 0;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = generateFood();
  } else {
    snake.pop();
  }
}

function checkCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true; // collision with self
    }
  }
  return false;
}

function gameLoop() {
  if (checkCollision()) {
    // Game over message
    score = document.getElementById("score").innerText;
    sendScoreToServer(score);
    alert(`Game Over! ${score}.`);

    // Reset game
    score = 0;
    document.getElementById("score").innerText = "Score: 0";
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    food = generateFood();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  moveSnake();

  setTimeout(gameLoop, 40);
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
    case "ArrowUp":
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case "s":
    case "ArrowDown":
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case "a":
    case "ArrowLeft":
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case "d":
    case "ArrowRight":
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

window.addEventListener('keydown', function(e) {
  if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
  }
}, false);

gameLoop();
