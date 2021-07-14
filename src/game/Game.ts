import Environment from "./Environment";
import { KeyListener } from "./KeyInput";
import Scene, { Bundle, SceneId, SceneManager } from "../entity/scene/Scene";
import SceneFactory from "../entity/scene/SceneFactory";

export default class Game implements SceneManager {
    private screen: Canvas;

    private keyListener: KeyListener;

    private currentScene: Scene | undefined;

    constructor(screen: HTMLCanvasElement) {
        this.screen = new Canvas(screen);
        this.keyListener = new KeyListener();
    }

    public changeScene(scene: SceneId, bundle?: Bundle): void {
        this.currentScene = SceneFactory.getScene(scene, this, bundle);
        this.currentScene.start();
    }

    /**
     * Starts main loop and rendering.
     */
    public start(): void {
        setInterval(this.update.bind(this), 1000 / Environment.FPS);
        window.requestAnimationFrame(() => this.render());

        this.keyListener.registerEventListener();

        this.changeScene(SceneId.LOAD);
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
        this.currentScene?.render(this.screen.context);
        window.requestAnimationFrame(() => this.render());
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
