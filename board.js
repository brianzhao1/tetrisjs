var boardWidth = 10;
var boardHeight = 24;
var currentx = 5;
var currenty = 0;

function getNewGrid() {
    var grid = [];
    for (var i = 0; i < boardHeight; i++) {
        var row = [];
        for (var j = 0; j < boardWidth; j++) {
            row.push(0);
        }
        grid.push(row);
    }
    return grid;
}

class Board {
    constructor() {
        this.grid = getNewGrid();
    }

    moveBlockLeft(block) {
        if (this.simulate(block, block.moveLeft)) {
            console.log("simulation passed");
            block.moveLeft();
            return true;
        }
        return false;
    }

    moveBlockRight(block) {
        if (this.simulate(block, block.moveRight)) {
            block.moveRight();
            return true;
        }
        return false;
    }

    moveBlockDown(block) {
        if (this.simulate(block, block.moveDown)) {
            block.moveDown();
            return true;
        }
        return false;
    }

    rotateBlockLeft(block) {
        if (this.simulate(block, block.rotateLeft)) {
            block.rotateLeft();
            return true;
        }
        return false;
    }

    rotateBlockRight(block) {
        if (this.simulate(block, block.rotateRight)) {
            block.rotateRight();
            return true;
        }
        return false;
    }

    setBlock(block) {
        console.log('setting now');
        while (this.moveBlockDown(block));
        console.log('setting block');
        let startx = block.x,
            starty = block.y;

        for (var points of block.rotation) {
            let blockx = points[0],
                blocky = points[1];
            let finalx = startx + blockx,
                finaly = starty + blocky;
            this.grid[finaly][finalx] = block.color;
        }
    }

    occupied(x, y) {
        return this.grid[x][y];
    }

    copy() {
        var copy = new Board();
        copy.grid = this.grid;
        return copy;
    }

    validate(block) {
        let startx = block.x,
            starty = block.y;

        for (var points of block.rotation) {
            let blockx = points[0],
                blocky = points[1];
            let finalx = startx + blockx,
                finaly = starty + blocky;
            console.log('look here', finalx, finaly);
            if ((finalx < 0 || finalx >= boardWidth) ||
                (finaly >= boardHeight) ||
                this.occupied(finaly, finalx)) {
                return false;
            }
        }

        return true;
    }

    simulate(block, action) {
        var tempBoard = this.copy();
        var tempBlock = block.copy();

        // console.log("temp", tempBlock.position);
        // console.log("block", block.position);
        var testFunc = action.bind(tempBlock);
        testFunc();
        // console.log("tempafter", tempBlock.position);
        // console.log("blockafter",block.position);

        return tempBoard.validate(tempBlock);
    }
}

var test = new Board();
var blo = new Block('purple', [5, 0]);
for (var i = 0; i < 3; i++) {
    blo.moveRight();
}
console.log(test.simulate(blo, blo.moveRight));
// console.log(test.validate(blo));
// console.log(blo.position);
