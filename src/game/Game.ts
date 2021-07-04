import Environment from "./Environment";
import { KeyListener } from "./KeyInput";

export default class Game {
    private screen: Canvas;
    private buffer: Canvas;

    private keyListener: KeyListener;

    constructor(screen: HTMLCanvasElement) {
        this.screen = new Canvas(screen);
        this.buffer = this.createSameCanvas(this.screen);
        this.buffer.context.imageSmoothingEnabled = false;

        this.keyListener = new KeyListener();
    }

    /**
     * Starts main loop and rendering.
     */
    public start() {
        setInterval(this.update.bind(this), 1000 / Environment.FPS);
        window.requestAnimationFrame(() => this.render());

        this.keyListener.registerEventListener();
    }

    /**
     * Called for each frame to update and run logic.
     */
    private update() {
    }

    /**
     * Draws current status to buffer and schedules next rendering.
     */
    private render() {
        // TODO: Draw to this.buffer
        this.screen.context.drawImage(this.buffer.canvas,
                0, 0,
                this.screen.width, this.screen.height);

        window.requestAnimationFrame(() => this.render());
    }

    /**
     * Returns a new canvas with the same size of the given canvas.
     *
     * @param canvas - Original canvas to refer
     * @returns A new canvas
     */
    private createSameCanvas(canvas: Canvas): Canvas {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        return new Canvas(newCanvas);
    }
}

class Canvas {
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        const context = canvas.getContext("2d");
        if (!context) throw "2D canvas context is not available";
        this.context = context;
    }
}
