let cellSizePx = 16;
let scale = 1;

let loopTimeMs = 128;

let xOffset = 0;
let yOffset = 0;

let updateInterval;
let renderInterval;

let worldSize = 64;
let cells = [];

let isRunning = false;

class Coords {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 *
 * @param {Coords} coords
 * @param {Coords[]} array
 */
function containsCoords(coords, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].x === coords.x && array[i].y === coords.y) {
            return true;
        }
    }
    return false;
}

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

class GameState {
    onMouseUp(e) {}

    onMouseDown(e) {}

    /**
     * @param {MouseEvent} e
     */
    onMouseClick(e) {}

    /**
     * @param {MouseEvent} e
     */
    onMouseDrag(e) {}

    /**
     * @param {WheelEvent} e
     */
    onWheel(e) {
        scale = Math.max(0.5, scale + (scale * (e.deltaY / 10000)));
        console.log(scale);
    }
}

/**
 * @param {Coords} pos
 * @param cells
 */
function invertCellValue(pos, cells) {
    if (pos.x >= 0 && pos.x < worldSize && pos.y >= 0 && pos.y < worldSize) {
        cells[pos.x][pos.y] = !cells[pos.x][pos.y];
    }
}

class PauseState extends GameState {
    startX = 0;
    startY = 0;
    isDown = false;
    coordsUpdated = [];

    onMouseDown(e) {
        e.preventDefault();
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.isDown = true;
        this.coordsUpdated = [];
    }

    onMouseUp(e) {
        this.isDown = false;
        let pos = mousePosToWorldPos(e);

        if (!containsCoords(pos, this.coordsUpdated)) {
            invertCellValue(pos, cells);
            this.coordsUpdated.push(pos);
        }
    }

    onMouseClick(e) {
    }

    onMouseDrag(e) {
        super.onMouseDrag(e);

        if (this.isDown) {
            let pos = mousePosToWorldPos(e);

            console.log(this.coordsUpdated, this.coordsUpdated.includes(pos));

            if (!containsCoords(pos, this.coordsUpdated)) {
                invertCellValue(pos, cells);
                this.coordsUpdated.push(pos);
            }
        }
    }
}

class PlayState extends GameState {
    startX = 0;
    startY = 0;
    isDown = false;

    onMouseUp(e) {
        this.isDown = false;
    }

    onMouseDown(e) {
        this.isDown = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    onMouseClick(e) {
        super.onMouseClick(e);
    }

    onMouseDrag(e) {
        super.onMouseDrag(e);

        if (this.isDown) {
            xOffset += (e.clientX - this.startX);
            yOffset += (e.clientY - this.startY);
            this.startX = e.clientX;
            this.startY = e.clientY;
        }
    }
}


function getScaledCellSize() { return cellSizePx * scale; }

function setCells() {
    for (let i = 0; i < worldSize; i++) {
        cells[i] = [];
        for (let j = 0; j < worldSize; j++) {
            cells[i][j] = false;
        }
    }
}

function init() {
    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();
    setCells();
}

function setCanvasSize() {
    const lifeCanvas = document.getElementById("lifeCanvas");

    lifeCanvas.width = window.innerWidth;
    lifeCanvas.height = window.innerHeight;
}

/**
 * @param {MouseEvent} mouseEvent
 * @returns {Coords}
 */
function mousePosToWorldPos(mouseEvent) {
    return new Coords(
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
    setCells();
    setState(new PauseState());
}

/**
 * Sets the cursor's state
 * @param {GameState} state
 */
function setState(state) {
    /**
     * @type {HTMLCanvasElement}
     */
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

function update() {
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

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
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

    const x1 = clamp(xOffset, 0, width);
    const y1 = clamp(yOffset, 0, height);

    const x2 = clamp(worldSize * scaledCell + xOffset, 0, width);
    const y2 = clamp(worldSize * scaledCell + yOffset, 0, height);

    drawRect(ctx, x1, y1, x2, y2);

    for (let i = 0; i < lineCountH; i++) {
        const x = i * scaledCell + hOffset;
        drawLine(ctx, x, 0, x, height);
    }
    for (let j = 0; j < lineCountV; j++) {
        const y = j * scaledCell + vOffset;
        drawLine(ctx, 0, y, width, y);
    }
}

function drawRect(ctx, x1, y1, x2, y2) {
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.closePath();
}

function drawCell(ctx, x, y) {
    const scaledCell = getScaledCellSize();
    drawRect(ctx, x, y, x + scaledCell, y + scaledCell);
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
                    drawCell(ctx, x, y);
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
    updateInterval = setInterval(() => {
        if (isRunning) {
            update();
        }
    }, loopTimeMs);

    renderInterval = setInterval(() => {
        render(document.getElementById("lifeCanvas"));
    }, loopTimeMs);
}

(function () {
    init();
    loop();
    setState(new PauseState());
})();