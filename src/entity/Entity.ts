import { KeyStatus } from "../game/KeyInput";
import NumberUtil from "../util/NumberUtil";

export default abstract class Entity {
    private _invalidated: boolean;

    constructor() {
        this._invalidated = false;
    }

    get invalidated(): boolean {
        return this._invalidated;
    }

    /**
     * Updates its status per each frame.
     * @param keyStatus - Key status
     */
    public abstract update(keyStatus: KeyStatus): void;

    /**
     * Draws this entity.
     * @param context - Context of the canvas to draw this
     */
    public abstract render(context: CanvasRenderingContext2D): void;

    /**
     * Invalidate this entity. The owner may use this information for managing.
     * The status can be checked using `Entity.invalidated()`.
     */
    public invalidate(): void {
        this._invalidated = true;
    }
}

export interface EntityWithPosition {
    position: Position;
}

export interface EntityWithSize {
    size: Size;
}

export interface EntityWithColor {
    color: Color;
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
        this._a = NumberUtil.fitIn(a, 0, 1);
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
        this._a = NumberUtil.fitIn(value, 0, 1);
    }

    get r() { return this._r; }
    get g() { return this._g; }
    get b() { return this._b; }
    get a() { return this._a; }

    public toString(): string {
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
    }
}
