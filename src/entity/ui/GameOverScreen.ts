import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import { CommonScript } from "../../script/CommonScript";
import SequentialScriptRunner from "../../script/SequencialScriptRunner";
import Entity from "../Entity";
import Label, { TextAlign } from "../Label";
import Rect from "../Rect";
import { InGameListener } from "../scene/InGameScene";

export default class GameOverScreen extends Entity {
    private listener: InGameListener;

    private scoreDuration: number;
    private scoreElapsedDuration: number;
    private score: number;

    private bgRect: Rect;
    private fadeRect: Rect;
    private titleLabel: Label;
    private scoreLabel: Label;
    private promptLabel: Label;
    private promptBlinkScript: CommonScript.Blink | undefined;

    private currentUpdate: ((keyStatus: KeyStatus) => void) | undefined;
    private scriptRunner: SequentialScriptRunner;

    constructor(score: number, listener: InGameListener) {
        super();

        this.listener = listener;

        this.scoreDuration = Math.min(130, score);
        this.scoreElapsedDuration = 0;
        this.score = score;

        this.scriptRunner = new SequentialScriptRunner();

        this.bgRect = new Rect.Builder()
                .setSizeFullscreen()
                .setColor(0, 0, 0, 0.15)
                .build();
        this.fadeRect = new Rect.Builder()
                .setSizeFullscreen()
                .setColor(0, 0, 0, 0)
                .build();
        this.titleLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.3)
                .setSize(230)
                .setColor(70, 0, 130)
                .setText("게임 끝")
                .build();
        this.scoreLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.49)
                .setSize(120)
                .setColor(0, 0, 0, 0)
                .build();
        this.promptLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.65)
                .setSize(70)
                .setColor(0, 0, 0, 0)
                .setText("엔터 키를 누르면 처음으로 돌아갑니다...")
                .build();

        this.currentUpdate = this.updatePreScore;
    }

    public update(keyStatus: KeyStatus): void {
        this.scriptRunner.update(keyStatus);
        this.currentUpdate?.(keyStatus);
    }

    public render(context: CanvasRenderingContext2D): void {
        this.bgRect.render(context);
        this.titleLabel.render(context);
        this.scoreLabel.render(context);
        this.promptLabel.render(context);
        this.fadeRect.render(context);
    }

    private updatePreScore(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Wait(50) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.scoreLabel.color.a = 1;
            this.currentUpdate = this.updateScore;
        })});
    }

    private updateScore(keyStatus: KeyStatus): void {
        this.scoreElapsedDuration++;
        const displayingScore = Math.floor(this.score * (this.scoreElapsedDuration / this.scoreDuration));
        this.scoreLabel.text = `최종 점수: ${displayingScore}`;

        if (this.scoreElapsedDuration >= this.scoreDuration) {
            this.currentUpdate = this.updatePrePrompt;
        }
    }

    private updatePrePrompt(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Wait(50) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.promptLabel.color.a = 1;
            this.promptBlinkScript = new CommonScript.Blink(this.promptLabel, 60);
            this.currentUpdate = this.updatePrompt;
        })});
    }

    private updatePrompt(keyStatus: KeyStatus): void {
        this.promptBlinkScript?.update();

        if (keyStatus.isPressed(Key.OK)) {
            this.promptLabel.color.a = 0;
            this.currentUpdate = this.updateFadeOut;
        }
    }

    private updateFadeOut(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Fade(this.fadeRect, 1, 30) });
        this.scriptRunner.push(() => { return new CommonScript.Wait(30) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.listener.onGameOverScreenClosed();
        })});
    }
}
