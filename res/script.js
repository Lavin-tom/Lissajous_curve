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

      setfrequencyX(a) {
        this.a = a;
      }

      setfrequencyY(b) {
        this.b = b;
      }

      increaseSpeed() {
        this.dt *= this.speedScaleFactor;
      }

      decreaseSpeed() {
        this.dt /= this.speedScaleFactor;
      }
	  
	  setDeltasVal(val){
		  this.deltasVal = val;
	  }
      setMoments() {
        const { A, B, a, b, t, deltasVal} = this;
		this x = A * Math.sin (a * t + deltasVal) + 400;
		this y = B * Math.sin (b * t) + 300;
      }
  
	  calculateCurvePosition(x0, y0) {
		const { A, B, a, b, t, deltasVal} = this;
        const offsetX = A * Math.sin (a * t + deltasVal) + 400;
        const offsetY = B * Math.sin (b * t) + 300;
        const x = x0 + offsetX;
        const y = y0 + offsetY;
        return { x, y };
      }
    }
	
class Tracer {
      constructor() {
        this.points = [];
        this.MAX = 500;
        this.isActive = true;
        this.ctr = 0;
        this.smooth = 0.2;
        this.smoothen = false;
      }

      addPoint({ x, y }) {
        if (this.isActive)
          this.points = [...this.points.slice(-this.MAX), { x, y }];
        else this.points = [];
      }

      addGraphPoint(data) {
        if (this.isActive)
          this.points = [...this.points, { x: this.ctr++, y: data }];
        else this.points = [];
      }

      clearPoints() {
        this.points = [];
        this.ctr = 0;
      }

      getLine(p1, p2) {
        const distX = p2.x - p1.x;
        const distY = p2.y - p1.y;
        const len = Math.sqrt(distX ** 2 + distY ** 2);
        const ang = Math.atan2(distY, distX);
        return { len, ang };
      }

      getControlPoint(current, previous, next, reverse) {
        previous = previous || current;
        next = next || current;
        let { len, ang } = this.getLine(previous, next);
        ang = ang + (reverse ? Math.PI : 0);
        len = len * this.smooth;
        const x = current.x + len * Math.cos(ang);
        const y = current.y + len * Math.sin(ang);
        return { x, y };
      }

      getSmoothPoint(point, i, points) {
        const prevSmooth = this.getControlPoint(
          points[i - 1],
          points[i - 2],
          point
        );
        const nextSmooth = this.getControlPoint(
          point,
          points[i - 1],
          points[i + 1]
        );
        return `C${prevSmooth.x.toFixed(2)} ${prevSmooth.y.toFixed(
          2
        )} ${nextSmooth.x.toFixed(2)} ${nextSmooth.y.toFixed(
          2
        )} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      }

      getPointsAsString() {
        if (this.smoothen) {
          return this.points
            .map(
              ({ x, y }, i) =>
                `${
                  i == 0
                    ? `M${x} ${y}`
                    : this.getSmoothPoint({ x, y }, i, this.points)
                }`
            )
            .join(" ");
        } else {
          const len = this.points.length;
          return this.points
            .map(
              ({ x, y }, i) =>
                `${i == 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
            )
            .join(" ");
        }
      }

      setActive(active) {
        this.isActive = active;
      }

      setMAX(n) {
        this.MAX = n;
      }
    }
	
function refresh() {
      const scaleWidth = 100;
      const scaleHeight = (100 * innerHeight) / innerWidth;
      const scale = Math.min(scaleWidth, scaleHeight);

      LissajousCurve = new LissajousCurve({
        width: scaleWidth,
        height: scaleHeight,
        x0: scaleWidth / 2,
        y0: scaleHeight / 2,
        A: 200,
        B: 200,
        a: 5,
        b: 4,
		d: 0,
		t: 0,
        dt: 0.001,
        fps: 100,
      });

      if (window.location.hash.length > 0) {
        const query = window.location.hash.substring(1);
        try {
          const encoded_JSON = atob(query);
          const config = JSON.parse(encoded_JSON);
          for (let prop in config) {
            LissajousCurve[prop] = config[prop];
          }
          LissajousCurve.width = scaleWidth;
          LissajousCurve.height = scaleHeight;
          LissajousCurve.x0 = (config.x0 / config.width) * scaleWidth;
          LissajousCurve.y0 = (config.y0 / config.height) * scaleHeight;
        } catch (e) {
          window.location.hash = "";
        }
      }

      canvas.setAttribute(
        "viewBox",
        `0 0 ${LissajousCurve.width} ${LissajousCurve.height}`
      );
      gravityButton.checked = LissajousCurve.g != 0;
      tracer.clearPoints();
      upperGraph.clearPoints();
    }
	
	refresh();

    function drawCurve() {
      const { A, B, a, b, d, t, dt, fps, deltasVal } =
        LissajousCurve;

      const upperBobPos = doublePendulum.getUpperBob();
      const lowerBobPos = doublePendulum.getLowerBob();

      base.setAttribute("r", baseRad);
      base.setAttribute("cx", x0);
      base.setAttribute("cy", y0);

      upperString.setAttribute("x1", x0);
      upperString.setAttribute("y1", y0);

      upperString.setAttribute("x2", upperBobPos.x);
      upperString.setAttribute("y2", upperBobPos.y);

      upperBob.setAttribute("r", r0);
      upperBob.setAttribute("cx", upperBobPos.x);
      upperBob.setAttribute("cy", upperBobPos.y);

      lowerString.setAttribute("x1", upperBobPos.x);
      lowerString.setAttribute("y1", upperBobPos.y);

      lowerString.setAttribute("x2", lowerBobPos.x);
      lowerString.setAttribute("y2", lowerBobPos.y);

      lowerBob.setAttribute("r", r1);
      lowerBob.setAttribute("cx", lowerBobPos.x);
      lowerBob.setAttribute("cy", lowerBobPos.y);

      const tempAng = ang0 + ang1;
      const tempPlot = Math.min(tempAng, 2 * Math.PI - tempAng);

      upperGraph.addGraphPoint(
        LissajousCurve.height * 0.5 +
          (LissajousCurve.height * 0.125 * tempPlot) / Math.PI
      );
      drawGraph();
    }

    function drawTracer() {
      tracerLine.setAttribute("d", tracer.getPointsAsString());
    }

    function drawGraph() {
      upperGraphLine.style.transform = `translateX(-${
        upperGraphLine.getBBox().width - 100
      }px)`;
      upperGraphLine.setAttribute("d", upperGraph.getPointsAsString());
    }

    function animate() {
      LissajousCurve.move();
      drawPendulum();

      tracer.addPoint(LissajousCurve.getLowerBob());
      drawTracer();
    }

    animation = setInterval(animate, 1000 / LissajousCurve.fps);

    function animationToggle(e) {
      if (!animation) {
        animation = setInterval(animate, 1000 / LissajousCurve.fps);
        animationToggleButton.innerHTML = "| |";
      } else {
        clearInterval(animation);
        animation = null;
        animationToggleButton.innerHTML = ">";
      }
    }

    function toggleMenu() {
      if (menu.style.transform == "translate(-50%, -97%)") {
        menu.style.transform = "translate(-50%, 0%)";
      } else {
        menu.style.transform = "translate(-50%, -97%)";
      }
    }

    function togglePendulum(show) {
      base.style.display = show ? "block" : "none";
      upperString.style.display = show ? "block" : "none";
      upperBob.style.display = show ? "block" : "none";
      lowerString.style.display = show ? "block" : "none";
      lowerBob.style.display = show ? "block" : "none";
    }

    function handleHold(clickX, clickY) {
      const { x0, y0, baseRad, r0, r1 } = doublePendulum;
      const upperBob = doublePendulum.getUpperBob();
      const lowerBob = doublePendulum.getLowerBob();
      if ((clickX - x0) ** 2 + (clickY - y0) ** 2 < 2.25 * baseRad ** 2) {
        tracer.clearPoints();
        doublePendulum.holdBase();
      }
      if (
        (clickX - upperBob.x) ** 2 + (clickY - upperBob.y) ** 2 <
        2.25 * r0 ** 2
      ) {
        clearInterval(animation);
        animation = null;
        tracer.clearPoints();
        doublePendulum.holdUpperBob();
      }
      if (
        (clickX - lowerBob.x) ** 2 + (clickY - lowerBob.y) ** 2 <
        2.25 * r1 ** 2
      ) {
        clearInterval(animation);
        animation = null;
        tracer.clearPoints();
        doublePendulum.holdLowerBob();
      }
    }

    function handleMove(clickX, clickY) {
      if (doublePendulum.baseHold) {
        doublePendulum.setBasePos(clickX, clickY);
        drawPendulum();
      }
      if (doublePendulum.upperBobHold) {
        doublePendulum.setUpperBobPos(clickX, clickY);
        drawPendulum();
      }
      if (doublePendulum.lowerBobHold) {
        doublePendulum.setLowerBobPos(clickX, clickY);
        drawPendulum();
      }
    }

    function handleDrop() {
      if (!animation)
        animation = setInterval(animate, 1000 / doublePendulum.fps);
      doublePendulum.dropUpperBob();
      doublePendulum.dropLowerBob();
      doublePendulum.dropBase();
    }

    window.addEventListener("mousedown", (e) => {
      const clickX = (e.x * doublePendulum.width) / canvas.clientWidth;
      const clickY = (e.y * doublePendulum.height) / canvas.clientHeight;
      handleHold(clickX, clickY);
    });

    window.addEventListener("touchstart", (e) => {
      const clickX =
        (e.touches[0].clientX * doublePendulum.width) / canvas.clientWidth;
      const clickY =
        (e.touches[0].clientY * doublePendulum.height) / canvas.clientHeight;
      handleHold(clickX, clickY);
    });

    window.addEventListener("mousemove", (e) => {
      const clickX = (e.x * doublePendulum.width) / canvas.clientWidth;
      const clickY = (e.y * doublePendulum.height) / canvas.clientHeight;
      handleMove(clickX, clickY);
    });

    window.addEventListener("touchmove", (e) => {
      const clickX =
        (e.touches[0].clientX * doublePendulum.width) / canvas.clientWidth;
      const clickY =
        (e.touches[0].clientY * doublePendulum.height) / canvas.clientHeight;
      handleMove(clickX, clickY);
    });

    window.addEventListener("mouseup", handleDrop);
    window.addEventListener("touchend", handleDrop);

    Array.from(menu.children).forEach((option) => {
      option.addEventListener("click", (e) => e.stopPropagation());
      option.addEventListener("mouseup", (e) => e.stopPropagation());
      option.addEventListener("touchend", (e) => e.stopPropagation());
    });

    animationToggleButton.addEventListener("click", animationToggle);

    window.addEventListener("keyup", (e) => {
      if (e.keyCode == 32 || e.key == " ") animationToggle();
    });	
	
