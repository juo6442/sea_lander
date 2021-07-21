import { KeyStatus } from "../../game/input/Input";
import Resource from "../../game/Resource";
import NumberUtil from "../../util/NumberUtil";
import Entity, { Position } from "../Entity";
import Sprite from "../Sprite";

export default class CrashEffect extends Entity {
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
        this.speed = 6;
        this.distance = 0;

        this.particleSprite = new Sprite.Builder()
                .setOriginCenter()
                .setImage(Resource.global?.getImage("crash"))
                .setPosition(0, 0)
                .addFrame(0  , 0, 150, 150, 7)
                .addFrame(150, 0, 150, 150, 7)
                .addFrame(300, 0, 150, 150, 7)
                .addFrame(450, 0, 150, 150, 7)
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        this.particleSprite.update(keyStatus);
        this.particleSprite.color.a = this.remainDuration / this.duration;

        this.distance += this.speed;

        if (--this.remainDuration <= 0) this.invalidate();
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        for (let angle = 0; angle < 360; angle += 45) {
            context.save();
            context.rotate(NumberUtil.toRadian(angle));

            context.translate(this.distance, 0);
            this.particleSprite.render(context);
            context.translate(this.distance, 0);
            this.particleSprite.render(context);

            context.restore();
        };

        context.restore();
    }
}
