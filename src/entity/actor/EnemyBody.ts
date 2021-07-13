import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import { Position } from "../Entity";
import { InGameListener } from "../scene/InGameScene";
import Sprite from "../Sprite";
import Actor from "./Actor";
import { BodyType } from "./SeaBody";

export default class EnemyBody extends Actor {
    static readonly SPRITE_INDEX_FEEL = 0;
    static readonly SPRITE_INDEX_VON = 1;
    static readonly SPRITE_INDEX_GI = 2;

    private listener: InGameListener;
    private player: Actor;
    private bodySprite: Sprite;

    constructor(position: Position, type: BodyType, player: Actor, listener: InGameListener) {
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
        this.bodySprite.currentFrameIndex = this.convertBodyTypeToSpriteIndex(type);
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

    private convertBodyTypeToSpriteIndex(type: BodyType) {
        return type - 1;
    }
}
