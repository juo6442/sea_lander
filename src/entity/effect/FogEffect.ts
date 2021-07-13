import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import NumberUtil from "../../util/NumberUtil";
import Entity, { Position } from "../Entity";
import Sprite from "../Sprite";

export default class FogEffect extends Entity {
    public position: Position;

    private duration: number;
    private remainDuration: number;
    private speed: number;
    private distance: number;

    private particleSprite: Sprite;

    constructor(position: Position) {
        super();

        this.position = position;

        this.duration = 120;
        this.remainDuration = this.duration;
        this.speed = 3;
        this.distance = 5;

        this.particleSprite = new Sprite.Builder()
                .setOriginCenter()
                .setImage(Resource.global?.getImage("fog"))
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        this.particleSprite.color.a = this.remainDuration / this.duration;
        this.particleSprite.size.width *= 1.0015;
        this.particleSprite.size.height *= 1.0015;

        this.distance += this.speed;
        this.speed *= 0.95;

        if (--this.remainDuration <= 0) this.invalidate();
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        for (let angle = 15; angle < 360; angle += 55) {
            context.save();

            context.rotate(NumberUtil.toRadian(angle));
            context.translate(this.distance, 0);
            this.particleSprite.render(context);

            context.restore();
        };

        context.restore();
    }
}
