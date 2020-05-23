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
        [[0, 2], [1, 0], [1, 1], [1, 2]],
        [[0, 1], [2, 2], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 2]],
        [[0, 1], [1, 1], [0, 0], [2, 1]]
    ],
    [
        [[0, 1], [0, 2], [1, 1], [1, 2]],
        [[1, 1], [1, 2], [2, 1], [2, 2]],
        [[1, 0], [1, 1], [2, 0], [2, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]]
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
        [[0, 1], [1, 2], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 1]],
        [[0, 1], [1, 1], [1, 0], [2, 1]]
    ]
]

var mapping = new Object();

for (var i = 0; i < colors.length; i++) {
    let color = colors[i];
    let position = positions[i];

    mapping[color] = position;
    console.log('mapped ', color);
}

console.log(mapping);

class Block {
    constructor(color) {
        this.color = color;
        console.log(color);
        this.rotations = mapping[color];
        console.log(mapping[color]);
        this.delta = 0;
    }

    get position() {
        // console.log(this.rotations[this.delta][0]);
        return this.rotations[this.delta % this.rotations.length];
    }
}
