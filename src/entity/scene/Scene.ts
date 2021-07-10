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
    private entities: Map<string, Entity>;
    private runningScriptList: Script[];
    private sequentialScriptManager: SequentialScriptManager;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super();

        this.sceneManager = sceneManager;
        this.bundle = bundle ?? new Bundle();
        this.entities = new Map();
        this.runningScriptList = new Array();
        this.sequentialScriptManager = new SequentialScriptManager();
    }

    /**
     * Start the scene.
     */
    public abstract start(): void;

    public update(keyStatus: KeyStatus): void {
        this.updateRunningScripts(keyStatus);
        this.sequentialScriptManager.update(keyStatus);
        this.entities.forEach(e => e.update(keyStatus));
    }

    public render(context: CanvasRenderingContext2D): void {
        this.entities.forEach(e => e.render(context));
    }

    /**
     * Add script and run. These scripts are runs parallelly.
     * Script will be discarded after finish.
     * @param script - Script to run
     */
    public runScript(script: Script): void {
        this.runningScriptList.push(script);
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

    protected addEntity(key: string, e: Entity): void {
        this.entities.set(key, e);
    }

    protected removeEntity(key: string): void {
        this.entities.delete(key);
    }

    protected getEntity(key: string): Entity {
        const e = this.entities.get(key);
        if (!e) throw `Entity ${key} doesn't exist`;
        return e;
    }

    protected changeScene(scene: SceneId, bundle?: Bundle): void {
        this.sceneManager.changeScene(scene, bundle);
    }

    private updateRunningScripts(keyStatus: KeyStatus): void {
        this.runningScriptList.forEach(script => {
            script.update(keyStatus);
        });
        this.runningScriptList =
                this.runningScriptList.filter(script => !script.finished);
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
