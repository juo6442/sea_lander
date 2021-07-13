import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import NumberUtil from "../../util/NumberUtil";
import { Position } from "../Entity";
import { InGameListener } from "../scene/InGameScene";
import Sprite from "../Sprite";
import Actor from "./Actor";

export default class EnemyBody extends Actor {
    private listener: InGameListener;
    private player: Actor;
    private bodySprite: Sprite;

    constructor(position: Position, player: Actor, listener: InGameListener) {
        super(position, 45);

        this.position = position;
        this.listener = listener;
        this.player = player;

        this.bodySprite = new Sprite.Builder()
                .setOriginCenter()
                .setImage(Resource.global?.getImage("enemy_body"))
                .addFrame(0  , 0, 121, 114, 0)
                .addFrame(121, 0, 121, 114, 0)
                .addFrame(242, 0, 121, 114, 0)
                .build();
        this.bodySprite.currentFrameIndex = NumberUtil.randomInt(0, 3);
    }

    public update(keyStatus: KeyStatus): void {
        if (this.isCollide(this.player)) this.listener.onEnemyCollision();
    }

    public override render(context: CanvasRenderingContext2D): void {
        context.save();

        context.translate(this.position.left, this.position.top);
        this.bodySprite.render(context);

        context.restore();

        super.render(context);
    }
}
