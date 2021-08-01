import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/input/Input";
import Resource from "../../game/Resource";
import { Score } from "../../game/Score";
import { CommonScript } from "../../script/CommonScript";
import AudioResource from "../../sound/AudioResource";
import Bgm from "../../sound/Bgm";
import Logger from "../../util/Logger";
import NumberUtil from "../../util/NumberUtil";
import { Color } from "../Entity";
import Label, { TextAlign } from "../Label";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";

export default class TitleScene extends Scene {
    private fadeRect: Rect;
    private bgSprite: Sprite;
    private headSprite: Sprite;
    private titleLabel: Label;
    private scoreLabels: Label[];
    private promptLabel: Label;
    private startAudio: AudioResource;
    private headTransitionScript: CommonScript.WaveTransition;
    private promptBlinkScript: CommonScript.Blink | undefined;

    private isWaitingInput: boolean;
    private sleepRemainDuration: number;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.isWaitingInput = false;
        this.sleepRemainDuration = NumberUtil.randomInt(20, 60) * Environment.FPS;

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
        this.scoreLabels = new Array(Score.COUNT);
        for (let i = 0; i < Score.COUNT; i++) {
            this.scoreLabels[i] = new Label.Builder()
                    .setAlign(TextAlign.START)
                    .setPosition(190, 590 + i * 110)
                    .setSize(80)
                    .build();
        };
        this.promptLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setColor(0, 0, 0, 0)
                .setText("엔터 키를 누르면 시작합니다")
                .setSize(70)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.85)
                .build();
        this.startAudio = new AudioResource.Builder()
                .setBuffer(Resource.global?.getAudio(`start_${NumberUtil.randomInt(0, 4)}`))
                .build();
        this.headTransitionScript = new CommonScript.WaveTransition(
                this.headSprite, 0, 40, 240, CommonScript.WaveTransition.LOOP_INFINITE);
    }

    public start(): void {
        Logger.info("Start TitleScene");

        this.pushScript(() => { return new CommonScript.Fade(this.fadeRect, 0, 30) });
        this.pushScript(() => { return new CommonScript.Run(() => {
            Bgm.getInstance().play(Resource.global?.getAudio("bgm"));
            Bgm.getInstance().fadeVolume(Bgm.VOLUME_DEFAULT, 2);

            this.promptLabel.color.a = 1;
            this.promptBlinkScript = new CommonScript.Blink(this.promptLabel, 60);
            this.isWaitingInput = true;
        })});

        this.showScoreBoard();
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        this.promptBlinkScript?.update();
        this.headTransitionScript.update();
        if (this.isWaitingInput) this.waitOkKey(keyStatus);

        this.handleSleepVoice();
    }

    public render(context: CanvasRenderingContext2D): void {
        this.bgSprite.render(context);
        this.headSprite.render(context);
        this.titleLabel.render(context);
        this.scoreLabels.forEach(e => e.render(context));
        this.promptLabel.render(context);
        this.fadeRect.render(context);
    }

    private waitOkKey(keyStatus: KeyStatus): void {
        if (!keyStatus.isPressed(Key.OK)) return;

        this.startAudio.play();

        this.isWaitingInput = false;
        this.promptLabel.color.a = 0;

        this.pushScript(() => new CommonScript.Wait(80));
        this.pushScript(() => new CommonScript.Run(() => {
            this.changeScene(SceneId.INGAME);
        }));
    }

    private showScoreBoard() {
        const scores = Score.getScores();

        const latestScore = this.getFromBundle("score") ?? -1;
        const latestScoreIndex = scores.lastIndexOf(latestScore);
        Logger.log("Latest score: " + latestScore);

        this.scoreLabels.forEach((e, i) => {
            e.color = (i == latestScoreIndex ? new Color(255, 0, 0) : new Color(0, 0, 0));
            e.text = `${i + 1}위  ${scores[i]}점`;
        });
    }

    private handleSleepVoice() {
        if (this.sleepRemainDuration < 0) return;

        this.sleepRemainDuration--;
        if (this.sleepRemainDuration === 0) {
            new AudioResource.Builder()
                    .setBuffer(Resource.global?.getAudio(`sleep_${NumberUtil.randomInt(0, 4)}`))
                    .build()
                    .play();
        }
    }
}
