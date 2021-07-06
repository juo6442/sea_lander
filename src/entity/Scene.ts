import Entity from "./Entity";
import { KeyStatus } from "../game/KeyInput";

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

    protected changeScene(scene: Scene): void {
        this.sceneManager.changeScene(scene);
    }
}

export class SceneFactory {
    /**
     * Create SceneEntity object.
     * @param scene - Scene to create
     * @returns SceneEntity object
     */
    public static getSceneEntity(scene: Scene): SceneEntity {
        switch (scene) {
            case Scene.INTRO: throw "Not implemented"; // TODO:
            case Scene.TITLE: throw "Not implemented"; // TODO:
            case Scene.INGAME: throw "Not implemented"; // TODO:
            default: throw `Scene ${scene} is invalid`;
        }
    }
}
