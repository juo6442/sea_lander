import { KeyStatus } from "../game/KeyInput";

export default interface Entity {
    /**
     * Updates its status per each frame.
     * @param keyStatus - Key status
     */
    update(keyStatus: KeyStatus): void;

    /**
     * Draws this entity.
     * @param context - Context of the canvas to draw this
     */
    render(context: CanvasRenderingContext2D): void;

    /**
     * Returns its validation. The owner may use this information for managing.
     * @returns false if it's invalidated
     */
    isValid(): boolean;
}
