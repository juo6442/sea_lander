import IntroScene from "./IntroScene";
import { Scene, SceneEntity, SceneManager } from "./Scene";

export default class SceneFactory {
    /**
     * Create SceneEntity object.
     * @param scene - Scene to create
     * @returns SceneEntity object
     */
    public static getSceneEntity(scene: Scene, manager: SceneManager): SceneEntity {
        switch (scene) {
            case Scene.INTRO: return new IntroScene(manager);
            case Scene.TITLE: throw "Not implemented"; // TODO:
            case Scene.INGAME: throw "Not implemented"; // TODO:
            default: throw `Scene ${scene} is invalid`;
        }
    }
}
