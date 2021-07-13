import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import NumberUtil from "../../util/NumberUtil";
import { Position } from "../Entity";
import { InGameListener } from "../scene/InGameScene";
import Sprite from "../Sprite";
import Actor from "./Actor";

export default class EnemyHead extends Actor {
    public velocity: Position;
    public radianAngle: number;
    public radianAngleVelocity: number;

    private listener: InGameListener;
    private player: Actor;
    private headSprite: Sprite;

    constructor(position: Position, velocity: Position, type: HeadType,
            player: Actor, listener: InGameListener) {
        super(position, 50);

        this.position = position;
        this.velocity = velocity;
        this.radianAngle = NumberUtil.random(0, Math.PI * 2);
        this.radianAngleVelocity = NumberUtil.random(-0.05, 0.05);

        this.listener = listener;
        this.player = player;

        this.headSprite = new Sprite.Builder()
                .setOriginCenter()
                .setImage(Resource.global?.getImage("enemy_head"))
                .addFrame(0  , 0, 247, 247, 0)
                .addFrame(247, 0, 247, 247, 0)
                .addFrame(494, 0, 247, 247, 0)
                .addFrame(741, 0, 247, 247, 0)
                .build();
        this.headSprite.currentFrameIndex = this.convertHeadTypeToSpriteIndex(type);
    }

    public update(keyStatus: KeyStatus): void {
        this.position.left += this.velocity.left + Environment.VIEWPORT_WIDTH;
        this.position.left %= Environment.VIEWPORT_WIDTH;

        this.position.top += this.velocity.top;
        if (this.position.top - this.radius <= 0
                || this.position.top + this.radius >= Environment.VIEWPORT_HEIGHT) {
            this.velocity.top = -this.velocity.top;
        }

        this.radianAngle += this.radianAngleVelocity
        this.radianAngle %= Math.PI * 2;

        if (this.isCollide(this.player)) this.listener.onEnemyCollision();
    }

    public override render(context: CanvasRenderingContext2D): void {
        [
            0,
            -Environment.VIEWPORT_WIDTH,
            +Environment.VIEWPORT_WIDTH
        ].forEach(loopOffset => {
            context.save();

            context.translate(this.position.left + loopOffset, this.position.top);
            context.rotate(this.radianAngle);
            this.headSprite.render(context);

            context.restore();
        });

        super.render(context);
    }

    private convertHeadTypeToSpriteIndex(type: HeadType) {
        return type;
    }
}

export enum HeadType {
    FEEL = 0,
    VON = 1,
    GI = 2,
    EDITOR = 3,
}
