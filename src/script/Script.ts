import { Color, Position, Size } from "../entity/Entity";
import { KeyStatus } from "../game/KeyInput";

export default abstract class Script {
    private _finished: boolean;

    constructor() {
        this._finished = false;
    }

    get finished(): boolean {
        return this._finished;
    }

    /**
     * Updates its status per each frame.
     * `this.finish()` should be called here when finished.
     * @param keyStatus - Key status
     */
    public abstract update(keyStatus: KeyStatus): void;

    /**
     * Finishes the script execution. Its owner may remove it.
     */
    protected finish(): void {
        this._finished = true;
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
