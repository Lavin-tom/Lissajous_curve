const container = document.getElementById('container');
const tracer = document.getElementById('tracer');
let phaseDifference = Math.PI / 2;
let A = 2;
let B = 2;
let a = 2;
let b = 2;

// Function to center the SVG container and set its dimensions
const centerSVG = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const svgSize = Math.min(windowWidth * 0.8, windowHeight * 0.8); // Adjust size to maintain aspect ratio

  container.setAttribute('width', svgSize);
  container.setAttribute('height', svgSize);
  container.style.left = `${(windowWidth - svgSize) / 2}px`;
  container.style.top = `${(windowHeight - svgSize) / 2}px`;
};

// Call the function initially and on window resize
window.addEventListener('resize', centerSVG);
centerSVG();

const config = {
  width: container.clientWidth,
  height: container.clientHeight,
  amplitude: Math.min(container.clientWidth, container.clientHeight) / 2,
  trace: true,
  speed: 1,
  animationDelay: 10,
  persistTrace: true
};

// Set SVG stroke properties
tracer.setAttribute('stroke', 'yellow');
tracer.setAttribute('stroke-width', '2');

// Calculate Lissajous curve points
const lissajous = (t) => {
  //const frequencyRatio = 3;
  const x = (Math.sin(a * t + phaseDifference) + 1) / 2 * container.clientWidth;
  const y = (Math.sin(b * t) + 1) / 2 * container.clientHeight;
  return { x, y };
};

// Draw Lissajous curve
const draw = async () => {
  const points = [];
  for (let t = 0; t < 2 * Math.PI * config.speed; t += 0.01) {
    points.push(lissajous(t));
  }

  for (let i = 0; i < points.length; i++) {
    const path = points.slice(0, i + 1).map((point) => `${point.x},${point.y}`).join(' ');
    tracer.setAttribute('d', `M${path}`);

    if (config.persistTrace) {
      await new Promise(resolve => setTimeout(resolve, config.animationDelay));
    } else {
      await new Promise(resolve => setTimeout(() => {
        tracer.setAttribute('d', '');
        resolve();
      }, config.animationDelay));
    }
  }
  updateSVGSize();
};

// Update SVG size based on traced path
const updateSVGSize = () => {
  const boundingBox = container.getBBox();
  const width = boundingBox.width;
  const height = boundingBox.height;

  container.setAttribute('width', width);
  container.setAttribute('height', height);
};

// Refresh traced path
function refresh() {
  tracer.setAttribute('d', '');
}

// Toggle tracing
function toggleTrace(checked) {
  config.trace = checked;
  draw();
}

// Toggle persistent trace
function togglePersist(checked) {
  config.persistTrace = checked;
}

// Decrease drawing speed
function decreaseSpeed() {
  config.speed -= 0.1;
  config.animationDelay += 10;
  draw();
}

// Increase drawing speed
function increaseSpeed() {
  config.speed += 0.1;
  config.animationDelay -= 10;
  draw();
}

// Toggle menu visibility
function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('show');
}

// Change phase difference
function changePhase() {
  const phaseSelect = document.getElementById('phase-select');
  const selectedValue = parseInt(phaseSelect.value);

  const phaseValues = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI];
  phaseDifference = phaseValues[selectedValue];

  draw();
}

// Change values of A and B
function changeAandB() {
  const Avalueselect = document.getElementById('A-select');
  const AselectedValue = parseInt(Avalueselect.value);
  const Avalues = [1, 2, 3, 4, 5, 6];
  a = Avalues[AselectedValue];

  const Bvalueselect = document.getElementById('B-select');
  const BselectedValue = parseInt(Bvalueselect.value);
  const Bvalues = [1, 2, 3, 4, 5, 6];
  b = Bvalues[BselectedValue];

  draw();
}
function changeColor() {
  const SelectedColor = document.getElementById('color-select');
  const SelectedColorValue = parseInt(SelectedColor.value);
  const Colors = ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];
  color = Colors[SelectedColorValue];
  draw();
}
// Initial draw
draw();
