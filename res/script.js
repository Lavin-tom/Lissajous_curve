const container = document.getElementById('container');
const upperGraph = document.getElementById('upper_graph');
const base = document.getElementById('base');
const upperString = document.getElementById('upper_string');
const tracer = document.getElementById('tracer');

const config = {
  width: container.clientWidth,
  height: container.clientHeight,
  upperMass: 1,
  lowerMass: 2,
  frequencyRatio: 3,
  phaseDifference: Math.PI / 2,
  amplitude: Math.min(container.clientWidth, container.clientHeight) / 4,
  trace: true,
  persistentTrace: false,
  smoothen: true,
  speed: 1,
};
const lissajous = (t) => {
  const x = config.amplitude * Math.sin(config.frequencyRatio * t + config.phaseDifference);
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
  const lastPoint = points[points.length - 1];
  base.setAttribute('cx', config.width / 2);
  base.setAttribute('cy', config.height / 2);
  base.setAttribute('r', 5);
  upperString.setAttribute('x1', config.width / 2);
  upperString.setAttribute('y1', config.height / 2);
  upperString.setAttribute('x2', config.width / 2 + lastPoint.x);
  upperString.setAttribute('y2', config.height / 2 + lastPoint.y);
};
const refresh = () => {
  // Clear trace
  tracer.setAttribute('d', '');
  draw();
};

const toggleMenu = () => {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('show');
};
draw();
