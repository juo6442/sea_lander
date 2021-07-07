import IntroScene from "./IntroScene";
import Scene, { SceneId, SceneManager } from "./Scene";

export default class SceneFactory {
    /**
     * Create Scene object.
     * @param scene - Scene ID to create
     * @returns Scene object
     */
    public static getScene(scene: SceneId, manager: SceneManager): Scene {
        switch (scene) {
            case SceneId.INTRO: return new IntroScene(manager);
            case SceneId.TITLE: throw "Not implemented"; // TODO:
            case SceneId.INGAME: throw "Not implemented"; // TODO:
            default: throw `Scene ${scene} is invalid`;
        }
    }
}
