import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import { Position } from "../Entity";
import { InGameListener } from "../scene/InGameScene";
import Sprite from "../Sprite";
import Actor from "./Actor";
import EnemyBody from "./EnemyBody";

export default class SeaBody extends Actor {
    public runVelocity: number;

    private listener: InGameListener;
    private player: Actor;

    private type: BodyType;

    private armLSprite: Sprite;
    private armRSprite: Sprite;
    private legLSprite: Sprite;
    private legRSprite: Sprite;
    private bodySprite: Sprite;

    constructor(position: Position, type: BodyType, player: Actor, listener: InGameListener) {
        super(position, type === BodyType.SEA ? 40 : 100);

        this.position = position;
        this.listener = listener;
        this.player = player;

        this.runVelocity = 0;
        this.type = type;

        this.armLSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_arm_l"))
                .setOrigin(36, 8)
                .setPosition(-17, -34)
                .build();
        this.armRSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_arm_r"))
                .setOrigin(9, 9)
                .setPosition(15, -33)
                .build();
        this.legLSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_leg_l"))
                .setOrigin(14, 9)
                .setPosition(-17, 29)
                .build();
        this.legRSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_leg_r"))
                .setOrigin(10, 10)
                .setPosition(15, 29)
                .build();
        this.bodySprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_body"))
                .setOrigin(46, 3)
                .setPosition(0, -40)
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        if (!this.isCollide(this.player)) return;

        if (this.type === BodyType.SEA) {
            this.listener.onDocking(this);
        } else {
            this.listener.onNearFakeBody(this);
        }
    }

    public override render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        [
            this.armLSprite, this.armRSprite,
            this.legLSprite, this.legRSprite,
            this.bodySprite
        ].forEach(e => e.render(context));

        context.restore();

        super.render(context);
    }
}

export enum BodyType {
    SEA = -1,
    FEEL = EnemyBody.SPRITE_INDEX_FEEL,
    VON = EnemyBody.SPRITE_INDEX_VON,
    GI = EnemyBody.SPRITE_INDEX_GI,
}
