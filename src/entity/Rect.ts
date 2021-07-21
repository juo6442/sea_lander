import Entity, { Color, Position, Size } from "./Entity";
import Environment from "../game/Environment";
import { KeyStatus } from "../game/input/Input";
import NumberUtil from "../util/NumberUtil";

export default class Rect extends Entity {
    public size: Size;
    public color: Color;
    public position: Position;
    public origin: Position;
    public radianAngle: number;

    private constructor(
            size: Size,
            color: Color,
            position: Position,
            origin: Position,
            radianAngle: number) {
        super();

        this.size = size;
        this.color = color;
        this.position = position;
        this.origin = origin;
        this.radianAngle = radianAngle;
    }

    public update(keyStatus: KeyStatus): void {}

    public render(context: CanvasRenderingContext2D): void {
        context.save();

        context.translate(this.position.left, this.position.top);
        context.rotate(this.radianAngle);

        context.fillStyle =
                `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        context.fillRect(
                -this.origin.left, -this.origin.top,
                this.size.width, this.size.height);

        context.restore();
    }

    static Builder = class Builder {
        private size: Size | undefined;
        private color: Color | undefined;
        private position: Position | undefined;
        private origin: Position | undefined;
        private originCenter: boolean;
        private radianAngle: number | undefined;

        constructor() {
            this.originCenter = false;
        }

        public build(): Rect {
            if (!this.size) {
                this.size = new Size(0, 0);
            }

            if (this.originCenter) {
                this.origin = new Position(this.size.width / 2, this.size.height / 2);
            }

            return new Rect(
                    this.size,
                    this.color ?? new Color(0, 0, 0),
                    this.position ?? new Position(0, 0),
                    this.origin ?? new Position(0, 0),
                    this.radianAngle ?? 0);
        }

        public setSize(width: number, height: number): Builder {
            this.size = new Size(width, height);
            return this;
        }

        public setSizeFullscreen(): Builder {
            this.size = new Size(Environment.VIEWPORT_WIDTH, Environment.VIEWPORT_HEIGHT);
            return this;
        }

        public setColor(r: number, g: number, b: number, a: number = 1): Builder {
            this.color = new Color(r, g, b, a);
            return this;
        }

        public setPosition(left: number, top: number): Builder {
            this.position = new Position(left, top);
            return this;
        }

        public setOrigin(left: number, top: number): Builder {
            this.originCenter = false;
            this.origin = new Position(left, top);
            return this;
        }

        public setOriginCenter(): Builder {
            this.originCenter = true;
            return this;
        }

        public setAngle(degree: number): Builder {
            this.radianAngle = NumberUtil.toRadian(degree);
            return this;
        }
    }
}
