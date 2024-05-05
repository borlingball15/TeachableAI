let sketchRNN;
let currentStroke;
let x, y;
let nextPen = 'down';
let seedPath = [];
let seedPoints = [];
let personDrawing = false;
let word;
let drawingComplete = false;

function preload() {
  sketchRNN = ml5.sketchRNN(word);
}

function submitWord() {
  word = document.getElementById('wordInput').value;
  sketchRNN = ml5.sketchRNN(word);
  drawingComplete = false; // Reset drawingComplete to false when submitting a new word
}

function clearDrawing() {
  document.getElementById('wordInput').value = "";
  seedPath = [];
  seedPoints = [];
  personDrawing = false;
  drawingComplete = false;
  currentStroke = null;
  nextPen = 'down';
  background(255);
}

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('sketchContainer');
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(sketchRNNStart);
  background(255);
}

function gotStrokePath(error, strokePath) {
  console.log(strokePath);
  currentStroke = strokePath;
}

function draw() {
  stroke(0);
  strokeWeight(4);

  if (personDrawing) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    seedPoints.push(createVector(mouseX, mouseY));
  }

  if (currentStroke && !drawingComplete) {
    if (nextPen == 'end') {
      drawingComplete = true; // Set drawingComplete to true after the first drawing is complete
      return;
    }
    if (nextPen == 'down') {
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }

    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);
  }
}

function startDrawing() {
  personDrawing = true;
  x = mouseX;
  y = mouseY;
}

function sketchRNNStart() {
  personDrawing = false;

  const rdpPoints = [];
  const total = seedPoints.length;
  const start = seedPoints[0];
  const end = seedPoints[total - 1];
  rdpPoints.push(start);
  rdp(0, total - 1, seedPoints, rdpPoints);
  rdpPoints.push(end);

  background(255);
  stroke(0);
  strokeWeight(4);
  beginShape();
  for (let v of rdpPoints) {
    vertex(v.x, v.y);
  }
  endShape();

  x = rdpPoints[rdpPoints.length - 1].x;
  y = rdpPoints[rdpPoints.length - 1].y;

  seedPath = [];
  for (let i = 1; i < rdpPoints.length; i++) {
    let strokePath = {
      dx: rdpPoints[i].x - rdpPoints[i - 1].x,
      dy: rdpPoints[i].y - rdpPoints[i - 1].y,
      pen: 'down'
    }
    seedPath.push(strokePath);
  }

  sketchRNN.generate(seedPath, gotStrokePath);
}
