import Entity, { Color, Position, Size } from "./Entity";
import Environment from "../game/Environment";
import { KeyStatus } from "../game/KeyInput";
import NumberUtil from "../util/NumberUtil";

export default class Rect extends Entity {
    public size: Size;
    public color: Color;
    public position: Position;
    public alignCenter: boolean;
    public radianAngle: number;

    private constructor(
            size: Size,
            color: Color,
            position: Position,
            alignCenter: boolean,
            radianAngle: number) {
        super();

        this.size = size;
        this.color = color;
        this.position = position;
        this.alignCenter = alignCenter;
        this.radianAngle = radianAngle;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();

        context.translate(this.position.left, this.position.top);
        context.rotate(this.radianAngle);

        context.fillStyle =
                `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        context.fillRect(
                this.alignCenter ? -this.size.width / 2 : 0,
                this.alignCenter ? -this.size.height / 2 : 0,
                this.size.width, this.size.height);

        context.restore();
    }

    static Builder = class Builder {
        private size: Size | undefined;
        private color: Color | undefined;
        private position: Position | undefined;
        private alignCenter: boolean | undefined;
        private radianAngle: number | undefined;

        public build(): Rect {
            return new Rect(
                    this.size ?? new Size(0, 0),
                    this.color ?? new Color(0, 0, 0),
                    this.position ?? new Position(0, 0),
                    this.alignCenter ?? false,
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

        public setAlignCenter(alignCenter: boolean): Builder {
            this.alignCenter = alignCenter;
            return this;
        }

        public setAngle(degree: number): Builder {
            this.radianAngle = NumberUtil.toRadian(degree);
            return this;
        }
    }
}
