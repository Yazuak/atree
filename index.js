var max = 300, //num dots
  dotSize = 7,
  xScale = 6,
  zScale = 6,
  yScale = 16,
  startFrom = 0,
  theta = Math.PI / 16,
  yOfXAxis = 300,
  spinSpeed =  0.005, //Math.PI / 128,
  fps = 24,

  // I actually want it to be slower then 60fps
  requestAnimationFrame = function(callback) {
      window.setTimeout(callback, 1000 / fps);
  };

function run() {
  var ctx = document.getElementById('scene').getContext('2d'),
    redSpiralShadow = createSpiral({
      foreground: "#660000",
      background: "#330000",
      rotation: Math.PI,
      yLocalScale: 1.01
    }),
    redSpiral = createSpiral({
      foreground: "#ff0000",
      background: "#440000",
      rotation: Math.PI,
      yLocalScale: 1
    }),
    cyanSpiralShadow = createSpiral({
      foreground: "#003300",
      background: "#000000",
      rotation: 0,
      yLocalScale: 1.01
    }),
    cyanSpiral = createSpiral({
      foreground: "#00ffcc",
      background: "#005633",
      rotation: 0,
      yLocalScale: 1
    });

  animationLoop();


  function animationLoop() {
    renderFrame();
    if (startFrom > 1) {
      startFrom = 0;
    } else {
      startFrom += 0.1;
    }

    requestAnimationFrame(animationLoop);
  }

  function renderFrame() {
    theta += spinSpeed;
    ctx.clearRect(0, 0, 480, 640);
    ctx.beginPath();

    xScale *= 0.93;
    forEachStep(redSpiralShadow);
    forEachStep(cyanSpiralShadow);
    xScale /= 0.93;

    forEachStep(redSpiral);
    forEachStep(cyanSpiral);
  }

  function forEachStep(callback) {
    var t = -startFrom;
    for (var i = -5; i < max; i++) {
      t = callback(t);
    }
  }

  function createSpiral(config) {
    var rotation = config.rotation,
      background = config.background,
      foreground = config.foreground,
      yLocalScale = config.yLocalScale || 1;

    return function(t) {
      var dt = dotSize / Math.sqrt(dx(t, rotation)*dx(t, rotation)+dy(t)*dy(t)+dz(t, rotation)*dz(t, rotation));
      if(t > 0 && t < 26) // to get the exact value we'd need to integrate, a bit beyond the scope of this
      {
        //console.log(t + " : " + dt);
          z = getZ(t, rotation)
          x = getX(t, rotation),
          y = getY(t * yLocalScale, z);

        if (z < 0) {
          switchColor(foreground);
        } else {
          switchColor(background);
        }
        ctx.moveTo(x, y);
        ctx.lineTo(getX(t + dt / 2, rotation), getY((t + dt / 2) * yLocalScale, getZ(t + dt / 2, rotation)));
      }
      t += dt;
      return t;
    };
  }

  function switchColor(color) {
    ctx.closePath()
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.beginPath();
  }

  function getX(i, rotation) {
    return i * Math.cos(i + rotation) * xScale + 255;
  }

  function getY(i, z) {
    var y = i * yScale + 50;
    var py = (y - yOfXAxis) * Math.cos(theta) - z * Math.sin(theta) + yOfXAxis; //rotate around x axis, which is at z = 0, y = yOfXAxis
    return py;
  }

  function getZ(i, rotation) {
    return i * Math.sin(i + rotation) * zScale;
  }

  //todo: consolidate these
  function dx(t, rotation)
  {
    return (Math.cos(t + rotation) - t * Math.sin(t + rotation)) * xScale;
  }

  function dy(t)
  {
    return yScale;
  }

  function dz(t, rotation)
  {
    return (Math.sin(t + rotation) + t * Math.cos(t + rotation)) * zScale;
  }
}
