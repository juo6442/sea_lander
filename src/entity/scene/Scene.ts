import Entity from "../Entity";
import { KeyStatus } from "../../game/KeyInput";

export enum Scene {
    INTRO,
    TITLE,
    INGAME,
}

export interface SceneManager {
    /**
     * Create a scene and change to it.
     * @param scene - Scene to change
     */
    changeScene(scene: Scene): void;
}

export class SceneEntity implements Entity {
    private sceneManager: SceneManager;
    private entities: Map<string, Entity>;

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
        this.entities = new Map();
    }

    public update(keyStatus: KeyStatus): void {
        this.entities.forEach(e => e.update(keyStatus));
    }

    public render(context: CanvasRenderingContext2D): void {
        this.entities.forEach(e => e.render(context));
    }

    public isValid(): boolean {
        return true;
    }

    protected addEntity(key: string, e: Entity): void {
        if (this.entities.has(key)) throw `Entity ${key} already exists`;
        this.entities.set(key, e);
    }

    protected removeEntity(key: string): void {
        const result = this.entities.delete(key);
        if (!result) throw `Entity ${key} doesn't exist`;
    }

    protected getEntity(key: string): Entity {
        const e = this.entities.get(key);
        if (!e) throw `Entity ${key} doesn't exist`;
        return e;
    }

    protected changeScene(scene: Scene): void {
        this.sceneManager.changeScene(scene);
    }
}
