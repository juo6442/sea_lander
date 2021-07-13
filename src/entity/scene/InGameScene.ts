import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import { Score, ScoreCalculator } from "../../game/Score";
import Logger from "../../util/Logger";
import NumberUtil from "../../util/NumberUtil";
import CrashEffect from "../effect/CrashEffect";
import SeaBody from "../actor/SeaBody";
import SeaHead from "../actor/SeaHead";
import SuccessEffect from "../effect/SuccessEffect";
import Entity, { Position } from "../Entity";
import Sprite from "../Sprite";
import DockingIndicator from "../ui/DockingIndicator";
import FuelIndicator from "../ui/FuelIndicator";
import GameOverScreen from "../ui/GameOverScreen";
import LifeIndicator from "../ui/LifeIndicator";
import NumberIndicator from "../ui/NumberIndicator";
import SuccessScreen from "../ui/SuccessScreen";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";
import Actor from "../actor/Actor";
import EnemyHead from "../actor/EnemyHead";

export default class InGameScene extends Scene implements InGameListener {
    private static readonly GROUND_TOP = Environment.VIEWPORT_HEIGHT - 60;

    private resource: Resource;
    private playerStatus: PlayerStatus;
    private dockingCriteria: DockingCriteria;

    private bgSprite: Sprite;
    private lifeUi: LifeIndicator;
    private fuelUi: FuelIndicator;
    private dockingUi: DockingIndicator;
    private levelUi: NumberIndicator;
    private scoreUi: NumberIndicator;
    private seaHead: SeaHead | undefined;
    private seaBody: SeaBody | undefined;
    private enemyEntities: Actor[];
    private effectEntities: Entity[];

    private status: GameStatus;
    private resultScreen: Entity | undefined;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.resource = Resource.global!;
        this.playerStatus = new PlayerStatus();
        this.dockingCriteria = new DockingCriteria();

        this.status = GameStatus.PLAY;

        this.bgSprite = new Sprite.Builder()
                .setPosition(0, 0)
                .setImage(this.resource.getImage("room"))
                .setSize(Environment.VIEWPORT_WIDTH, Environment.VIEWPORT_HEIGHT)
                .build();
        this.lifeUi = new LifeIndicator(new Position(10, 10), this.playerStatus);
        this.fuelUi = new FuelIndicator(new Position(450, 10), this.playerStatus);
        this.dockingUi = new DockingIndicator(new Position(700, 15), this.dockingCriteria);
        this.levelUi = new NumberIndicator(new Position(1170, 15), Resource.global?.getImage("carrot"));
        this.scoreUi = new NumberIndicator(new Position(1400, 15), Resource.global?.getImage("coin"));
        this.enemyEntities = new Array();
        this.effectEntities = new Array();
    }

    onEnemyCollision(): void {
        this.crash();
    }

    onSuccessScreenClosed(): void {
        this.playerStatus.level++;
        this.initGame();
    }

    onGameOverScreenClosed(): void {
        const bundle = new Bundle();
        bundle.set("score", this.playerStatus.score);
        this.changeScene(SceneId.TITLE, bundle);
    }

    public start(): void {
        Logger.info("Start InGameScene");

        this.initGame();
    }

    private initGame(): void {
        this.status = GameStatus.PLAY;
        this.resultScreen = undefined;

        this.playerStatus.fuel = PlayerStatus.FUEL_FULL;
        this.levelUi.number = this.playerStatus.level;
        this.scoreUi.number = this.playerStatus.score;

        this.seaBody?.invalidate();
        this.seaBody = new SeaBody(new Position(
                NumberUtil.randomInt(190, Environment.VIEWPORT_WIDTH - 150),
                InGameScene.GROUND_TOP - 40));

        this.seaHead?.invalidate();
        this.seaHead = new SeaHead(
                this.playerStatus,
                new Position(Environment.VIEWPORT_WIDTH / 2, 400));

        this.enemyEntities = new Array();
        // TODO: test purpose
        this.enemyEntities.push(new EnemyHead(new Position(500, 500), new Position(3, -2), this.seaHead, this));
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        this.effectEntities.forEach(e => e.update(keyStatus));
        this.effectEntities = this.effectEntities.filter(e => !e.invalidated);
        this.lifeUi.update(keyStatus);
        this.fuelUi.update(keyStatus);
        this.dockingUi.update(keyStatus);
        this.levelUi.update(keyStatus);
        this.scoreUi.update(keyStatus);

        if (this.status === GameStatus.PLAY) {
            this.seaBody?.update(keyStatus);
            this.seaHead?.update(keyStatus);
            this.enemyEntities.forEach(e => e.update(keyStatus));

            this.dockingCriteria.update(this.seaHead);

            if (this.isDockingPosition()) {
                if (this.dockingCriteria.check()) {
                    this.onSuccess();
                } else {
                    this.crash();
                }
            } else if (this.isHeadOnGround()) {
                this.crash();
            }
        } else if (this.status === GameStatus.SUCCESS) {
            this.resultScreen?.update(keyStatus);
        } else if (this.status === GameStatus.GAMEOVER) {
            this.resultScreen?.update(keyStatus);
        }
    }

    public override render(context: CanvasRenderingContext2D): void {
        this.bgSprite.render(context);
        this.seaBody?.render(context);
        this.seaHead?.render(context);
        this.enemyEntities.forEach(e => e.render(context));
        this.effectEntities.forEach(e => e.render(context));

        this.lifeUi.render(context);
        this.fuelUi.render(context);
        this.dockingUi.render(context);
        this.levelUi.render(context);
        this.scoreUi.render(context);

        this.resultScreen?.render(context);

        if (Environment.DEBUG) {
            context.save();
            context.strokeStyle = "red";
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(0, InGameScene.GROUND_TOP);
            context.lineTo(Environment.VIEWPORT_WIDTH, InGameScene.GROUND_TOP);
            context.stroke();
            context.closePath();
            context.restore();
        }
    }

    private isDockingPosition(): boolean {
        if (!this.seaHead || !this.seaBody) return false;

        return this.seaHead.isCollide(this.seaBody);
    }

    private isHeadOnGround(): boolean {
        if (!this.seaHead) return false;
        return (this.seaHead.position.top + this.seaHead.radius >= InGameScene.GROUND_TOP);
    }

    private crash(): void {
        this.effectEntities.push(new CrashEffect(this.seaHead!.position));
        this.playerStatus.life--;

        this.seaHead?.invalidate();
        this.seaHead = undefined;

        Logger.info(`Crashed, ${this.playerStatus.life} life remains`);

        if (this.playerStatus.life <= 0) {
            this.onGameOver();
        } else {
            this.initGame();
        }
    }

    private onSuccess(): void {
        this.status = GameStatus.SUCCESS;

        this.effectEntities.push(new SuccessEffect(this.seaHead!.position));
        this.seaHead!.setSuccessFace();

        const score = new ScoreCalculator(
                this.playerStatus.fuel,
                this.seaHead!.position.left - this.seaBody!.position.left,
                this.seaHead!.radianAngle);
        this.resultScreen = new SuccessScreen(score, this);
        this.playerStatus.score += score.totalScore;
    }

    private onGameOver(): void {
        this.status = GameStatus.GAMEOVER;
        this.resultScreen = new GameOverScreen(this.playerStatus.score, this);
        Score.setScore(this.playerStatus.score);
    }
}

export class DockingCriteria {
    public horizontalVelocity: boolean;
    public verticalVelocity: boolean;
    public angleVelocity: boolean;
    public angle: boolean;

    constructor() {
        this.horizontalVelocity = this.verticalVelocity = this.angleVelocity = this.angle = true;
    }

    public check(): boolean {
        return this.horizontalVelocity && this.verticalVelocity && this.angleVelocity && this.angle;
    }

    public update(head: SeaHead | undefined): void {
        if (!head) return;
        this.horizontalVelocity = NumberUtil.isBetween(head.velocity.left, -2.5, 2.5);
        this.verticalVelocity = NumberUtil.isBetween(head.velocity.top, -4, 3.5);
        this.angleVelocity = NumberUtil.isBetween(head.radianAngleVelocity, -0.02, 0.02);
        this.angle = NumberUtil.isBetween(head.radianAngle, -0.3, 0.3);
    }
}

export interface InGameListener {
    onEnemyCollision(): void;
    onSuccessScreenClosed(): void;
    onGameOverScreenClosed(): void;
}

const enum GameStatus {
    PLAY, SUCCESS, GAMEOVER
}
