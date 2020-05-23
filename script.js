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

var incomingColor = colors[Math.floor(Math.random() * colors.length)];
var incoming;

function setup() {
    createCanvas(boardWidth * unitSize, boardHeight * unitSize);
    incoming = new Block(incomingColor);
}

function draw() {
    background(0);
    // console.log(incomingColor);
    let result = drawBlock(incoming, currentx, currenty);
    if (!result) {
        incoming = new Block(incomingColor);
    } else if (frameCount % 60 == 0) {
        currenty gravity;
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        currentx -= 1;
    } else if (keyCode === RIGHT_ARROW) {
        currentx += 1;
    } else if (keyCode == 88) {
        console.log('x pressed');
        incoming.delta += 1;
    } else if (keyCode == 90) {
        incoming.delta -= 1;
    }
}

function reset() {
    incomingColor = colors[Math.floor(Math.random() * colors.length)];
    incoming = new Block(incomingColor);
    currentx = 5;
    currenty = 0;
}

function freeCheck(color) {
    return (color[0] == 0 && color[1] == 0 && color[2] == 0);
}
function drawBlock(block, x, y) {
    let startx = unitSize * x;
    let starty = unitSize * y;
    let bucket = [];

    for (points of block.position) {
        let blockx = unitSize * points[0],
            blocky = unitSize * points[1];
        let finalx = startx + blockx,
            finaly = starty + blocky;
        let color = get(finalx + unitSize / 2, finaly + unitSize / 2);
        console.log(finaly / unitSize);
        if (finaly / unitSize >= boardHeight || !freeCheck(color)) {
            return false;
        } else {
            bucket.push([finalx, finaly]);
        }
    }

    for (finalPoint of bucket) {
        let finalx = finalPoint[0],
            finaly = finalPoint[1];
        fill(block.color);
        rect(finalx, finaly, unitSize, unitSize);
        // console.log(startx + blockx, starty + blocky, unitSize, unitSize);
    }

    return true;
}
