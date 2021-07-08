import { KeyStatus } from "../game/KeyInput";
import Script from "../script/Script";
import NumberUtil from "../util/NumberUtil";

export default abstract class Entity {
    private _invalidated: boolean;
    private scriptQueue: Script[];
    private onScriptFinished: (() => void) | undefined;

    constructor() {
        this._invalidated = false;
        this.scriptQueue = new Array();
    }

    get invalidated(): boolean {
        return this._invalidated;
    }

    protected get currentScript(): Script | undefined {
        return this.scriptQueue[0];
    }

    /**
     * Updates its status per each frame.
     * @param keyStatus - Key status
     */
    public update(keyStatus: KeyStatus): void {
        if (this.currentScript && this.currentScript.finished) {
            this.scriptQueue.shift();
            if (!this.scriptQueue && this.onScriptFinished) {
                this.onScriptFinished();
                this.onScriptFinished = undefined;
            }
        }
        this.currentScript?.update(keyStatus);
    }

    /**
     * Draws this entity.
     * @param context - Context of the canvas to draw this
     */
    public abstract render(context: CanvasRenderingContext2D): void;

    /**
     * Add script to queue.
     * @param script - Script to run
     */
    public pushScript(script: Script): void {
        this.scriptQueue.push(script);
    }

    /**
     * Set callback to run when script queue is empty.
     * The callback will be discarded after run once.
     * @param callback - Callback to run
     */
    public setScriptFinishedCallback(callback?: (() => void)) {
        this.onScriptFinished = callback;
    }

    /**
     * Invalidate this entity. The owner may use this information for managing.
     * The status can be checked using `Entity.invalidated()`.
     */
    protected invalidate(): void {
        this._invalidated = true;
    }
}

export class Position {
    public left: number;
    public top: number;

    constructor(left: number, top: number) {
        this.left = left;
        this.top = top;
    }
}

export class Size {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    constructor(r: number, g: number, b: number, a: number = 1) {
        this._r = NumberUtil.fitIn(r, 0, 255);
        this._g = NumberUtil.fitIn(g, 0, 255);
        this._b = NumberUtil.fitIn(b, 0, 255);
        this._a = NumberUtil.fitIn(a, 0, 255);
    }

    set r(value: number) {
        this._r = NumberUtil.fitIn(value, 0, 255);
    }

    set g(value: number) {
        this._g = NumberUtil.fitIn(value, 0, 255);
    }

    set b(value: number) {
        this._b = NumberUtil.fitIn(value, 0, 255);
    }

    set a(value: number) {
        this._a = NumberUtil.fitIn(value, 0, 255);
    }

    get r() { return this._r; }
    get g() { return this._g; }
    get b() { return this._b; }
    get a() { return this._a; }
}
