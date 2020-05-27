var AQUA = '#00DBFF',
  ORANGE = '#FF971C',
  BLUE = '#0341AE',
  YELLOW = '#FFD500',
  RED = '#FF3213',
  GREEN = '#72CB3B',
  PURPLE = '#5E058B';

const DROP_MULTIPLIER = 2;
const SOFT_MULTIPLIER = 1;

var holdWidth = 6,
  queueWidth = 6,
  boardWidth = 10,
  boardHeight = 24,
  headerHeight = 2,
  unitSize = 30,
  gravity = 2,
  currentx = Math.ceil((boardWidth - 4) / 2),
  currenty = 0,
  borderRadius = 0,
  startingLevel = 1,
  fall = true,
  shouldContinue = true;

var incomingColor,
  incoming,
  held,
  usedHold,
  iteration,
  board,
  queue,
  lockCount,
  level,
  levelFont,
  linesFont,
  scoreFont,
  descFont,
  dispScore;

var colors = [AQUA, ORANGE, BLUE, YELLOW, RED, GREEN, PURPLE];

window.addEventListener('keydown', function (e) {
  if (
    (e.keyCode === 32 ||
      e.keyCode === LEFT_ARROW ||
      e.keyCode === RIGHT_ARROW ||
      e.keyCode === DOWN_ARROW) &&
    e.target === document.body
  ) {
    e.preventDefault(); // prevents spacebar and arrows from scrolling
  }
});

function preload() {
  (levelFont = loadFont('assets/roboto_level.ttf')),
    (linesFont = loadFont('assets/roboto_lines.ttf')),
    (descFont = loadFont('assets/italianno.ttf'));
  frameRate(50);
}

function setup() {
  var cnv = createCanvas(
    (holdWidth + boardWidth + queueWidth) * unitSize,
    (boardHeight - headerHeight) * unitSize
  );
  cnv.parent('game');
  cnv.id('tetris');
  board = new Board();
  level = startingLevel;
  iteration = 0;
  queue = [];
  usedHold = false;
  dispScore = 0;
  shuffleColors();
  refresh();
}

function draw() {
  background(0);
  drawQueue();
  drawHold();
  drawBoard();

  let result = drawBlock(incoming, incoming.color);
  if (!result) {
    this.gameOver();
  }
  drawGhost(incoming);

  if (shouldContinue) {
    if (frameCount % framesAtLevel() === 0) {
      fall = board.moveBlockDown(incoming);
    }

    if (frameCount % 30 === 0) {
      if (!fall) {
        lockCount++;
      } else {
        lockCount = 0;
      }
    }

    if (lockCount > 1) {
      usedHold = false;
      const setResult = board.setBlock(incoming);
      const linesCleared = setResult[0];
      const linesDropped = setResult[1];
      addScore(getPoints(linesCleared) + DROP_MULTIPLIER * linesDropped);
      refresh();
    }
  }
  this.drawLevelBadge();

  if (keyIsDown(DOWN_ARROW)) {
    setTimeout(board.moveBlockDown(incoming), 1000);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    board.moveBlockLeft(incoming);
  } else if (keyCode === RIGHT_ARROW) {
    board.moveBlockRight(incoming);
  } else if (keyCode === DOWN_ARROW) {
    board.moveBlockDown(incoming);
  } else if (key === ' ') {
    usedHold = false;
    const setResult = board.setBlock(incoming);
    const linesCleared = setResult[0];
    const linesDropped = setResult[1];
    addScore(getPoints(linesCleared) + DROP_MULTIPLIER * linesDropped);

    refresh();
  } else if (keyCode === 67) {
    // c
    holdBlock(incoming);
  } else if (keyCode === 88) {
    // x
    board.rotateBlockLeft(incoming);
  } else if (keyCode === 90) {
    // z
    board.rotateBlockRight(incoming);
  }
}

function setScore(points) {
  let scoreDiv = document.getElementById('scoreValue');
  console.log(scoreDiv);
  scoreDiv.textContent = points;
}

function gameOver() {
  drawGameOver();
  shouldContinue = false;
  setTimeout(() => {
    board = new Board();
    shouldContinue = true;
    dispScore = 0;
    setScore(dispScore);
  }, 2200);
  // board = new Board();
  board.score = 0;
  level = startingLevel;
}

function holdBlock(block) {
  if (usedHold) {
    return;
  }
  usedHold = true;
  if (held) {
    queue.unshift(held.color);
  }
  held = new Block(block.color);
  refresh();
}

function refresh() {
  // console.log(board.grid);
  // console.log(incoming);
  if (queue.length <= 3) {
    shuffleColors();
  }
  // iteration = (iteration + 1) % colors.length;
  incomingColor = queue.shift();
  incoming = new Block(incomingColor, [currentx, currenty]);
  lockCount = 0;
}

function getPoints(linesCleared) {
  return [0, 100, 300, 500, 1200][linesCleared] * level;
}

function addScore(scoreToAdd) {
    dispScore += scoreToAdd;
    setScore(dispScore);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shuffleColors() {
  var bag = [];
  for (blockColor of colors) {
    bag.push(blockColor);
  }
  for (let i = bag.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  queue.push(...bag);
}

function toNextLevel() {
  if (level === startingLevel) {
    return min(level * 10, max(100, level * 10 - 50));
  }
  return level * 10;
}

function framesAtLevel() {
  return [
    50,
    48,
    43,
    38,
    33,
    28,
    23,
    18,
    13,
    8,
    6,
    5,
    5,
    5,
    4,
    4,
    4,
    3,
    3,
    3,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    1,
  ][min(level, 30)];
}

function drawBlock(block, blockColor) {
  let startx = unitSize * (holdWidth + block.x),
    starty = unitSize * (block.y - headerHeight),
    gameContinues = true;

  for (points of block.rotation) {
    let blockx = unitSize * points[0],
      blocky = unitSize * points[1];
    let finalx = startx + blockx,
      finaly = starty + blocky;
    let c = color(blockColor);
    fill(c);

    // TOP OUT / GAME OVER CHECK
    let prevColor = get(finalx + unitSize / 2, finaly + unitSize / 2);
    if (board.isOccupiedAt(block.y + points[1], block.x + points[0]) != 0) {
      gameContinues = false;
    }
    rect(finalx, finaly, unitSize, unitSize, borderRadius);
    stroke(0);
  }

  return gameContinues;
}

function drawBoard() {
  for (var row = headerHeight; row < boardHeight; row++) {
    for (var col = 0; col < boardWidth; col++) {
      let blockColor = board.isOccupiedAt(row, col);
      let c = color(blockColor);
      if (blockColor === 0) {
        c = color('#656565');
        c.setAlpha(50);
      } else {
        c.setAlpha(255);
      }
      fill(c);
      rect(
        (col + holdWidth) * unitSize,
        (row - headerHeight) * unitSize,
        unitSize,
        unitSize,
        borderRadius
      );
    }
  }
}

function drawQueue() {
  erase();
  rect(
    (holdWidth + boardWidth) * unitSize,
    0,
    queueWidth * unitSize,
    boardHeight * unitSize
  );
  noErase();

  let queuex = boardWidth + 1,
    queuey = 1 + headerHeight;
  let offsetx = 0;
  let offsety = 0;
  let queueColor;

  for (let i = 0; i < 3; i += 1) {
    queueColor = queue[i];

    if (queueColor === '#00DBFF' || queueColor === '#FFD500') {
      offsetx = 0;
    } else {
      offsetx = 0.5;
    }

    if (queueColor === '#00DBFF') {
      offsety = 0.5;
    } else if (
      queueColor === '#FFD500' ||
      queueColor === '#FF3213' ||
      queueColor === '#72CB3B'
    ) {
      offsety = 0;
    } else {
      offsety = -1;
    }

    let queueBlock = new Block(queueColor, [
      queuex + offsetx,
      queuey - offsety,
    ]);
    this.drawBlock(queueBlock, queueColor);
    queuey += 4;
  }
}

function drawHold() {
  const holdx = 0;
  const holdy = 0;
  erase();
  rect(holdx, holdy, holdWidth * unitSize, boardHeight * unitSize);
  noErase();

  if (!held) {
    return;
  }

  let offsetx;
  let offsety;
  if (held.color === '#00DBFF' || held.color === '#FFD500') {
    offsetx = 0;
  } else {
    offsetx = 0.5;
  }

  if (held.color === '#00DBFF') {
    offsety = 0.5;
  } else if (
    held.color === '#FFD500' ||
    held.color === '#FF3213' ||
    held.color === '#72CB3B'
  ) {
    offsety = 0;
  } else {
    offsety = -1;
  }

  const heldDrawBlock = new Block(held.color, [
    holdx - holdWidth + 1 + offsetx,
    holdy + headerHeight + 1 - offsety,
  ]);
  this.drawBlock(heldDrawBlock, held.color);
}

function drawGhost(block) {
  var ghost = block.copy(),
    ghostColor = color(block.color);
  ghostColor.setAlpha(120);
  while (board.moveBlockDown(ghost));
  return drawBlock(ghost, ghostColor);
}

function drawGameOver() {
  textSize((95 * unitSize) / 35);
  textFont(linesFont);
  textAlign(CENTER);
  let gameOverColor = color(255);
  // gameOverColor.setAlpha(255);
  fill(gameOverColor);
  // strokeWeight(1.5);
  text(
    'GAME',
    (holdWidth + 0.3) * unitSize,
    10.5 * unitSize,
    boardWidth * unitSize,
  );
  text(
    'OVER',
    (holdWidth + 0.3) * unitSize,
    13 * unitSize,
    boardWidth * unitSize,
  );
  // strokeWeight(0);
  // console.log('Game Over');
}

function drawCurrentLevel() {
  textSize((30 * unitSize) / 35);
  textFont(levelFont);
  textAlign(CENTER);
  fill('#CC0D22');
  strokeWeight(1);
  text(`LEVEL ${level}`, 0, 16.5 * unitSize, (holdWidth + 0.3) * unitSize);
}

function drawNextLevel() {
  textSize((90 * unitSize) / 35);
  textFont(linesFont);
  textAlign(CENTER);
  fill(0);
  if (board.score >= this.toNextLevel()) {
    level += 1;
  }
  text(
    this.toNextLevel() - board.score,
    0,
    19 * unitSize,
    (holdWidth + 0.5) * unitSize,
  );
  // textSize(15);
  // textFont(descFont);
  // text('to next level', 0, 18.5 * unitSize, (holdWidth + 0.1) * unitSize);
}

function drawLevelDesc() {
  textSize((11 * unitSize) / 12);
  textFont(descFont);
  textAlign(CENTER);
  fill(0);
  strokeWeight(0);
  text(
    'to next level',
    0,
    20 * unitSize,
    (holdWidth + 0.3) * unitSize,
  );
}

function drawLevelBadge() {
  drawCurrentLevel();
  drawNextLevel();
  drawLevelDesc();
}
