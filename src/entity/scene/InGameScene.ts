import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import NumberUtil from "../../util/NumberUtil";
import CrashEffect from "../actor/CrashEffect";
import SeaBody from "../actor/SeaBody";
import SeaHead from "../actor/SeaHead";
import { Position } from "../Entity";
import Sprite from "../Sprite";
import FuelIndicator from "../ui/FuelIndicator";
import LifeIndicator from "../ui/LifeIndicator";
import Scene, { Bundle, SceneManager } from "./Scene";

export default class InGameScene extends Scene {
    private static readonly GROUND_TOP = Environment.VIEWPORT_HEIGHT - 60;
    private static readonly DOCKING_TOLERANCE_X = 70;

    private resource: Resource;
    private playerStatus: PlayerStatus;
    private dockingCriteriaChecker: DockingCriteriaChecker;
    private seaHead: SeaHead | undefined;
    private seaBody: SeaBody | undefined;

    private inResult: boolean;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.resource = Resource.global!;
        this.playerStatus = new PlayerStatus();
        this.dockingCriteriaChecker = new DockingCriteriaChecker();

        this.inResult = false;

        this.addEntity(new Sprite.Builder()
                .setPosition(0, 0)
                .setImage(this.resource.getImage("room"))
                .setSize(Environment.VIEWPORT_WIDTH, Environment.VIEWPORT_HEIGHT)
                .build());

        this.addEntity(new LifeIndicator(new Position(10, 10), this.playerStatus));
        this.addEntity(new FuelIndicator(new Position(450, 10), this.playerStatus));
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
        this.addEntity(this.seaBody);

        this.seaHead?.invalidate();
        this.seaHead = new SeaHead(
                this.playerStatus,
                new Position(Environment.VIEWPORT_WIDTH / 2, 150));
        this.addEntity(this.seaHead);
    }

    public override update(keyStatus: KeyStatus): void {
        if (!this.inResult) {
            super.update(keyStatus);
            this.dockingCriteriaChecker.update(this.seaHead);

            if (this.isDockingPosition()) {
                if (this.dockingCriteriaChecker.check()) {
                    this.onSuccess();
                } else {
                    this.crash();
                }
            } else if (this.isHeadOnGround()) {
                this.crash();
            }
        }
    }

    public override render(context: CanvasRenderingContext2D): void {
        super.render(context);

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
        if (!this.seaHead) return;

        this.addEntity(new CrashEffect(this.seaHead.position));
        this.playerStatus.life--;
        this.seaHead.invalidate();
        this.seaHead = undefined;

        Logger.info(`Crashed, ${this.playerStatus.life} life remains`);

        if (this.playerStatus.life <= 0) {
            this.onGameOver();
        } else {
            this.initGame();
        }
    }

    private onSuccess(): void {
        this.inResult = true;
    }

    private onGameOver(): void {
        // TODO: show gameover propmt and score
    }
}

export class DockingCriteriaChecker {
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
        this.horizontalVelocity = NumberUtil.isBetween(head.velocity.left, -1, 1);
        this.verticalVelocity = NumberUtil.isBetween(head.velocity.top, -1, 1);
        this.angleVelocity = NumberUtil.isBetween(head.radianAngleVelocity, -0.5, 0.5);
        this.angle = NumberUtil.isBetween(head.radianAngle, -0.5, 0.5);
    }
 }
