import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import Label, { TextAlign } from "../Label";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";

export default class TitleScene extends Scene {
    private isWaitingInput: boolean;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.isWaitingInput = false;

        this.addEntity(new Rect.Builder()
                .setSizeFullscreen()
                .setColor(255, 255, 255)
                .setPosition(0, 0)
                .build());
        this.addEntity(new Label.Builder()
                .setAlign(TextAlign.ALIGN_CENTER)
                .setColor(0, 0, 0)
                .setText("엔터를 누르면 시작합니다")
                .setSize(30)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT / 2)
                .build());
    }

    public start(): void {
        Logger.info("Start TitleScene");

        /*
        TODO: Show title images
        TODO: Show scoreboard (highlight latest score)
        */

        this.showTitle();
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        if (this.isWaitingInput) this.waitOkKey(keyStatus);
    }

    private showTitle(): void {
        this.isWaitingInput = true;
    }

    private waitOkKey(keyStatus: KeyStatus): void {
        if (!keyStatus.isPressed(Key.OK)) return;

        this.isWaitingInput = false;

        this.changeScene(SceneId.INGAME);
    }
}
