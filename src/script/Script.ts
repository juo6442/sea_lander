import { Color, Position, Size } from "../entity/Entity";
import { KeyStatus } from "../game/KeyInput";

export default abstract class Script {
    readonly isInfinite: boolean;
    private _finished: boolean;

    /**
     * @param isInfinite - Set for informative purpose
     */
    constructor(isInfinite?: boolean) {
        this._finished = false;
        this.isInfinite = isInfinite ?? false;
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
