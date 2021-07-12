import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import { ScoreCalculator } from "../../game/Score";
import { CommonScript } from "../../script/CommonScript";
import SequentialScriptRunner from "../../script/SequencialScriptRunner";
import Entity from "../Entity";
import Label, { TextAlign } from "../Label";
import * as InGameScene from "../scene/InGameScene";

export default class SuccessScreen extends Entity {
    private listener: InGameScene.InGameListener;

    private scoreDuration: number;
    private scoreElapsedDuration: number;
    private score: ScoreCalculator;

    private titleLabel: Label;
    private score1Label: Label;
    private score2Label: Label;
    private score3Label: Label;
    private scoreLabel: Label;
    private promptLabel: Label;
    private promptBlinkScript: CommonScript.BlinkScript | undefined;

    private currentUpdate: ((keyStatus: KeyStatus) => void) | undefined;
    private scriptRunner: SequentialScriptRunner;

    constructor(score: ScoreCalculator, listener: InGameScene.InGameListener) {
        super();

        this.listener = listener;

        this.scoreDuration = 0;
        this.scoreElapsedDuration = 0;
        this.score = score;

        this.scriptRunner = new SequentialScriptRunner();

        this.titleLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.22)
                .setSize(230)
                .setColor(110, 30, 170)
                .setText("성공!")
                .build();
        this.score1Label = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.37)
                .setSize(90)
                .setColor(0, 0, 0, 0)
                .build();
        this.score2Label = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.45)
                .setSize(90)
                .setColor(0, 0, 0, 0)
                .build();
        this.score3Label = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.53)
                .setSize(90)
                .setColor(0, 0, 0, 0)
                .build();
        this.scoreLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.62)
                .setSize(120)
                .setColor(0, 0, 0, 0)
                .setText(`총 ${this.score.totalScore} 점`)
                .build();
        this.promptLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setPosition(Environment.VIEWPORT_WIDTH / 2, Environment.VIEWPORT_HEIGHT * 0.75)
                .setSize(70)
                .setColor(0, 0, 0, 0)
                .setText("엔터 키를 누르면 계속합니다...")
                .build();

        this.currentUpdate = this.updatePreScore1;
    }

    public update(keyStatus: KeyStatus): void {
        this.scriptRunner.update(keyStatus);
        this.currentUpdate?.(keyStatus);
    }

    public render(context: CanvasRenderingContext2D): void {
        this.titleLabel.render(context);
        this.score1Label.render(context);
        this.score2Label.render(context);
        this.score3Label.render(context);
        this.scoreLabel.render(context);
        this.promptLabel.render(context);
    }

    private updatePreScore1(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Wait(50) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.scoreDuration = Math.min(40, this.score.angleScore);
            this.scoreElapsedDuration = 0;
            this.score1Label.color.a = 1;
            this.currentUpdate = this.updateScore1;
        })});
    }

    private updateScore1(keyStatus: KeyStatus): void {
        this.scoreElapsedDuration++;
        const displayingScore = Math.floor(this.score.fuelScore * (this.scoreElapsedDuration / this.scoreDuration));
        this.score1Label.text = `연료: ${displayingScore}`;

        if (this.scoreElapsedDuration >= this.scoreDuration) {
            this.currentUpdate = this.updatePreScore2;
        }
    }

    private updatePreScore2(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Wait(30) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.scoreDuration = Math.min(40, this.score.angleScore);
            this.scoreElapsedDuration = 0;
            this.score2Label.color.a = 1;
            this.currentUpdate = this.updateScore2;
        })});
    }

    private updateScore2(keyStatus: KeyStatus): void {
        this.scoreElapsedDuration++;
        const displayingScore = Math.floor(this.score.positionScore * (this.scoreElapsedDuration / this.scoreDuration));
        this.score2Label.text = `위치: ${displayingScore}`;

        if (this.scoreElapsedDuration >= this.scoreDuration) {
            this.currentUpdate = this.updatePreScore3;
        }
    }

    private updatePreScore3(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Wait(30) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.scoreDuration = Math.min(40, this.score.angleScore);
            this.scoreElapsedDuration = 0;
            this.score3Label.color.a = 1;
            this.currentUpdate = this.updateScore3;
        })});
    }

    private updateScore3(keyStatus: KeyStatus): void {
        this.scoreElapsedDuration++;
        const displayingScore = Math.floor(this.score.angleScore * (this.scoreElapsedDuration / this.scoreDuration));
        this.score3Label.text = `각도: ${displayingScore}`;

        if (this.scoreElapsedDuration >= this.scoreDuration) {
            this.currentUpdate = this.updateScore;
        }
    }

    private updateScore(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Wait(50) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.scoreLabel.color.a = 1;
            this.currentUpdate = this.updatePrePrompt;
        })});
    }

    private updatePrePrompt(keyStatus: KeyStatus): void {
        this.currentUpdate = undefined;

        this.scriptRunner.push(() => { return new CommonScript.Wait(50) });
        this.scriptRunner.push(() => { return new CommonScript.Run(() => {
            this.promptLabel.color.a = 1;
            this.promptBlinkScript = new CommonScript.BlinkScript(this.promptLabel, 60);
            this.currentUpdate = this.updatePrompt;
        })});
    }

    private updatePrompt(keyStatus: KeyStatus): void {
        this.promptBlinkScript?.update();

        if (keyStatus.isPressed(Key.OK)) {
            this.promptLabel.color.a = 0;
            this.listener.onSuccessScreenClosed();
        }
    }
}
