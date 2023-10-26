import { Universe} from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg.wasm";

const Theme = {
  Dark: {
    Grid: "#000",
    Dead: "#000000",
    Alive: "#FFF",
  },
  Light: {
    Grid: "#CCCCCC",
    Dead: "#FFFFFF",
    Alive: "#000000"
  }
}

const CELL_SIZE = 2; // px
let theme = "Dark"

function getGridColor() {
  return Theme[theme].Grid
}

function getDeadColor() {
  return Theme[theme].Dead
}

function getAliveColor() {
  return Theme[theme].Alive
}

const universe = Universe.new(224, 224);
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width= (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
  universe.tick();
  drawGrid();
  drawCells();
  
  requestAnimationFrame(renderLoop);
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);


console.log('Welcome to life');

function drawGrid() {
  ctx.beginPath();
  ctx.strokeStyle = getGridColor();

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

function getIndex(row, column) {
  return row * width + column;
}

function drawCells() {
  const cellsPtr = universe.cells();

  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = bitIsSet(idx, cells)
        ? getAliveColor()
        : getDeadColor();

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

function bitIsSet(n, arr) {
  const byte = Math.floor(n / 8);
  const mask = 1 << (n % 8);
  return (arr[byte] & mask) === mask;
};