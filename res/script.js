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
  const path = points.map((point) => `${point.x},${point.y}`).join(' ');
  tracer.setAttribute('d', `M${path}`);
};

function refresh() {
  tracer.setAttribute('d', ''); 
}

function toggleTrace(checked) {
  config.trace = checked; 
  draw(); 
}

function togglePersist(checked) {

}

function toggleSmoothen(checked) {

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

draw();
