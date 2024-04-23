const baseWidth = 500;
const baseHeight = 500;

let cellSizePx = 1;
let scale = 10;
let x = baseWidth / 2;
let y= baseHeight / 2;

let loopTimeMs = 1000;

let interval;
let running = false;

class MouseState {
    /**
     * @param {MouseEvent} e
     */
    onMouseClick(e);

    /**
     * @param {MouseEvent} e
     */
    onMouseDrag(e);

    /**
     * @param {MouseEvent} e
     */
    onMouseDragStart(e);

    /**
     * @param {MouseEvent} e
     */
    onMouseDragEnd(e);
}

class MovingState extends MouseState {
    onMouseClick(e) {

    }

    onMouseDrag(e) {

    }

    onMouseDragStart(e) {

    }

    onMouseDragEnd(e) {

    }
}

class ToggleState extends MouseState {
    onMouseClick(e) {

    }

    onMouseDrag(e) {

    }

    onMouseDragStart(e) {

    }

    onMouseDragEnd(e) {

    }
}

function play() {
    if (interval !== null) {
        interval.resume();
    } else {
        loop();
    }
}

function stop() {
    interval.stop();
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
    lifeCanvas.ondrag = state.onMouseDrag;
    lifeCanvas.ondragstart = state.onMouseDragStart;
    lifeCanvas.ondragend = state.onMouseDragEnd;
}

function update() {

}

/**
 * @param {HTMLCanvasElement} canvas
 */
function clear(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function drawGrid(canvas) {
    const ctx = canvas.getContext("2d");

    const lineSpacing = cellSizePx * scale;

    const lineCountV = canvas.width / lineSpacing;
    const lineCountH = canvas.height / lineSpacing;
    const vOffset = 0;
    const hOffset = 0;

    for (let i = 0; i < lineCountH; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
    }
    for (let j = 0; j < lineCountV; j++) {

    }
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function drawCells(canvas) {

}

function render() {
    /**
     * @type {HTMLCanvasElement}
     */
    const lifeCanvas = (document.getElementById("lifeCanvas"));

    drawGrid(lifeCanvas);
    drawCells(lifeCanvas);
}

function loop() {
    interval = setInterval(() => {
        update();
        clear();
        render();
    }, loopTimeMs);
}