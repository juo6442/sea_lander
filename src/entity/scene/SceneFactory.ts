import InGameScene from "./InGameScene";
import IntroScene from "./IntroScene";
import LoadScene from "./LoadScene";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";
import TitleScene from "./TitleScene";

export default class SceneFactory {
    /**
     * Create Scene object.
     * @param scene - Scene ID to create
     * @returns Scene object
     */
    public static getScene(scene: SceneId, manager: SceneManager, bundle?: Bundle): Scene {
        switch (scene) {
            case SceneId.LOAD: return new LoadScene(manager, bundle);
            case SceneId.INTRO: return new IntroScene(manager, bundle);
            case SceneId.TITLE: return new TitleScene(manager, bundle);
            case SceneId.INGAME: return new InGameScene(manager, bundle);
            default: throw `Scene ${scene} is invalid`;
        }
    }
}
