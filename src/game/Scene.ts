import Entity from "../entity/Entity";
import { KeyStatus } from "./KeyInput";

export class Scene {
    private entities: Map<string, Entity>;

    constructor() {
        this.entities = new Map<string, Entity>();
    }

    /**
     * Updates all entities for each frame.
     */
    public update(keyStatus: KeyStatus) {
        this.entities.forEach(e => e.update(keyStatus));
    }

    /**
     * Draws all entities.
     */
    public render(context: CanvasRenderingContext2D) {
        this.entities.forEach(e => e.render(context));
    }
}
