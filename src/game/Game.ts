import Environment from "./Environment";
import KeyboardInput from "./input/KeyboardInput";
import { KeyListener } from "./input/Input";
import Scene, { Bundle, SceneId, SceneManager } from "../entity/scene/Scene";
import SceneFactory from "../entity/scene/SceneFactory";
import TouchKeyInput from "./input/TouchKeyInput";

export default class Game implements SceneManager {
    private readonly interval: number;
    private screen: Canvas;
    private keyListener: KeyListener;
    private keyboardInput: KeyboardInput;
    private touchKeyInput: TouchKeyInput;
    private currentScene: Scene | undefined;

    private lastUpdateTimestamp: number;

    constructor(screen: HTMLCanvasElement) {
        this.interval = 1000 / Environment.FPS;
        this.screen = new Canvas(screen);

        this.keyListener = new KeyListener();
        this.keyboardInput = new KeyboardInput(this.keyListener);
        this.touchKeyInput = new TouchKeyInput(this.keyListener);

        this.lastUpdateTimestamp = 0;
    }

    public changeScene(scene: SceneId, bundle?: Bundle): void {
        this.currentScene = SceneFactory.getScene(scene, this, bundle);
        this.currentScene.start();
    }

    /**
     * Starts main loop and rendering.
     */
    public start(): void {
        window.requestAnimationFrame(this.loop.bind(this));

        this.keyboardInput.registerEventListener();
        this.touchKeyInput.registerEventListener(this.screen.canvas);

        this.changeScene(SceneId.LOAD);
    }

    /**
     * Updates and draws current frame and schedules next loop.
     */
    private loop(timestamp: number): void {
        const timeDiff = timestamp - this.lastUpdateTimestamp;
        const elapsedFrame = Math.floor(timeDiff / this.interval);

        for (let i = 0; i < elapsedFrame; i++) {
            this.currentScene?.update(this.keyListener.keyStatus);
        }
        if (elapsedFrame > 0) this.currentScene?.render(this.screen.context);

        this.lastUpdateTimestamp = timestamp - (timeDiff % this.interval);

        window.requestAnimationFrame(this.loop.bind(this));
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
