import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import Scene, { SceneManager } from "./Scene";

export default class IntroScene extends Scene {
    constructor(manager: SceneManager) {
        super(manager);

        new Resource.Loader()
                .setFont("NeoDgm")
                .setImage("play", "sprite/play.png")
                .load()
                .then(resource => this.onResourceLoad(resource));
    }

    private onResourceLoad(resource: Resource): void {
        Logger.info("IntroScene is loaded");
    }
}