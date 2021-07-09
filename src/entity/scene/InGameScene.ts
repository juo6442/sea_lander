import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneManager } from "./Scene";

export default class InGameScene extends Scene {
    private resource: Resource;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.resource = Resource.global!;
    }

    public start(): void {
        Logger.info("Start InGameScene");

        this.addEntity("image_bg", new Sprite.Builder()
                .setAlignCenter(false)
                .setPosition(0, 0)
                .setImage(this.resource.getImage("room"))
                .setSize(Environment.VIEWPORT_WIDTH, Environment.VIEWPORT_HEIGHT)
                .build());
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);
    }
}
