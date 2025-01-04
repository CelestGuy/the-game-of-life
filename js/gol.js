let cellSizePx = 16;
let scale = 1;

let speed = 10;

let xOffset = 0;
let yOffset = 0;

let updateInterval;
let renderInterval;

let isRunning = false;

/**
 * @type {Point[]}
 */
let cells = [];
let history = [];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    hash() {
        return JSON.stringify(this);
    }

    static from(jsonString) {
        let obj = JSON.parse(jsonString);
        return new Point(Number(obj.x), Number(obj.y));
    }
}

/**
 *
 * @param {Point} coords
 * @param {Point[]} array
 */
function containsCoords(coords, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].x === coords.x && array[i].y === coords.y) {
            return true;
        }
    }
    return false;
}

function getScaledCellSize() { return cellSizePx * scale; }

function init() {
    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();
}

function setCanvasSize() {
    const lifeCanvas = document.getElementById("lifeCanvas");

    lifeCanvas.width = window.innerWidth;
    lifeCanvas.height = window.innerHeight;
}

/**
 * @param {MouseEvent} mouseEvent
 * @returns {Point}
 */
function mousePosToWorldPos(mouseEvent) {
    return new Point(
        Math.floor((mouseEvent.clientX - xOffset) / getScaledCellSize()),
        Math.floor((mouseEvent.clientY - yOffset) / getScaledCellSize())
    );
}

function play() {
    isRunning = true;
    setState(new PlayState());
}

function pause() {
    isRunning = false;
    setState(new PauseState());
}

function reset() {
    isRunning = false;
    setState(new PauseState());
    cells = [];
    history = [];
}

function setState(state) {
    const lifeCanvas = (document.getElementById("lifeCanvas"));

    lifeCanvas.onmouseup = (e => {
        state.onMouseUp(e);
    });

    lifeCanvas.onmousedown = (e => {
        state.onMouseDown(e);
    });

    lifeCanvas.onclick = (e => {
        state.onMouseClick(e);
    });

    lifeCanvas.onmousemove = (e => {
        state.onMouseDrag(e);
    });

    lifeCanvas.onwheel = (e => {
        state.onWheel(e);
    });

    let controlButtons = document.getElementsByClassName("gol-control-button");
    for (let i = 0; i < controlButtons.length; i++) {
        let button = controlButtons.item(i);
        button.classList.remove("disabled");
    }

    document.getElementById(state.getButtonId()).classList.add("disabled");
}

function mod(v, d) {
    return ((v % d) + d) % d;
}

function countNeighbours(x, y, cells) {
    let res = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }

            if (cells.indexOf(new Point(x - j, y - i)) > -1) {
                res++;
            }
        }
    }

    return res;
}

function update() {
    let copy = Array.from(cells);
    history[history.length + 1] = copy;

    for (const cell of copy) {
        const neighbours = countNeighbours(i, j, copy);
    }

    for (let i = 0; i < worldSize; i++) {
        for (let j = 0; j < worldSize; j++) {
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

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function onHistoryChange(rangeInput) {

}

function onSpeedChange(rangeInput) {
    const value = Number(rangeInput.value);

    if (value > 0) {
        speed = value;
    }

    loop();
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function drawGrid(canvas) {
    const ctx = canvas.getContext("2d");

    const lineCountV = canvas.height / getScaledCellSize();
    const lineCountH = canvas.width / getScaledCellSize();

    const width = canvas.width;
    const height = canvas.height;

    const scaledCell = getScaledCellSize();
    const hOffset = mod(xOffset, scaledCell);
    const vOffset = mod(yOffset, scaledCell);

    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    for (let i = 0; i < lineCountH; i++) {
        const x = i * scaledCell + hOffset;
        drawLine(ctx, x, 0, x, height);
    }
    for (let j = 0; j < lineCountV; j++) {
        const y = j * scaledCell + vOffset;
        drawLine(ctx, 0, y, width, y);
    }
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function drawCells(canvas) {
    const ctx = canvas.getContext("2d");

    const scaledCell = getScaledCellSize();
    ctx.fillStyle = "#FFF";

    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (cells[i][j] === true) {
                const y = j * scaledCell + yOffset;
                const x = i * scaledCell + xOffset;

                if (x + scaledCell >= 0 && x < canvas.width && y + scaledCell >= 0 && y < canvas.height) {
                    ctx.fillRect(x, y, scaledCell, scaledCell);
                }
            }
        }
    }
}

/**
 @param {HTMLCanvasElement} lifeCanvas
 */
function render(lifeCanvas) {
    clear(lifeCanvas);
    drawGrid(lifeCanvas);
    drawCells(lifeCanvas);
}

function loop() {
    if (updateInterval !== null) {
        clearInterval(updateInterval);
        updateInterval = null;
    }

    if (renderInterval !== null) {
        clearInterval(renderInterval);
        renderInterval = null;
    }

    updateInterval = setInterval(() => {
        if (isRunning) {
            update();
        }
    }, (1000 / speed));

    renderInterval = setInterval(() => {
        render(document.getElementById("lifeCanvas"));
    }, 16);
}

(function () {
    init();
    loop();
    setState(new PauseState());

    new bootstrap.Popover(document.getElementById("historyButton"), {
        html: true,
        placement: "bottom",
        title: "History",
        content: document.getElementById("historyControl").innerHTML,
        sanitize  : false
    });

    new bootstrap.Popover(document.getElementById("speedButton"), {
        html: true,
        placement: "bottom",
        title: "Speed",
        content: document.getElementById("speedControl").innerHTML,
        sanitize  : false
    });
})();