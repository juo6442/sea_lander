import Environment from "./Environment";
import { KeyListener } from "./KeyInput";
import { Scene, SceneEntity, SceneManager } from "../entity/scene/Scene";
import SceneFactory from "../entity/scene/SceneFactory";

export default class Game implements SceneManager {
    private screen: Canvas;
    private buffer: Canvas;

    private keyListener: KeyListener;

    private currentScene: SceneEntity | undefined;

    constructor(screen: HTMLCanvasElement) {
        this.screen = new Canvas(screen);
        this.buffer = this.createSameCanvas(this.screen);
        this.buffer.context.imageSmoothingEnabled = false;

        this.keyListener = new KeyListener();
    }

    public changeScene(scene: Scene): void {
        this.currentScene = SceneFactory.getSceneEntity(scene, this);
    }

    /**
     * Starts main loop and rendering.
     */
    public start(): void {
        setInterval(this.update.bind(this), 1000 / Environment.FPS);
        window.requestAnimationFrame(() => this.render());

        this.keyListener.registerEventListener();

        this.changeScene(Scene.INTRO);
    }

    /**
     * Called for each frame to update and run logic.
     */
    private update(): void {
        this.currentScene?.update(this.keyListener.keyStatus);
    }

    /**
     * Draws current status to buffer and schedules next rendering.
     */
    private render(): void {
        this.currentScene?.render(this.buffer.context);

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
