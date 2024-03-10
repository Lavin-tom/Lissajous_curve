class LissajousCurve {
  constructor({
    width,
    height,
    A,
    B,
    a,
    b,
    d,
    t,
    dt,
    fps,
    deltasVal,
  }) {
    this.width = width;
    this.height = height;
    this.A = A;
    this.B = B;
    this.a = a;
    this.b = b;
    this.d = d;
    this.t = t;
    this.dt = dt;
    this.fps = fps;
    this.setMoments();
    this.deltasVal;
  }

  setWidth(w) {
    this.width = w;
  }

  setHeight(h) {
    this.height = h;
  }

  setScalingA(A) {
    this.A = A;
  }

  setScalingB(B) {
    this.B = B;
  }

  setFrequencyX(a) {
    this.a = a;
  }

  setFrequencyY(b) {
    this.b = b;
  }

  increaseSpeed() {
    this.dt *= this.speedScaleFactor;
  }

  decreaseSpeed() {
    this.dt /= this.speedScaleFactor;
  }

  setDeltasVal(val) {
    this.deltasVal = val;
  }

  setMoments() {
    const { A, B, a, b, t, deltasVal } = this;
    this.x = A * Math.sin(a * t + deltasVal) + this.width / 2;
    this.y = B * Math.sin(b * t) + this.height / 2;
  }

  move() {
    this.t += this.dt;
    this.x = this.A * Math.sin(this.a * this.t + this.deltasVal) + this.width / 2;
    this.y = this.B * Math.sin(this.b * this.t) + this.height / 2;
  }

  drawCurve(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    
    for (let i = 0; i < 1000; i++) { 
      this.move(); 
      ctx.lineTo(this.x, this.y); 
    }

    ctx.stroke(); 
  }
}
