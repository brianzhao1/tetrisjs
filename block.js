var colors = [
    'white',
    'orange',
    'blue',
    'yellow',
    'red',
    'green',
    'purple',
];

var positions = [
    [
        [[2, 1], [2, 2], [2, 3], [2, 4]],
        [[1, 2], [2, 2], [3, 2], [4, 2]],
        [[2, 0], [2, 1], [2, 2], [2, 3]],
        [[0, 2], [1, 2], [2, 2], [3, 2]]
    ],
    [
        [[0, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 1], [0, 2], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [2, 2]],
        [[0, 1], [1, 1], [2, 0], [2, 1]]
    ],
    [
        [[2, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 1], [2, 2], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 2]],
        [[0, 1], [1, 1], [0, 0], [2, 1]]
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

console.log(mapping);

class Block {
    constructor(color, position) {
        this.color = color;
        // console.log(color);
        // console.log(mapping[color]);
        this.delta = 0;
        this.position = position;
    }

    get rotation() {
        // console.log(this.delta, this.rotations.length);
        // console.log(this.rotations[this.delta % this.rotations.length]);
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
        console.log(this, 1);
        this.position[0] += 1;
    }

    moveDown() {
        this.position[1] += 1;
    }

    rotateLeft() {
        this.delta += 1;
        console.log(this.rotation);
        console.log(this.delta);
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
