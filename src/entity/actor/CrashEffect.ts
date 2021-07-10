import { KeyStatus } from "../../game/KeyInput";
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

    constructor(position: Position, duration: number) {
        super();

        this.position = position;

        this.duration = duration;
        this.remainDuration = duration;
        this.speed = 6;
        this.distance = 0;

        this.particleSprite = new Sprite.Builder()
                .setAlignCenter(true)
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
        context.save()
        context.translate(this.position.left, this.position.top);

        [0, 45, 90, 135, 180, 225, 270, 315].forEach(angle => {
            context.save()
            context.rotate(NumberUtil.toRadian(angle));

            context.translate(this.distance, 0);
            this.particleSprite.render(context);
            context.translate(this.distance, 0);
            this.particleSprite.render(context);

            context.restore();
        });

        context.restore();
    }
}
