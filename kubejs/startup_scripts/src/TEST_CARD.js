const rotatingVanishingPos = {
    x: 50,
    y: 50
};

function Card(x, y, zIndex) {
    this.x = x; // Center position
    this.y = y; // Center position
    this.zIndex = zIndex; // Layering
    this.angle = 0; // Angle of rotation
    this.width = 10; // Width
    this.height = 10; // Height
}

Card.prototype.hover = function (mouseX, mouseY, allCards) {
    // Check if the card is within the hover range
    if (this.isIn(mouseX, mouseY)) {
        // If the mouse is over the card, prioritize based on zIndex
        return true;
    }
    return false;
}

Card.prototype.isIn = function (mouseX, mouseY) {
    // Calculate the rotated corners of the card
    const vertices = this.getRotatedVertices();
    return pointInPolygon({ x: mouseX, y: mouseY }, vertices);
};

// Check if point is inside the polygon (PIP algorithm)
function pointInPolygon(point, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Rotate the card
Card.prototype.rotate = function (angle) {
    this.angle += angle;
};

// Get the rotated vertices of the card
Card.prototype.getRotatedVertices = function () {
    const vertices = [
        { x: -this.width / 2, y: -this.height / 2 },
        { x: this.width / 2, y: -this.height / 2 },
        { x: this.width / 2, y: this.height / 2 },
        { x: -this.width / 2, y: this.height / 2 }
    ];

    const rotatedVertices = vertices.map(v => {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        // Rotate the vertices around the center (0,0), then translate to the actual position
        const xNew = cos * v.x - sin * v.y + this.x;
        const yNew = sin * v.x + cos * v.y + this.y;

        return { x: xNew, y: yNew };
    });

    return rotatedVertices;
};

// Main loop: Rotate cards and check hover
let cardList = [
    new Card(50, 50, 1),
    new Card(60, 50, 2),
    new Card(70, 50, 3)
];

function renderCards(mouseX, mouseY) {
    cardList.forEach((card, index) => {
        card.rotate(0.01); // Rotate the card slightly on each frame

        if (card.hover(mouseX, mouseY, cardList)) {
            console.log(`Hovered over card ${index} with zIndex: ${card.zIndex}`);
        }
    });
}

// Example usage in a rendering loop (e.g., every frame or on mousemove):
// renderCards(mouseX, mouseY);
