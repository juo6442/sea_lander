import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import SeaHead from "../actor/SeaHead";
import { Position } from "../Entity";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneManager } from "./Scene";

export default class InGameScene extends Scene {
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

        this.initGame();
    }

    public initGame(): void {
        this.seaHead = new SeaHead(
                this.playerStatus,
                new Position(Environment.VIEWPORT_WIDTH / 2, 0));
        this.addEntity("actor_seahead", this.seaHead);
    }

    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);
    }
}
