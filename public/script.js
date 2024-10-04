const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = 0.98 * window.innerHeight;
const ctx = canvas.getContext("2d");
let x = 0,
  y = 0;
let mousedown = false;

const socket = io();
const lineWidthRange = document.getElementById("lineWidthRange");
ctx.lineWidth = lineWidthRange.value;

lineWidthRange.addEventListener("input", (e) => {
  ctx.lineWidth = e.target.value;
});

// Function to set stroke color
const setStrokeColor = (color) => {
  ctx.strokeStyle = color;
};

// Add event listeners to buttons
const buttons = document.querySelectorAll(".btn-box button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const color = button.getAttribute("data-color");
    setStrokeColor(color);
  });
});

window.onmousedown = (e) => {
  x = e.clientX;
  y = e.clientY;
  ctx.beginPath();
  ctx.moveTo(x, y);

  socket.emit("down", { x, y });
  mousedown = true;
};

window.onmouseup = () => {
  mousedown = false;
  ctx.closePath();
};

socket.on("onDraw", (data) => {
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
});

socket.on("onDown", ({ x, y }) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
});

window.onmousemove = (e) => {
  x = e.clientX;
  y = e.clientY;

  if (mousedown) {
    socket.emit("draw", { x, y });
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};

// Set initial stroke color
setStrokeColor("black");
