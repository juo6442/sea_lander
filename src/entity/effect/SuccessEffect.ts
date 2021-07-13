import { KeyStatus } from "../../game/KeyInput";
import EasingUtil from "../../util/EasingUtil";
import NumberUtil from "../../util/NumberUtil";
import Entity, { Position } from "../Entity";

export default class SuccessEffect extends Entity {
    public position: Position;

    private readonly point1: EasingPoint;
    private readonly point2: EasingPoint;
    private readonly lineStart: number;
    private readonly lineLength: number;
    private readonly duration: number;

    private elapsedDuration: number;

    constructor(position: Position) {
        super();

        this.position = position;

        this.duration = 60;
        this.lineStart = 300;
        this.lineLength = 450;
        this.point1 = new EasingPoint(this.duration * 0.6, this.duration * 0.95, EasingUtil.easeInOutCubic);
        this.point2 = new EasingPoint(0, this.duration * 0.9, EasingUtil.easeInOutCubic);

        this.elapsedDuration = 0;
    }

    public update(keyStatus: KeyStatus): void {
        if (++this.elapsedDuration > this.duration) this.invalidate();
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        context.strokeStyle = "rgba(255, 255, 0, 0.7)";
        context.lineWidth = 50;
        context.lineCap = "round";

        context.beginPath();
        for (let angle = 0; angle < 360; angle += 45) {
            context.save();
            context.rotate(NumberUtil.toRadian(angle));

            context.moveTo(this.lineStart + this.point1.get(this.elapsedDuration) * this.lineLength, 0);
            context.lineTo(this.lineStart + this.point2.get(this.elapsedDuration) * this.lineLength, 0);
            context.stroke();

            context.restore();
        }
        context.closePath();

        context.restore();
    }
}

class EasingPoint {
    private readonly begin: number;
    private readonly duration: number;
    private readonly ease: (x: number) => number;

    constructor(begin: number, end: number, ease: (x: number) => number) {
        this.begin = begin;
        this.duration = end - begin;
        this.ease = ease;
    }

    get(elapsed: number): number {
        return this.ease(NumberUtil.fitIn((elapsed - this.begin) / this.duration, 0, 1));
    }
}
