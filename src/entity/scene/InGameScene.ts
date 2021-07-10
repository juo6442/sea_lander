import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import CrashEffect from "../actor/CrashEffect";
import SeaHead from "../actor/SeaHead";
import { Position } from "../Entity";
import Sprite from "../Sprite";
import FuelIndicator from "../ui/FuelIndicator";
import LifeIndicator from "../ui/LifeIndicator";
import Scene, { Bundle, SceneManager } from "./Scene";

export default class InGameScene extends Scene {
    private static readonly GROUND_TOP = Environment.VIEWPORT_HEIGHT - 60;

    private resource: Resource;
    private playerStatus: PlayerStatus;
    private seaHead: SeaHead | undefined;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.resource = Resource.global!;
        this.playerStatus = new PlayerStatus();
    }

    public start(): void {
        Logger.info("Start InGameScene");

        this.addEntity(new Sprite.Builder()
                .setAlignCenter(false)
                .setPosition(0, 0)
                .setImage(this.resource.getImage("room"))
                .setSize(Environment.VIEWPORT_WIDTH, Environment.VIEWPORT_HEIGHT)
                .build());

        this.addEntity(new LifeIndicator(new Position(10, 10), this.playerStatus));
        this.addEntity(new FuelIndicator(new Position(450, 10), this.playerStatus));

        this.initGame();
    }

    public initGame(): void {
        this.playerStatus.fuel = PlayerStatus.FUEL_FULL;

        this.seaHead = new SeaHead(
                this.playerStatus,
                new Position(Environment.VIEWPORT_WIDTH / 2, 150));
        this.addEntity(this.seaHead);
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        this.checkDocking();
        this.checkCrash();
    }

    private checkDocking(): void {
        if (!this.seaHead) return;
    }

    private checkCrash(): void {
        if (!this.seaHead) return;
        if (this.seaHead.position.top < InGameScene.GROUND_TOP) return;

        this.seaHead.invalidate();
        this.addEntity(new CrashEffect(this.seaHead.position, 120));
        this.playerStatus.life--;

        Logger.info(`Crashed, ${this.playerStatus.life} life remains`);

        if (this.playerStatus.life <= 0) {
            this.gameOver();
        } else {
            this.initGame();
        }
    }

    private success() : void {
    }

    private gameOver(): void {
        this.seaHead?.invalidate();
        this.seaHead = undefined;

        // TODO: show gameover propmt and score
    }
}
