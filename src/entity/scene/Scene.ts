import Entity from "../Entity";
import { KeyStatus } from "../../game/KeyInput";
import Script from "../../script/Script";
import SequentialScriptRunner from "../../script/SequencialScriptRunner";

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
    private scriptRunner: SequentialScriptRunner;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super();

        this.sceneManager = sceneManager;
        this.bundle = bundle ?? new Bundle();
        this.scriptRunner = new SequentialScriptRunner();
    }

    /**
     * Start the scene.
     */
    public abstract start(): void;

    public update(keyStatus: KeyStatus): void {
        this.scriptRunner.update(keyStatus);
    }

    /**
     * Add script to queue. These scripts run sequentially.
     * Don't add script runs infinitely.
     * @see {@link Entity.addParallelScript} for an infinite script.
     * @param scriptBuilder - Function that returns a script object
     */
    protected pushScript(scriptBuilder: () => Script): void {
        this.scriptRunner.push(scriptBuilder);
    }

    protected getFromBundle(key: string): any {
        return this.bundle.get(key);
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
