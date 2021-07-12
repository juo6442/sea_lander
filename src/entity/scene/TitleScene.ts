import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import { CommonScript } from "../../script/CommonScript";
import Logger from "../../util/Logger";
import Label, { TextAlign } from "../Label";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";

export default class TitleScene extends Scene {
    private fadeRect: Rect;
    private bgSprite: Sprite;
    private headSprite: Sprite;
    private titleLabel: Label;
    private promptLabel: Label;
    private headTransitionScript: CommonScript.WaveTransition;
    private promptBlinkScript: CommonScript.Blink | undefined;

    private isWaitingInput: boolean;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.isWaitingInput = false;

        this.fadeRect = new Rect.Builder()
                .setSizeFullscreen()
                .setColor(255, 255, 255, 1)
                .build();
        this.bgSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("title_bg"))
                .build();
        this.headSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("title_head"))
                .setPosition(582, -40)
                .build();
        this.titleLabel = new Label.Builder()
                .setAlign(TextAlign.START)
                .setColor(230, 80, 255, 1)
                .setPosition(140, 280)
                .setShadowColor(0, 0, 0, 0.6)
                .setShadowDistance(20, 20)
                .setText("세아랜더")
                .setSize(290)
                .build();
        this.promptLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setColor(0, 0, 0, 0)
                .setText("엔터를 누르면 시작합니다")
                .setSize(70)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.85)
                .build();
        this.headTransitionScript = new CommonScript.WaveTransition(
                this.headSprite, 0, 40, 240, CommonScript.WaveTransition.LOOP_INFINITE);
    }

    public start(): void {
        Logger.info("Start TitleScene");

        this.pushScript(() => { return new CommonScript.Fade(this.fadeRect, 0, 30) });
        this.pushScript(() => { return new CommonScript.Run(() => {
            this.promptLabel.color.a = 1;
            this.promptBlinkScript = new CommonScript.Blink(this.promptLabel, 60);
            this.isWaitingInput = true;
        })});
        /*
        TODO: Show scoreboard (highlight latest score)
        */
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        this.promptBlinkScript?.update();
        this.headTransitionScript.update();
        if (this.isWaitingInput) this.waitOkKey(keyStatus);
    }

    public render(context: CanvasRenderingContext2D): void {
        this.bgSprite.render(context);
        this.headSprite.render(context);
        this.titleLabel.render(context);
        this.promptLabel.render(context);
        this.fadeRect.render(context);
    }

    private waitOkKey(keyStatus: KeyStatus): void {
        if (!keyStatus.isPressed(Key.OK)) return;

        this.isWaitingInput = false;
        this.promptLabel.color.a = 0;

        this.changeScene(SceneId.INGAME);
    }
}
