const container = document.getElementById('container');
const tracer = document.getElementById('tracer');
let phaseDifference = Math.PI / 2;
let a = 2;
let b = 2;

const centerSVG = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const svgSize = Math.min(windowWidth * 0.8, windowHeight * 0.8);
  container.setAttribute('width', svgSize);
  container.setAttribute('height', svgSize);
  container.style.left = `${(windowWidth - svgSize) / 2}px`;
  container.style.top = `${(windowHeight - svgSize) / 2}px`;
};

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

tracer.setAttribute('stroke', 'yellow');
tracer.setAttribute('stroke-width', '2');

const lissajous = (t) => {
  const x = (Math.sin(a * t + phaseDifference) + 1) / 2 * container.clientWidth;
  const y = (Math.sin(b * t) + 1) / 2 * container.clientHeight;
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
};

function refresh() {
  tracer.setAttribute('d', '');
  draw();
}

function toggleTrace(checked) {
  config.trace = checked;
  if (!checked) {
    tracer.setAttribute('d', '');
  }
  draw();
}

function togglePersist(checked) {
  config.persistTrace = checked;
}

function decreaseSpeed() {
  if (config.speed > 0.1) {
    config.speed -= 0.1;
    config.animationDelay += 10;
  }
  draw();
}

function increaseSpeed() {
  config.speed += 0.1;
  if (config.animationDelay > 10) {
    config.animationDelay -= 10;
  }
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
  a = AselectedValue + 1; // Since options start from 1

  const Bvalueselect = document.getElementById('B-select');
  const BselectedValue = parseInt(Bvalueselect.value);
  b = BselectedValue + 1; // Since options start from 1

  draw();
}

function changeColor() {
  const SelectedColor = document.getElementById('color-select');
  const color = SelectedColor.value;
  tracer.setAttribute('stroke', color);
}
setTimeout(draw, 100);
