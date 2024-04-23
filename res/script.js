const container = document.getElementById('container');
const tracer = document.getElementById('tracer');
let phaseDifference = Math.PI / 2; 
let a = 2;
let b = 3;

container.setAttribute('width', container.clientWidth);
container.setAttribute('height', container.clientHeight);

const centerX = container.clientWidth / 2;
const centerY = container.clientHeight / 2;
tracer.setAttribute('transform', `translate(${centerX}, ${centerY})`);

const config = {
  width: container.clientWidth,
  height: container.clientHeight,
  amplitude: Math.min(container.clientWidth, container.clientHeight) / 2, 
  trace: true,
  speed: 1,
  animationDelay: 10, 
  persistTrace: true
};

tracer.setAttribute('stroke', 'white');
tracer.setAttribute('stroke-width', '2'); 

const lissajous = (t) => {
  const frequencyRatio = 3;
  const x = (a * (config.amplitude / 2)) * Math.sin(frequencyRatio * t + phaseDifference);
  const y = (b * (config.amplitude / 2)) * Math.sin(t);
  return { x, y };
};

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

const updateSVGSize = () => {
  const boundingBox = container.getBBox();
  const width = boundingBox.width;
  const height = boundingBox.height;

  container.setAttribute('width', width);
  container.setAttribute('height', height);
};
function refresh() {
  tracer.setAttribute('d', ''); 
}

function toggleTrace(checked) {
  config.trace = checked; 
  draw(); 
}

function togglePersist(checked) {
  config.persistTrace = checked; 
}

function decreaseSpeed() {
  config.speed -= 0.1; 
  draw(); 
}

function increaseSpeed() {
  config.speed += 0.1; 
  draw(); 
}

function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('show'); 
}

function changePhase() {
  const phaseSelect = document.getElementById('phase-select');
  const selectedValue = parseInt(phaseSelect.value);

  const phaseValues = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI];
  phaseDifference = phaseValues[selectedValue];

  draw();
}

function changeAandB() {
  const Avalueselect = document.getElementById('A-select');
  const AselectedValue = parseInt(Avalueselect.value);
  const Avalues = [1, 2, 3, 4, 5, 6];
  a = Avalues[AselectedValue];
  
  const Bvalueselect = document.getElementById('B-select');
  const BselectedValue = parseInt(Bvalueselect.value);
  const Bvalues = [1, 2, 3, 4, 5, 6];
  b = Bvalues[BselectedValue];  
  config.amplitude = Math.min(container.clientWidth, container.clientHeight) / Math.max(a, b);
  draw();
}

draw();