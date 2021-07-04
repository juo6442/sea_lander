import { KeyStatus } from "../game/KeyInput";

export default interface Entity {
    invalidated: boolean;

    update(keyStatus: KeyStatus): void;
    render(context: CanvasRenderingContext2D): void;
}
