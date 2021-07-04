import Environment from "./Environment";

export default class Game {
    private screen: Canvas;
    private buffer: Canvas;

    constructor(screen: HTMLCanvasElement) {
        this.screen = new Canvas(screen);
        this.buffer = new Canvas(this.createSameCanvas(screen));
        this.buffer.context2d.imageSmoothingEnabled = false;
    }

    /**
     * Starts main loop and rendering.
     */
    public start() {
        setInterval(this.update.bind(this), 1000 / Environment.FPS);
        window.requestAnimationFrame(() => this.render());
    }

    /**
     * Updates all game entities for each frame.
     */
    private update() {
    }

    /**
     * Draws all game entities and schedules next frame rendering.
     */
    private render() {
        // TODO: Draw to this.buffer
        this.screen.context2d.drawImage(this.buffer.canvas,
                0, 0,
                this.screen.canvas.width, this.screen.height);

        window.requestAnimationFrame(() => this.render());
    }

    /**
     * Returns a new canvas with the same size of the given canvas.
     *
     * @param canvas - Original canvas to refer
     * @returns A new canvas
     */
    private createSameCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        return newCanvas;
    }
}

class Canvas {
    readonly canvas: HTMLCanvasElement;
    readonly context2d: CanvasRenderingContext2D;

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        const context2d = canvas.getContext("2d");
        if (!context2d) throw "2D canvas context is not available";
        this.context2d = context2d;
    }
}
