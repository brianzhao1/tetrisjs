var boardWidth = 14,
    boardHeight = 24,
    kickBound = 3;

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
        this.score = 0;
    }

    moveBlockLeft(block) {
        if (this.simulate(block, block.moveLeft)) {
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
        let boundRight = 0,
            boundLeft = 0;
        if (!this.simulate(block, block.rotateLeft)) {
            let kickResult = this.kick(block, block.rotateLeft),
                kickx = kickResult[0],
                kicky = kickResult[1];
            console.log(kickx, kicky);
            for (let i = 0; i < kicky; i++) {
                block.moveDown();
            }
            for (let j = 0; j < kickx; j++) {
                block.moveRight();
            }
            for (let k = 0; k < -kickx; k++) {
                block.moveLeft();
            }
        }
        if (this.simulate(block, block.rotateLeft)) {
            block.rotateLeft();
            return true;
        }
        return false;
    }

    rotateBlockRight(block) {
        let boundRight = 0,
            boundLeft = 0;
        if (!this.simulate(block, block.rotateRight)) {
            let kickResult = this.kick(block, block.rotateRight),
                kickx = kickResult[0],
                kicky = kickResult[1];
            console.log(kickx, kicky);
            for (let i = 0; i < kicky; i++) {
                block.moveDown();
            }
            for (let j = 0; j < kickx; j++) {
                block.moveRight();
            }
            for (let k = 0; k < -kickx; k++) {
                block.moveLeft();
            }
        }
        if (this.simulate(block, block.rotateRight)) {
            block.rotateRight();
            return true;
        }
        return false;
    }

    setBlock(block) {
        while (this.moveBlockDown(block));
        let startx = block.x,
            starty = block.y;

        for (var points of block.rotation) {
            let blockx = points[0],
                blocky = points[1];
            let finalx = startx + blockx,
                finaly = starty + blocky;
            this.grid[finaly][finalx] = block.color;
        }

        this.score += this.clearLines();
    }

    clearLines() {
        var score = 0;
        for (var bottom = boardHeight - 1; bottom >= 0; bottom--) {
            var shouldClear = true;
            for (var el of this.grid[bottom]) {
                if (el == 0) {
                    shouldClear = false;
                    break;
                    // return score;
                }
            }
            if (shouldClear) {
                this.grid.splice(bottom, 1);
                score += 1;
            }
        }

        for (var point = 0; point < score; point++) {
            var newLine = [];
            for (var i = 0; i < boardWidth; i++) {
                newLine.push(0);
            }
            this.grid.splice(0, 0, newLine);
        }
        return score;
    }

    isOccupiedAt(x, y) {
        return this.grid[floor(x)][floor(y)];
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
            if ((finalx < 0 || finalx >= boardWidth) ||
                (finaly >= boardHeight) ||
                this.isOccupiedAt(finaly, finalx)) {
                return false;
            }
        }

        return true;
    }

    simulate(block, action) {
        var tempBoard = this.copy();
        var tempBlock = block.copy();

        var testFunc = action.bind(tempBlock);
        testFunc();

        return tempBoard.validate(tempBlock);
    }

    kick(block, action) {
        var kickDisp = 0;
        let kickBoard = this.copy(),
            kickBlock = block.copy();

        var kickFunc = action.bind(kickBlock);
        kickFunc();
        for (let dx = 0; dx < kickBound; dx++) {
            for (let dy = 0; dy < kickBound; dy++) {
                kickBlock.position[0] += dx;
                kickBlock.position[1] += dy;
                if (kickBoard.validate(kickBlock)) {
                    return [dx, dy];
                }
                kickBlock.position[0] -= 2 * dx;
                if (kickBoard.validate(kickBlock)) {
                    return [-dx, dy];
                }
                kickBlock.position[1] -= dy;
            }
        }

        return [0, 0];
    }
}

