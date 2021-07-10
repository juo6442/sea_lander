import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import SeaHead from "../actor/SeaHead";
import { Position } from "../Entity";
import Sprite from "../Sprite";
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

        this.addEntity("image_bg", new Sprite.Builder()
                .setAlignCenter(false)
                .setPosition(0, 0)
                .setImage(this.resource.getImage("room"))
                .setSize(Environment.VIEWPORT_WIDTH, Environment.VIEWPORT_HEIGHT)
                .build());

        this.addEntity("ui_life", new LifeIndicator(new Position(5, 5), this.playerStatus));

        this.initGame();
    }

    public initGame(): void {
        this.playerStatus.fuel = PlayerStatus.FUEL_FULL;

        this.seaHead = new SeaHead(
                this.playerStatus,
                new Position(Environment.VIEWPORT_WIDTH / 2, 0));
        this.addEntity("actor_seahead", this.seaHead);
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

        this.playerStatus.life--;

        Logger.info(`Crashed, ${this.playerStatus.life} life remains`);

        if (this.playerStatus.life <= 0) {
            this.gameOver();
        } else {
            // TODO: show crash effect
            this.initGame();
        }
    }

    private success() : void {
    }

    private gameOver(): void {
        this.seaHead = undefined;
        this.removeEntity("actor_seahead");

        // TODO: show gameover propmt and score
    }
}
