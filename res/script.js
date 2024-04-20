const container = document.getElementById('container');
const tracer = document.getElementById('tracer');

const config = {
  width: container.clientWidth,
  height: container.clientHeight,
  amplitude: Math.min(container.clientWidth, container.clientHeight) / 4,
  trace: true,
  speed: 1,
  animationDelay: 10, // Milliseconds between drawing each point
  persistTrace: false // Set to true for persistent trace, false otherwise
};

const lissajous = (t) => {
  const frequencyRatio = 3;
  const phaseDifference = Math.PI / 2;

  const x = config.amplitude * Math.sin(frequencyRatio * t + phaseDifference);
  const y = config.amplitude * Math.sin(t);
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

draw();
