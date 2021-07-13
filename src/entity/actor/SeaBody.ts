import Environment from "../../game/Environment";
import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import Entity, { Position } from "../Entity";
import Sprite from "../Sprite";

export default class SeaBody extends Entity {
    public position: Position;
    public runVelocity: number;

    private moving: (() => void) | undefined;

    private armLSprite: Sprite;
    private armRSprite: Sprite;
    private legLSprite: Sprite;
    private legRSprite: Sprite;
    private bodySprite: Sprite;

    constructor(position: Position, level: number) {
        super();

        this.position = position;
        this.runVelocity = 0;

        if (level >= 3) this.moving = this.updateMove;

        this.armLSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_arm_l"))
                .setOrigin(36, 8)
                .setPosition(-17, 6)
                .build();
        this.armRSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_arm_r"))
                .setOrigin(9, 9)
                .setPosition(15, 7)
                .build();
        this.legLSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_leg_l"))
                .setOrigin(14, 9)
                .setPosition(-17, 69)
                .build();
        this.legRSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_leg_r"))
                .setOrigin(10, 10)
                .setPosition(15, 69)
                .build();
        this.bodySprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_body"))
                .setOrigin(46, 3)
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        this.moving?.();
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        [
            this.armLSprite, this.armRSprite,
            this.legLSprite, this.legRSprite,
            this.bodySprite
        ].forEach(e => e.render(context));

        if (Environment.DEBUG) {
            context.fillStyle = "rgb(0, 255, 0)";
            context.fillRect(-2, -2, 4, 4);
        }

        context.restore();
    }

    private updateMove() {

    }
}
