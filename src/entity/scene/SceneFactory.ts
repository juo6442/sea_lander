import LoadScene from "./LoadScene";
import Scene, { SceneId, SceneManager } from "./Scene";
import TitleScene from "./TitleScene";

export default class SceneFactory {
    /**
     * Create Scene object.
     * @param scene - Scene ID to create
     * @returns Scene object
     */
    public static getScene(scene: SceneId, manager: SceneManager): Scene {
        switch (scene) {
            case SceneId.LOAD: return new LoadScene(manager);
            case SceneId.TITLE: return new TitleScene(manager);
            case SceneId.INGAME: throw "Not implemented"; // TODO:
            default: throw `Scene ${scene} is invalid`;
        }
    }
}
