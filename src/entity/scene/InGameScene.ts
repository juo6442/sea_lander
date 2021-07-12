import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import NumberUtil from "../../util/NumberUtil";
import CrashEffect from "../actor/CrashEffect";
import SeaBody from "../actor/SeaBody";
import SeaHead from "../actor/SeaHead";
import SuccessEffect from "../actor/SuccessEffect";
import Entity, { Position } from "../Entity";
import Label, { TextAlign } from "../Label";
import Sprite from "../Sprite";
import DockingIndicator from "../ui/DockingIndicator";
import FuelIndicator from "../ui/FuelIndicator";
import GameOverScreen from "../ui/GameOverScreen";
import LifeIndicator from "../ui/LifeIndicator";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";

export default class InGameScene extends Scene implements InGameListener {
    private static readonly GROUND_TOP = Environment.VIEWPORT_HEIGHT - 60;
    private static readonly DOCKING_TOLERANCE_X = 20;

    private resource: Resource;
    private playerStatus: PlayerStatus;
    private dockingCriteria: DockingCriteria;

    private bgSprite: Sprite;
    private lifeUi: LifeIndicator;
    private fuelUi: FuelIndicator;
    private dockingUi: DockingIndicator;
    private seaHead: SeaHead | undefined;
    private seaBody: SeaBody | undefined;
    private effectEntities: Entity[];

    private status: GameStatus;
    private gameOverScreen: GameOverScreen | undefined;

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
        this.effectEntities = new Array();
    }

    onSuccessScreenClosed(): void {
        throw new Error("Method not implemented.");
    }

    onGameOverScreenClosed(): void {
        const bundle = new Bundle();
        // TODO: set real score
        bundle.set("score", 9999);
        this.changeScene(SceneId.TITLE);
    }

    public start(): void {
        Logger.info("Start InGameScene");

        this.initGame();
    }

    private initGame(): void {
        this.playerStatus.fuel = PlayerStatus.FUEL_FULL;

        this.seaBody?.invalidate();
        this.seaBody = new SeaBody(
                this.playerStatus,
                new Position(Environment.VIEWPORT_WIDTH / 2, InGameScene.GROUND_TOP - 95));

        this.seaHead?.invalidate();
        this.seaHead = new SeaHead(
                this.playerStatus,
                new Position(Environment.VIEWPORT_WIDTH / 2, 150));
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        this.effectEntities.forEach(e => e.update(keyStatus));
        this.effectEntities = this.effectEntities.filter(e => !e.invalidated);
        this.lifeUi.update(keyStatus);
        this.fuelUi.update(keyStatus);
        this.dockingUi.update(keyStatus);

        if (this.status === GameStatus.PLAY) {
            this.seaBody?.update(keyStatus);
            this.seaHead?.update(keyStatus);

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
        } else if (this.status === GameStatus.RESULT) {
        } else if (this.status === GameStatus.GAMEOVER) {
            this.gameOverScreen?.update(keyStatus);
        }
    }

    public override render(context: CanvasRenderingContext2D): void {
        this.bgSprite.render(context);
        this.seaBody?.render(context);
        this.seaHead?.render(context);
        this.effectEntities.forEach(e => e.render(context));

        this.lifeUi.render(context);
        this.fuelUi.render(context);
        this.dockingUi.render(context);

        this.gameOverScreen?.render(context);

        if (Environment.DEBUG) {
            context.save();
            context.strokeStyle = "rgb(0, 255, 0)";
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

        return (
            (this.seaHead.position.top + this.seaHead.radius >= this.seaBody.position.top) &&
            NumberUtil.isBetween(this.seaHead.position.left,
                this.seaBody.position.left - InGameScene.DOCKING_TOLERANCE_X,
                this.seaBody.position.left + InGameScene.DOCKING_TOLERANCE_X)
        );
    }

    private isHeadOnGround(): boolean {
        if (!this.seaHead) return false;
        return (this.seaHead.position.top >= InGameScene.GROUND_TOP);
    }

    private crash(): void {
        this.effectEntities.push(new CrashEffect(this.seaHead!.position));
        this.playerStatus.life--;
        this.seaHead = undefined;

        Logger.info(`Crashed, ${this.playerStatus.life} life remains`);

        if (this.playerStatus.life <= 0) {
            this.onGameOver();
        } else {
            this.initGame();
        }
    }

    private onSuccess(): void {
        this.status = GameStatus.RESULT;
        this.effectEntities.push(new SuccessEffect(this.seaHead!.position));
        this.seaHead!.setSuccessFace();
    }

    private onGameOver(): void {
        this.status = GameStatus.GAMEOVER;
        // TODO: pass real score
        this.gameOverScreen = new GameOverScreen(9999, this);
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
        this.verticalVelocity = NumberUtil.isBetween(head.velocity.top, -2.5, 2.5);
        this.angleVelocity = NumberUtil.isBetween(head.radianAngleVelocity, -0.02, 0.02);
        this.angle = NumberUtil.isBetween(head.radianAngle, -0.2, 0.2);
    }
}

export interface InGameListener {
    onSuccessScreenClosed(): void;
    onGameOverScreenClosed(): void;
}

const enum GameStatus {
    PLAY, RESULT, GAMEOVER
}
