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

    getButtonId() {
        return "";
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

    getButtonId() {
        return "pauseButton";
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

    getButtonId() {
        return "playButton";
    }
}
