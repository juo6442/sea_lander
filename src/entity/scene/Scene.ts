import Entity from "../Entity";
import { KeyStatus } from "../../game/KeyInput";

export enum SceneId {
    LOAD,
    TITLE,
    INGAME,
}

export interface SceneManager {
    /**
     * Create a scene and change to it.
     * @param scene - Scene to change
     * @param bundle - It will be passed to the new scene
     */
    changeScene(scene: SceneId, bundle?: Bundle): void;
}

export default abstract class Scene extends Entity {
    private sceneManager: SceneManager;
    private bundle: Bundle;
    private entities: Map<string, Entity>;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super();

        this.sceneManager = sceneManager;
        this.bundle = bundle ?? new Bundle();
        this.entities = new Map();
    }

    /**
     * Start the scene.
     */
    public abstract start(): void;

    public update(keyStatus: KeyStatus): void {
        this.entities.forEach(e => e.update(keyStatus));
    }

    public render(context: CanvasRenderingContext2D): void {
        this.entities.forEach(e => e.render(context));
    }

    protected getFromBundle(key: string): any {
        return this.bundle.get(key);
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

    protected changeScene(scene: SceneId, bundle?: Bundle): void {
        this.sceneManager.changeScene(scene, bundle);
    }
}

export class Bundle {
    private bundle: Map<string, any>;

    constructor() {
        this.bundle = new Map();
    }

    set(key: string, value: any) {
        this.bundle.set(key, value);
    }

    get(key: string): any {
        return this.bundle.get(key);
    }
}
