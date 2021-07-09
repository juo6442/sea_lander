import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import Label, { TextAlign } from "../Label";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneManager } from "./Scene";

export default class TitleScene extends Scene {
    private resource: Resource;
    private isWaitingInput: boolean;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.resource = this.getFromBundle("resource");
        this.isWaitingInput = false;
    }

    public start(): void {
        Logger.info("Start TitleScene");

        this.resource = this.getFromBundle("resource") as Resource;


        this.addEntity("rect_bg", new Rect.Builder()
                .setSizeFullscreen()
                .setColor(255, 255, 255)
                .setAlignCenter(false)
                .setPosition(0, 0)
                .build());
        /*
        TODO: Show title images
        TODO: Show scoreboard (highlight latest score)
        */

        this.addEntity("label_pressEnter", new Label.Builder()
                .setAlign(TextAlign.ALIGN_CENTER)
                .setColor(0, 0, 0)
                .setText("엔터를 누르면 시작합니다")
                .setSize(30)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT / 2)
                .build());
    }

    public override update(keyStatus: KeyStatus) {
        super.update(keyStatus);

        if (this.isWaitingInput) this.waitOkKey(keyStatus);
    }

    private waitOkKey(keyStatus: KeyStatus): void {
        if (keyStatus.isPressed(Key.OK)) {
            this.isWaitingInput = false;

            // TODO: Switch to PlayScene
        }
    }
}
