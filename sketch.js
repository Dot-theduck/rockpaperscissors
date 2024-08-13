let gridSize = 50;
let padding = 10;
let shapes = [];
let rockImg, paperImg, scissorImg;
let spreadSpeed = 1.5; // Speed for spreading out
let shapeCountPerCluster = 10; // Number of shapes per cluster
let roundEndTime = 0; // Time when the round should end
let winnerDeclared = false; // Flag to check if a winner has been declared

function preload() {
  // Load images
  rockImg = loadImage('assets/rock.png');
  paperImg = loadImage('assets/paper.png');
  scissorImg = loadImage('assets/scissors.png');
}

function setup() {
  // Dynamically set canvas size to fit the screen while maintaining a 9:16 aspect ratio
  let aspectRatio = 9 / 16;
  let canvasWidth = windowWidth;
  let canvasHeight = windowHeight;

  if (canvasWidth / canvasHeight > aspectRatio) {
    canvasWidth = canvasHeight * aspectRatio;
  } else {
    canvasHeight = canvasWidth / aspectRatio;
  }

  createCanvas(canvasWidth, canvasHeight);
  createShapes();
}

function draw() {
  background(20, 20, 50);

  // Update and display all shapes
  for (let shape of shapes) {
    shape.update();
    shape.display();
  }

  // Check for collisions and resolve them
  let collisionOccurred = false;
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      if (shapes[i].collidesWith(shapes[j])) {
        resolveCollision(shapes[i], shapes[j]);
        collisionOccurred = true; // Mark that a collision has occurred
      }
    }
  }

  // Check if all shapes are of the same type
  if (!winnerDeclared && checkAllShapesSameType()) {
    winnerDeclared = true;
    roundEndTime = millis() + 6000; // Set the round end time to 6 seconds from now
  }

  // Check if the round should end and start a new round if needed
  if (millis() > roundEndTime && roundEndTime > 0) {
    createShapes();
    roundEndTime = 0; // Reset round end time
    winnerDeclared = false; // Reset winner flag
  }
}

function createShapes() {
  shapes = [];

  // Create an array of shape types
  let shapeTypes = ['rock', 'paper', 'scissors'];

  // Create shapes for each type with random positions within the canvas
  for (let i = 0; i < shapeCountPerCluster * shapeTypes.length; i++) {
    // Choose a random shape type
    let type = random(shapeTypes);

    // Generate random positions within the canvas
    let x = random(width - gridSize);
    let y = random(height - gridSize);

    // Create and add the shape to the array
    shapes.push(new MorphingShape(x, y, type));
  }
}

function checkAllShapesSameType() {
  if (shapes.length === 0) return false;

  let firstType = shapes[0].type;
  for (let shape of shapes) {
    if (shape.type !== firstType) {
      return false; // If any shape has a different type, return false
    }
  }
  return true; // All shapes are of the same type
}

class MorphingShape {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = gridSize - padding * 1; // Size of the image
    this.type = type;
    this.offsetX = random(-5, 6);
    this.offsetY = random(-5, 6);
    this.speedX = random(-spreadSpeed, spreadSpeed);
    this.speedY = random(-spreadSpeed, spreadSpeed);
    this.collisionCooldown = 0; // Cooldown to handle prolonged collision effects
  }

  update() {
    if (this.collisionCooldown > 0) {
      this.collisionCooldown -= 1; // Decrease cooldown over time
    } else {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges with boundary adjustment
      if (this.x < 0) {
        this.x = 0; // Set position to edge
        this.speedX *= -1; // Reverse direction
      } else if (this.x > width - this.size) {
        this.x = width - this.size; // Set position to edge
        this.speedX *= -1; // Reverse direction
      }

      if (this.y < 0) {
        this.y = 0; // Set position to edge
        this.speedY *= -1; // Reverse direction
      } else if (this.y > height - this.size) {
        this.y = height - this.size; // Set position to edge
        this.speedY *= -1; // Reverse direction
      }
    }
  }

  display() {
    push();
    translate(this.x + this.offsetX, this.y + this.offsetY);
    if (this.type === 'rock') image(rockImg, 0, 0, this.size, this.size);
    if (this.type === 'paper') image(paperImg, 0, 0, this.size, this.size);
    if (this.type === 'scissors') image(scissorImg, 0, 0, this.size, this.size);
    pop();
  }

  collidesWith(other) {
    return dist(this.x, this.y, other.x, other.y) < this.size;
  }

  morphTo(newType) {
    this.type = newType;
    this.collisionCooldown = 1; // Set cooldown to create prolonged collision effect (e.g., 60 frames)
  }
}

function resolveCollision(shape1, shape2) {
  // Apply Rock, Paper, Scissors rules
  if (shape1.type === 'rock' && shape2.type === 'scissors') {
    shape2.morphTo('rock');
  } else if (shape1.type === 'scissors' && shape2.type === 'rock') {
    shape1.morphTo('rock');
  } else if (shape1.type === 'scissors' && shape2.type === 'paper') {
    shape2.morphTo('scissors');
  } else if (shape1.type === 'paper' && shape2.type === 'scissors') {
    shape1.morphTo('scissors');
  } else if (shape1.type === 'paper' && shape2.type === 'rock') {
    shape2.morphTo('paper');
  } else if (shape1.type === 'rock' && shape2.type === 'paper') {
    shape1.morphTo('paper');
  }
}

function mousePressed() {
  createShapes();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createShapes();
}
