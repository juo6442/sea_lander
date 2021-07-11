import Entity from "../Entity";
import { KeyStatus } from "../../game/KeyInput";
import Script from "../../script/Script";

export enum SceneId {
    LOAD,
    INTRO,
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
    private sequentialScriptManager: SequentialScriptManager;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super();

        this.sceneManager = sceneManager;
        this.bundle = bundle ?? new Bundle();
        this.sequentialScriptManager = new SequentialScriptManager();
    }

    /**
     * Start the scene.
     */
    public abstract start(): void;

    public update(keyStatus: KeyStatus): void {
        this.sequentialScriptManager.update(keyStatus);
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

    protected getFromBundle(key: string): any {
        return this.bundle.get(key);
    }

    protected changeScene(scene: SceneId, bundle?: Bundle): void {
        this.sceneManager.changeScene(scene, bundle);
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
