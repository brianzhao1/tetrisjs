var colors = [
    'aqua',
    'orange',
    'blue',
    'yellow',
    'red',
    'purple',
    'green',
];

var boardWidth = 10;
var boardHeight = 24;
var unitSize = 25;
var gravity = 2;
var currentx = Math.floor((boardWidth  - 1) / 2);
var currenty = 0;

var incomingColor;
var incoming;
var iteration;
var board;

function setup() {
    createCanvas(boardWidth * unitSize, boardHeight * unitSize);
    board = new Board();
    iteration = 0;
    refresh();
}

function draw() {
    background(0);
    drawBoard(board);
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
    } else if (keyCode === 88) { // x
        board.rotateBlockLeft(incoming);
    } else if (keyCode === 90) { // z
        board.rotateBlockRight(incoming);
    }
}

function refresh() {
    iteration = ((iteration % colors.length) + colors.length) % colors.length
    incomingColor = colors[iteration++];
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
    colors = bag;
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

function drawBoard(board) {
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

function drawGhost(block) {
    var ghost = block.copy();
    while (board.moveBlockDown(ghost));
    drawBlock(ghost, 'gray');
}
