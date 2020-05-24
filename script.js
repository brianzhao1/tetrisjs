var colors = [
    'aqua',
    'orange',
    'blue',
    'yellow',
    'red',
    'purple',
    'green',
];

var queueWidth = 5;
var boardWidth = 10;
var boardHeight = 24;
var unitSize = 25;
var gravity = 2;
var currentx = 3;
var currenty = 0;

var incomingColor;
var incoming;
var iteration;
var board;
var queue;

function setup() {
    createCanvas((boardWidth + queueWidth) * unitSize, boardHeight * unitSize);
    board = new Board();
    iteration = 0;
    queue = [];
    shuffleColors();
    refresh();
}

function draw() {
    // background(0);
    drawBoard();
    drawQueue();
    drawGhost(incoming);
    let result = drawBlock(incoming, incoming.color);
    if (frameCount % 60 == 0) {
        board.moveBlockDown(incoming);
    }
    drawScore();
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
        refresh();
        console.log(queue);
    } else if (keyCode === 88) { // x
        board.rotateBlockLeft(incoming);
    } else if (keyCode === 90) { // z
        board.rotateBlockRight(incoming);
    }
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
    for (color of colors) {
        bag.push(color);
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
    text(board.score, 10, 32);
}

function drawBlock(block, color) {
    let startx = unitSize * block.x,
        starty = unitSize * block.y;
    let bucket = [];

    // console.log(block.rotation);
    for (points of block.rotation) {
        let blockx = unitSize * points[0],
            blocky = unitSize * points[1];
        let finalx = startx + blockx,
            finaly = starty + blocky;
        fill(color);
        rect(finalx, finaly, unitSize, unitSize);
        // console.log(startx + blockx, starty + blocky, unitSize, unitSize);
    }
}

function drawBoard() {
    for (var row = 0; row < boardHeight; row++) {
        for (var col = 0; col < boardWidth; col++) {
            let color = board.isOccupiedAt(row, col);
            fill(color);
            rect(col * unitSize, row * unitSize, unitSize, unitSize);
            // console.log(col, row);
            // console.log(row, col);
        }
    }
}

function drawQueue() {
    let queuex = boardWidth + 1,
        queuey = 0;
    for (let queueColor of queue) {
        console.log(queueColor);
    }
}

function drawGhost(block) {
    var ghost = block.copy();
    while (board.moveBlockDown(ghost));
    drawBlock(ghost, 'gray');
}
