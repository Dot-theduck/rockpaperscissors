let gridSize = 50;
let padding = 10;
let shapes = [];
let rockImg, paperImg, scissorImg;
let spreadSpeed =1.5; // Speed for spreading out
let shapeCountPerCluster = 14; // Number of shapes per cluster

function preload() {
  // Load images
  rockImg = loadImage('assets/rock.png');
  paperImg = loadImage('assets/paper.png');
  scissorImg = loadImage('assets/scissors.png');
}

function setup() {
  createCanvas(350, 570); // Set the canvas size to 1080x1920
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
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      if (shapes[i].collidesWith(shapes[j])) {
        resolveCollision(shapes[i], shapes[j]);
      }
    }
  }
}

function createShapes() {
  shapes = [];
  
  // Define random starting areas for each shape type
  let areas = {
    rock: { x: random(0, width), y: random(0, height) },
    paper: { x: random(0, width), y: random(0, height) },
    scissors: { x: random(0, width), y: random(0, height) }
  };

  // Create shapes for each type with random positions
  for (let type in areas) {
    for (let i = 0; i < shapeCountPerCluster; i++) {
      let xOffset = random(-gridSize / 2, gridSize / 2);
      let yOffset = random(-gridSize / 2, gridSize / 2);
      
      // Randomize the starting position within the defined area
      let x = random(0, width);
      let y = random(0, height);

      shapes.push(new MorphingShape(x + xOffset, y + yOffset, type));
    }
  }
}

class MorphingShape {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = gridSize - padding * 1.4; // Size of the image
    this.type = type;
    this.offsetX = random(-5, 6);
    this.offsetY = random(-5, 6);
    this.speedX = random(-spreadSpeed, spreadSpeed);
    this.speedY = random(-spreadSpeed, spreadSpeed);
    this.collisionCooldown = 0; // Cooldown to handle prolonged collision effects
  }

  update() {
    if (this.collisionCooldown > 0) {
      this.collisionCooldown -= 0; // Decrease cooldown over time
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
    this.collisionCooldown = 0; // Set cooldown to create prolonged collision effect (e.g., 60 frames)
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
