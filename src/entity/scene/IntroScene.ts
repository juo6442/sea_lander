import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import Label, { TextAlign } from "../Label";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { SceneId, SceneManager } from "./Scene";

export default class IntroScene extends Scene {
    constructor(manager: SceneManager) {
        super(manager);

        new Resource.Loader()
                .setFont("NeoDgm")
                .setImage("play", "sprite/play.png")
                .load()
                .then(resource => this.onResourceLoad(resource));
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        if (keyStatus.isPressed(Key.OK)) {
            this.changeScene(SceneId.TITLE);
        }
    }

    private onResourceLoad(resource: Resource): void {
        Logger.info("IntroScene is loaded");

        this.addEntity("rect_bg", new Rect.Builder()
                .setSizeFullscreen()
                .setColor(0, 0, 0)
                .setAlignCenter(false)
                .setPosition(0, 0)
                .build());

        this.addEntity("image_play", new Sprite.Builder()
                .setImage(resource.getImage("play"))
                .setAlignCenter(true)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT / 2)
                .build());

        this.addEntity("label_start", new Label.Builder()
                .setAlign(TextAlign.ALIGN_CENTER)
                .setColor(255, 255, 255)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT / 2 + 100)
                .setText("Enter 키를 누르세요")
                .setSize(35)
                .build());
    }
}