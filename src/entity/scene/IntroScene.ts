import Resource from "../../game/Resource";
import { SceneEntity, SceneManager } from "./Scene";

export default class IntroScene extends SceneEntity {
    constructor(manager: SceneManager) {
        super(manager);

        new Resource.Loader()
                .setFont("NeoDgm")
                .setImage("play", "play.png")
                .load()
                .then(resource => this.onResourceLoad(resource));
    }

    private onResourceLoad(resource: Resource): void {
        // TODO: make entities
    }
}