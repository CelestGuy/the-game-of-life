let cellSizePx = 16;
let scale = 2;

let loopTimeMs = 128;

let vOffset = 0;
let hOffset = 0;

let interval;

let worldSize = 64;
let cells = [];

let isRunning = false;

class MouseState {
    /**
     * @param {MouseEvent} e
     */
    onMouseClick(e) {

    }

    /**
     * @param {MouseEvent} e
     */
    onMouseDrag(e) {

    }
}

class MovingState extends MouseState {
    onMouseClick(e) {
        super.onMouseClick(e);
        let pos = mousePosToWorldPos(e);

        console.log(pos);
        cells[pos[0]][pos[1]] = !cells[pos[0]][pos[1]];

    }

    onMouseDrag(e) {
        super.onMouseDrag(e);
    }
}

class ToggleState extends MouseState {
    onMouseClick(e) {
        super.onMouseClick(e);
    }

    onMouseDrag(e) {
        super.onMouseDrag(e);
    }
}


function lineSpacing() { return cellSizePx * scale; }

function init() {
    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();

    for (let i = 0; i < worldSize; i++) {
        cells[i] = [];
        for (let j = 0; j < worldSize; j++) {
            cells[i][j] = false;
        }
    }
}

function setCanvasSize() {
    const lifeCanvas = document.getElementById("lifeCanvas");

    lifeCanvas.width = window.innerWidth;
    lifeCanvas.height = window.innerHeight;
}

/**
 * @param {MouseEvent} mouseEvent
 * @returns {number[2]}
 */
function mousePosToWorldPos(mouseEvent) {
    return [
        Math.floor((mouseEvent.clientX - hOffset) / lineSpacing()),
        Math.floor((mouseEvent.clientY - vOffset) / lineSpacing())
    ];
}

function play() {
    isRunning = true;
}

function pause() {
    isRunning = false;
}

function reset() {
    clearInterval(interval);
    interval = null;
}

/**
 * Sets the cursor's state
 * @param {MouseState} state
 */
function setState(state) {
    /**
     * @type {HTMLCanvasElement}
     */
    const lifeCanvas = (document.getElementById("lifeCanvas"));

    lifeCanvas.onclick = state.onMouseClick;
    lifeCanvas.onmousemove = state.onMouseDrag;
}

function mod(v, d) {
    return ((v % d) + d) % d;
}

function copyCells(cells) {
    let copy = [];

    for (let i = 0; i < worldSize; i++) {
        copy[i] = [];
        for (let j = 0; j < worldSize; j++) {
            copy[i][j] = Boolean(cells[i][j]);
        }
    }

    return copy;
}

function countNeighbours(x, y, cells) {
    let res = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }

            if (cells[mod(x - i, worldSize)][mod(y - j, worldSize)] === true) {
                res++;
            }
        }
    }

    return res;
}

/**
 @param {HTMLCanvasElement} lifeCanvas
 */
function update(lifeCanvas) {
    let copy = copyCells(cells);

    for (let i = 0; i < worldSize; i++) {
        for (let j = 0; j < worldSize; j++) {
            const neighbours = countNeighbours(i, j, copy);

            const isAlive = Boolean(copy[i][j]);
            let willLive = false;

            if (isAlive) {
                if (neighbours === 2 || neighbours === 3) {
                    willLive = true;
                }
            } else if (neighbours === 3) {
                willLive = true;
            }

            cells[i][j] = willLive;
        }
    }
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function clear(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function renderGrid(canvas) {
    const ctx = canvas.getContext("2d");

    const lineCountV = canvas.height / lineSpacing();
    const lineCountH = canvas.width / lineSpacing();

    const width = canvas.width;
    const height = canvas.height;

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    for (let i = 0; i < lineCountH; i++) {
        const x = i * lineSpacing() + hOffset;
        drawLine(ctx, x, 0, x, height);
    }
    for (let j = 0; j < lineCountV; j++) {
        const y = j * lineSpacing() + vOffset;
        drawLine(ctx, 0, y, width, y);
    }
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function drawCell(ctx, x, y) {
    ctx.beginPath();
    ctx.rect(x, y, cellSizePx * scale, cellSizePx * scale);
    ctx.fill();
    ctx.closePath();
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function renderCells(canvas) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFF";

    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (cells[i][j] === true) {
                const y = j * lineSpacing() + vOffset;
                const x = i * lineSpacing() + hOffset;
                drawCell(ctx, x, y);
            }
        }
    }
}

/**
 @param {HTMLCanvasElement} lifeCanvas
 */
function render(lifeCanvas) {
    clear(lifeCanvas);
    renderGrid(lifeCanvas);
    renderCells(lifeCanvas);
}

function loop() {
    interval = setInterval(() => {
        const lifeCanvas = document.getElementById("lifeCanvas");

        if (isRunning) {
            update(lifeCanvas);
        }

        render(lifeCanvas);

    }, loopTimeMs);
}

(function () {
    init();
    loop();
    setState(new MovingState());
})();