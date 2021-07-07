import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import { SceneEntity, SceneManager } from "./Scene";

export default class IntroScene extends SceneEntity {
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