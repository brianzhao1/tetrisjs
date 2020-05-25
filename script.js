var colors = [
    '#00DBFF', // aqua
    '#FF971C', // orange
    '#0341AE', // blue
    '#FFD500', // yellow
    '#FF3213', // red
    '#72CB3B', // green
    '#5E058B', // purple
];

var holdWidth = 6,
    queueWidth = 6,
    boardWidth = 10,
    boardHeight = 24,
    headerHeight = 2,
    unitSize = 35,
    gravity = 2,
    currentx = Math.ceil((boardWidth - 4) / 2),
    currenty = 0,
    borderRadius = 1;

var incomingColor,
    incoming,
    held,
    usedHold,
    iteration,
    board,
    queue;

function setup() {
    createCanvas((holdWidth + boardWidth + queueWidth) * unitSize, boardHeight * unitSize);
    board = new Board();
    iteration = 0;
    queue = [];
    usedHold = false;
    shuffleColors();
    refresh();
}

function draw() {
    background(0);
    drawQueue();
    drawHold();
    drawBoard();

    let result = drawGhost(incoming);
    if (!result) {
        gameOver();
    }

    drawBlock(incoming, incoming.color);
    drawHeader();

    if (frameCount % 60 == 0) {
        board.moveBlockDown(incoming);
    }

    drawScore();
    if (keyIsDown(DOWN_ARROW)) {
        setTimeout(board.moveBlockDown(incoming), 1000);
    }
    // if (frameCount % 10 == 0 && keyIsDown(LEFT_ARROW)) {
    //     board.moveBlockLeft(incoming);
    // }
    // if (frameCount % 10 == 0 && keyIsDown(RIGHT_ARROW)) {
    //     setTimeout(board.moveBlockRight(incoming), 1000);
    // }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        board.moveBlockLeft(incoming);
    } else if (keyCode === RIGHT_ARROW) {
        board.moveBlockRight(incoming);
    } else if (keyCode === DOWN_ARROW) {
        board.moveBlockDown(incoming);
    } else if (key === ' ') {
        board.setBlock(incoming);
        usedHold = false;
        refresh();
    } else if (keyCode === 67) { // c
        holdBlock(incoming);
    } else if (keyCode === 88) { // x
        board.rotateBlockLeft(incoming);
    } else if (keyCode === 90) { // z
        board.rotateBlockRight(incoming);
    }
}

function gameOver() {
    board = new Board();
    console.log('game over sir');
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
    if (queue.length <= 3) {
        shuffleColors();
    }
    iteration = (iteration + 1) % colors.length;
    incomingColor = queue.shift();
    incoming = new Block(incomingColor, [currentx, currenty]);
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

function drawScore() {
    textSize(32);
    fill('white');
    text(board.score, holdWidth * unitSize + 10, headerHeight * unitSize + 32);
}

function drawBlock(block, blockColor) {
    let startx = unitSize * (holdWidth + block.x),
        starty = unitSize * block.y;
    let bucket = [];

    for (points of block.rotation) {
        let blockx = unitSize * points[0],
            blocky = unitSize * points[1];
        let finalx = startx + blockx,
            finaly = starty + blocky;
        let c = color(blockColor);
        fill(c);

        // TOP OUT / GAME OVER CHECK
        let prevColor = get(finalx + unitSize / 2, finaly + unitSize / 2);
        let occupant = board.isOccupiedAt(block.y + points[1], block.x + points[0]);
        if (blockColor == 'gray' && occupant != 0) {
            return false;
        }

        rect(finalx, finaly, unitSize, unitSize, borderRadius);
        stroke(0);
        if (blockColor != 'gray') {
            // line(finalx, finaly, finalx + unitSize, finaly + unitSize);
        }
    }

    return true;
}

function drawBoard() {
    for (var row = 0; row < boardHeight; row++) {
        for (var col = 0; col < boardWidth; col++) {
            let blockColor = board.isOccupiedAt(row, col);
            let c = color(blockColor);
            if (blockColor == 0) {
            }
            fill(c);
            c.setAlpha(255);
            // fill(blockColor);
            rect((col + holdWidth) * unitSize, row * unitSize, unitSize, unitSize, borderRadius);
        }
    }
}

function drawQueue() {
    erase();
    rect((holdWidth + boardWidth) * unitSize, 0, queueWidth * unitSize, boardHeight * unitSize);
    noErase();
    let queuex = boardWidth + 1,
        queuey = 1 + headerHeight;
    for (let i = 0; i < 3; i++) {
        let queueColor = queue[i],
            queueBlock = new Block(queueColor, [queuex, queuey]);
        this.drawBlock(queueBlock, queueColor);
        queuey += 4;
    }
}

function drawHold() {
    let holdx = 0,
        holdy = 0;

    erase();
    rect(holdx, holdy, holdWidth * unitSize, boardHeight * unitSize);
    noErase();

    if (!held) {
        return;
    }

    let heldDrawBlock = new Block(held.color, [holdx - holdWidth + 1, holdy + headerHeight]);
    this.drawBlock(heldDrawBlock, held.color);
}

function drawHeader() {
    erase();
    rect(holdWidth * unitSize, 0, boardWidth * unitSize, headerHeight * unitSize);
    noErase();
}

function drawGhost(block) {
    var ghost = block.copy(),
        ghostColor = color(block.color);
    ghostColor.setAlpha(120);
    while (board.moveBlockDown(ghost));
    return drawBlock(ghost, ghostColor);
}
