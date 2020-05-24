var colors = [
    'white',
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
var currentx = 5;
var currenty = 0;

var incomingColor;
var incoming;

var board;

function setup() {
    createCanvas(boardWidth * unitSize, boardHeight * unitSize);
    board = new Board();
    incomingColor = colors[Math.floor(Math.random() * colors.length)];
    incomingColor = 'blue';
    incoming = new Block(incomingColor, [currentx, currenty]);
}

function draw() {
    background(0);
    drawBoard(board);
    let result = drawBlock(incoming, currentx, currenty);
    if (frameCount % 60 == 0) {
        board.moveBlockDown(incoming);
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        // incoming.moveLeft();
        board.moveBlockLeft(incoming);
        console.log(incoming.position);
    } else if (keyCode === RIGHT_ARROW) {
        // incoming.moveRight();
        board.moveBlockRight(incoming);
    } else if (keyCode === DOWN_ARROW) {
        board.moveBlockDown(incoming);
    } else if (key === ' ') {
        board.setBlock(incoming);
        console.log(board.grid);
        refresh();
    } else if (keyCode === 88) {
        console.log('x pressed');
        board.rotateBlockLeft(incoming);
    } else if (keyCode === 90) {
        board.rotateBlockRight(incoming);
    }
}

// function reset() {
//     incomingColor = colors[Math.floor(Math.random() * colors.length)];
//     incoming = new Block(incomingColor, [currentx, currenty]);
//     currentx = 5;
//     currenty = 0;
// }

function refresh() {
    incomingColor = colors[Math.floor(Math.random() * colors.length)];
    incoming = new Block(incomingColor, [currentx, currenty]);
}

function drawBlock(block, x, y) {
    let startx = unitSize * block.x,
        starty = unitSize * block.y;
    let bucket = [];

    // console.log(block.rotation);
    for (points of block.rotation) {
        let blockx = unitSize * points[0],
            blocky = unitSize * points[1];
        let finalx = startx + blockx,
            finaly = starty + blocky;
        fill(block.color);
        rect(finalx, finaly, unitSize, unitSize);
        // console.log(startx + blockx, starty + blocky, unitSize, unitSize);
    }
}

function drawBoard(board) {
    for (var row = 0; row < boardHeight; row++) {
        for (var col = 0; col < boardWidth; col++) {
            let color = board.occupied(row, col);
            fill(color);
            rect(col * unitSize, row * unitSize, unitSize, unitSize);
            // console.log(col, row);
            // console.log(row, col);
        }
    }
}
