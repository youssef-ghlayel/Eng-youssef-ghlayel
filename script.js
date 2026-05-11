const canvas = document.getElementById("signalCanvas");
const context = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let points = [];
let matrixColumns = [];
const glyphs = "01SYSADMINERPSECURITYAI";

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const total = Math.max(48, Math.min(112, Math.floor(width / 15)));
  points = Array.from({ length: total }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    radius: 1.4 + Math.random() * 2.3,
  }));

  const columnWidth = 22;
  matrixColumns = Array.from({ length: Math.ceil(width / columnWidth) }, (_, index) => ({
    x: index * columnWidth,
    y: Math.random() * height,
    speed: 0.55 + Math.random() * 1.35,
    length: 5 + Math.floor(Math.random() * 9),
  }));
}

function drawMatrix() {
  context.font = "600 13px Consolas, 'Courier New', monospace";
  context.textAlign = "center";

  for (const column of matrixColumns) {
    if (!prefersReducedMotion) {
      column.y += column.speed;
    }

    if (column.y - column.length * 18 > height) {
      column.y = -Math.random() * 260;
      column.speed = 0.55 + Math.random() * 1.35;
    }

    for (let row = 0; row < column.length; row += 1) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const alpha = Math.max(0, 0.2 - row * 0.017);
      context.fillStyle = `rgba(139, 255, 122, ${alpha})`;
      context.fillText(char, column.x, column.y - row * 18);
    }
  }
}

function drawFrame() {
  context.clearRect(0, 0, width, height);
  drawMatrix();

  for (const point of points) {
    if (!prefersReducedMotion) {
      point.x += point.vx;
      point.y += point.vy;
    }

    if (point.x < 0 || point.x > width) point.vx *= -1;
    if (point.y < 0 || point.y > height) point.vy *= -1;

    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(23, 243, 232, 0.58)";
    context.fill();

    context.beginPath();
    context.arc(point.x, point.y, point.radius * 4.2, 0, Math.PI * 2);
    context.strokeStyle = "rgba(23, 243, 232, 0.08)";
    context.lineWidth = 1;
    context.stroke();
  }

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 150) {
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(23, 243, 232, ${0.25 * (1 - distance / 150)})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(drawFrame);
  }
}

resizeCanvas();
drawFrame();
window.addEventListener("resize", resizeCanvas);
