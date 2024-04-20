const container = document.getElementById('container');
const tracer = document.getElementById('tracer');

const config = {
  width: container.clientWidth,
  height: container.clientHeight,
  amplitude: Math.min(container.clientWidth, container.clientHeight) / 4,
  trace: true,
  speed: 1,
};
const lissajous = (t) => {
  const frequencyRatio = 3; 
  const phaseDifference = Math.PI / 2; 
  
  const x = config.amplitude * Math.sin(frequencyRatio * t + phaseDifference);
  const y = config.amplitude * Math.sin(t);
  return { x, y };
};

const draw = () => {
  const points = [];
  for (let t = 0; t < 2 * Math.PI * config.speed; t += 0.01) {
    points.push(lissajous(t));
  }
  if (config.trace) {
    const path = points.map((point) => `${point.x},${point.y}`).join(' ');
    tracer.setAttribute('d', `M ${path}`);
  }
};
const refresh = () => {
  tracer.setAttribute('d', '');
  draw();
};
function refresh() {
  const tracer = document.getElementById('tracer');
  tracer.setAttribute('d', '');
}
function decreaseSpeed() {
  
}
function increaseSpeed() {
}
function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('show');
}

draw();
