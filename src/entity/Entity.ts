import { KeyStatus } from "../game/KeyInput";
import Script from "../script/Script";
import NumberUtil from "../util/NumberUtil";

export default abstract class Entity {
    private _invalidated: boolean;
    private runningScriptList: Script[];
    private sequentialScriptManager: SequentialScriptManager;

    constructor() {
        this._invalidated = false;
        this.runningScriptList = new Array();
        this.sequentialScriptManager = new SequentialScriptManager();
    }

    get invalidated(): boolean {
        return this._invalidated;
    }

    /**
     * Updates its status per each frame.
     * @param keyStatus - Key status
     */
    public update(keyStatus: KeyStatus): void {
        this.updateRunningScripts(keyStatus);
        this.sequentialScriptManager.update(keyStatus);
    }

    /**
     * Draws this entity.
     * @param context - Context of the canvas to draw this
     */
    public abstract render(context: CanvasRenderingContext2D): void;

    /**
     * Add script and run. These scripts are runs parallelly.
     * Script will be discarded after finish.
     * @param script - Script to run
     */
    public runScript(script: Script): void {
        this.runningScriptList.push(script);
    }

    /**
     * Add script to queue. These scripts are runs sequentially.
     * Don't add script runs infinitely.
     * @see {@link Entity.addParallelScript} for an infinite script.
     * @param scriptBuilder - Function that returns a script object
     */
    public pushScript(scriptBuilder: () => Script): void {
        this.sequentialScriptManager.push(scriptBuilder);
    }

    /**
     * Invalidate this entity. The owner may use this information for managing.
     * The status can be checked using `Entity.invalidated()`.
     */
    protected invalidate(): void {
        this._invalidated = true;
    }

    private updateRunningScripts(keyStatus: KeyStatus): void {
        this.runningScriptList.forEach(script => {
            script.update(keyStatus);
        });
        this.runningScriptList =
                this.runningScriptList.filter(script => !script.finished);
    }
}

class SequentialScriptManager {
    private queue: (() => Script)[];
    private currentScript: Script | undefined;

    constructor() {
        this.queue = new Array();
    }

    public push(scriptBuilder: () => Script): void {
        this.queue.push(scriptBuilder);
    }

    public update(keyStatus: KeyStatus): void {
        if (this.currentScript) {
            this.currentScript.update(keyStatus);
            if (this.currentScript.finished) this.currentScript = undefined;
        } else {
            this.currentScript = this.queue.shift()?.();
        }
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
