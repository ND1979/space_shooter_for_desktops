var gameStarted = false;

var starfield; 
var starX = 0; 
var starY = 0; 
var starY2 = -600;

var lives = 3;

var alive = true;

var enemyTotal = 500;
var enemies = [];
var enemy_x = 20;
var enemy_y = -101;
var enemy_w = 25;
var enemy_h = 25;
var speed = 3;

var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;

var canvas;
var ctx;
var width = 600;
var height = 600;

var enemy; 
var ship;
var laserTotal = 1000; 
var lasers = [];

var score = 0;

var ship_x = (width / 2) - 25;
var ship_y = height - 75;
var ship_w = 30;
var ship_h = 30;

for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 30;
}

function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

function drawShip() {
	if (rightKey) ship_x += 5;
	else if (leftKey) ship_x -= 5;
	if (upKey) ship_y -= 5;
	else if (downKey) ship_y += 5;
	if (ship_x <= 0) ship_x = 0;
	if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
	if (ship_y <= 0) ship_y = 0;
	if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
	ctx.drawImage(ship, ship_x, ship_y);
}

function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');//get canvas rendering context nd
	enemy = new Image();
  enemy.src = 'http://i63.tinypic.com/2eyko5x.png';
  ship = new Image();
  ship.src = 'http://i64.tinypic.com/wthyj7.png';
	starfield = new Image();
	starfield.src = 'http://i68.tinypic.com/k15gk8.jpg';
  //setInterval(gameLoop, 25);
	document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
	canvas.addEventListener('click', gameStart, false);
	gameLoop();
}

function gameLoop() {
  clearCanvas();
	drawStarfield();
  if (alive && gameStarted && lives > 0) {
    hitTest();
    shipCollision();
    moveLaser();
    moveEnemies();
    drawEnemies();
    drawShip();
    drawLaser();  
	}
  scoreTotal();
	setTimeout(gameLoop, 1000 / 30);
	
}

function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
  if (e.keyCode == 38) upKey = true;
  else if (e.keyCode == 40) downKey = true;
	
	if (e.keyCode == 88 && lasers.length <= laserTotal) lasers.push([ship_x + 11, ship_y + 8, 5, 17]);
	
}

function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
  if (e.keyCode == 38) upKey = false;
  else if (e.keyCode == 40) downKey = false;
}

function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
		ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
		
	}
}

function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
		if (enemies[i][1] < height) {
			enemies[i][1] += enemies[i][4];
			
			enemies[i][0] -= enemies[i][2] * 0.3;
			} else if (enemies[i][1] > height) {
			enemies[i][1] = - 20;
			enemies[i][0] = 850;
		}
	}
}

function drawLaser() {
  if (lasers.length)
	for (var i = 0; i < lasers.length; i++) {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
	}
}

function moveLaser() {
  for (var i = 0; i < lasers.length; i++) {
		if (lasers[i][1] > -6) {
			lasers[i][1] -= 20;
			} else if (lasers[i][1] < -6) {
			lasers.splice(i, 1);
		}
	}
}

function hitTest() {
  var remove = false;
  for (var i = 0; i < lasers.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
        remove = true;
        enemies.splice(j, 1);
				score += 10;
				enemies.push([(Math.random() * 600), -26, enemy_w, enemy_h, speed]);
			}
		}
    if (remove == true) {
      lasers.splice(i, 1);
      remove = false;
		}
	}
}

function checkLives() {
	lives -= 1;
	if (lives > 0) {
		reset();
		} else 
	if (lives == 0) {
		alive = false;
	}
}

function scoreTotal() {
  ctx.font = 'bold 20px VT323';
  ctx.fillStyle = '#ffffff';
	ctx.fillText('Score: '     , 10, 55);
	ctx.fillText(score         , 70, 55);
	ctx.fillText('Lives:'      , 10, 30);
	ctx.fillText(lives         , 68, 30);

	if (!alive) {
		ctx.fillText('Game Over!', 245, height / 2);
		ctx.fillRect((width / 2) - 60, (height / 2) + 10,100,40);
		ctx.fillStyle = '#000';
		ctx.fillText('Continue?', 250, (height / 2) + 35);
		canvas.addEventListener('click', continueButton, false);
	}
	if (!gameStarted) {
		ctx.font = 'bold 50px VT323';
		ctx.fillText('Silver Worlds', width / 2 - 150, height / 2);
		ctx.font = 'bold 20px VT323';
		ctx.fillText('Left-click on mouse to play', width / 2 - 135, height / 2 + 30);
		ctx.fillText('Use arrow keys to move', width / 2 - 135, height / 2 + 60);
		ctx.fillText('Use the x key to shoot', width / 2 - 135, height / 2 + 90);
	}
}

function shipCollision() {
  var ship_xw = ship_x + ship_w;
	var ship_yh = ship_y + ship_h;
  for (var i = 0; i < enemies.length; i++) {
    if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
			checkLives();
		}
    if (ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
			checkLives();
		}
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w) {
			checkLives();
		}
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0]) {
			checkLives();
		}
	}
}

function reset() {
	var enemy_reset_x = 25;
	ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 25, ship_h = 25;
	for (var i = 0; i < enemies.length; i++) {
		enemies[i][0] = enemy_reset_x;
		enemies[i][1] = -45;
		enemy_reset_x = enemy_reset_x + enemy_w + 60;
	}
}

function continueButton(e) {
	var cursorPos = getCursorPos(e);
	if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
		alive = true;
		lives = 3;
		reset();
		canvas.removeEventListener('click', continueButton, false);
	}
}

function getCursorPos(e) {
	var x;
	var y;
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
		} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	var cursorPos = new cursorPosition(x, y);
	return cursorPos;
}

function cursorPosition(x,y) {
	this.x = x;
	this.y = y;
}

function drawStarfield() {
  ctx.drawImage(starfield,starX,starY);
  ctx.drawImage(starfield,starX,starY2);
  if (starY > 600) {
    starY = -599;
	}
  if (starY2 > 600) {
    starY2 = -599;
	}
  starY += 1;
  starY2 += 1;
}

function gameStart() {
  gameStarted = true;
  canvas.removeEventListener('click', gameStart, false);
}

window.onload = init;
