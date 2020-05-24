var colors = [
    'aqua',
    'orange',
    'blue',
    'yellow',
    'red',
    'green',
    'purple',
];

var positions = [
    [
        [[2, 0], [2, 1], [2, 2], [2, 3]],
        [[1, 2], [2, 2], [3, 2], [4, 2]],
        [[2, 1], [2, 2], [2, 3], [2, 4]],
        [[0, 2], [1, 2], [2, 2], [3, 2]]
    ],
    [
        [[0, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 1], [0, 2], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [2, 2]],
        [[0, 1], [1, 1], [2, 0], [2, 1]]
    ],
    [
        [[0, 1], [1, 1], [0, 0], [2, 1]],
        [[2, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 1], [2, 2], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 2]],
    ],
    [
        [[0, 1], [0, 2], [1, 1], [1, 2]],
        [[0, 1], [0, 2], [1, 1], [1, 2]],
        [[0, 1], [0, 2], [1, 1], [1, 2]],
        [[0, 1], [0, 2], [1, 1], [1, 2]],
    ],
    [
        [[0, 1], [0, 2], [1, 0], [1, 1]],
        [[0, 1], [1, 1], [1, 2], [2, 2]],
        [[1, 1], [1, 2], [2, 0], [2, 1]],
        [[0, 0], [1, 0], [1, 1], [2, 1]]
    ],
    [
        [[0, 0], [0, 1], [1, 1], [1, 2]],
        [[0, 2], [1, 1], [1, 2], [2, 1]],
        [[2, 2], [1, 0], [1, 1], [2, 1]],
        [[2, 0], [0, 1], [1, 0], [1, 1]]
    ],
    [
        [[0, 1], [1, 0], [1, 1], [1, 2]],
        [[0, 1], [1, 1], [1, 0], [2, 1]],
        [[2, 1], [1, 1], [1, 2], [1, 0]],
        [[0, 1], [1, 2], [1, 1], [2, 1]],
    ]
]

var mapping = new Object();

for (var i = 0; i < colors.length; i++) {
    let color = colors[i];
    let position = positions[i];

    mapping[color] = position;
}

class Block {
    constructor(color, position) {
        this.color = color;
        this.delta = 0;
        this.position = position;
    }

    get rotation() {
        return mapping[this.color][(((this.delta % 4) + 4) % 4)];
    }

    get x() {
        return this.position[0];
    }

    get y() {
        return this.position[1];
    }

    moveLeft() {
        this.position[0] -= 1;
    }

    moveRight() {
        this.position[0] += 1;
    }

    moveDown() {
        this.position[1] += 1;
    }

    rotateLeft() {
        this.delta += 1;
    }

    rotateRight() {
        this.delta -= 1;
    }

    copy() {
        var copy = new Block(this.color);
        copy.delta += this.delta;
        copy.position = [this.x, this.y];
        return copy;
    }
}
