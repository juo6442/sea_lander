import Environment from "../game/Environment";
import { KeyStatus } from "../game/KeyInput";
import NumberUtil from "../util/NumberUtil";
import Entity, { Color, Position } from "./Entity";

export default class Label extends Entity {
    public text: string;
    public font: string;
    public pxSize: number;
    public color: Color;
    public position: Position;
    public shadowColor: Color | undefined;
    public shadowDistance: Position | undefined;
    public align: TextAlign;

    private constructor(
            text: string,
            font: string,
            pxSize: number,
            color: Color,
            position: Position,
            shadowColor: Color | undefined,
            shadowDistance: Position | undefined,
            align: TextAlign) {
        super();

        this.text = text;
        this.font = font;
        this.pxSize = pxSize;
        this.color = color;
        this.position = position;
        this.shadowColor = shadowColor;
        this.shadowDistance = shadowDistance;
        this.align = align;
    }

    public update(keyStatus: KeyStatus): void {}

    public render(context: CanvasRenderingContext2D): void {
        if (this.text.length <= 0) return;

        context.save();

        context.font = `${this.pxSize}px ${this.font}`;
        context.textAlign = this.align;
        context.textBaseline = "middle";
        context.translate(this.position.left, this.position.top);

        if (this.shadowColor && this.shadowDistance) {
            context.translate(this.shadowDistance.left, this.shadowDistance.top);
            context.fillStyle =
                    `rgba(${this.shadowColor.r}, ${this.shadowColor.g}, ${this.shadowColor.b}, ${this.shadowColor.a})`;
            context.fillText(this.text, 0, 0);
            context.translate(-this.shadowDistance.left, -this.shadowDistance.top);
        }

        context.fillStyle =
                `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        context.fillText(this.text, 0, 0);

        context.restore();
    }

    /**
     * Returns its width when rendered.
     * @param context - Canvas context
     * @returns Width
     */
    public measureWidth(context: CanvasRenderingContext2D): number {
        context.save();
        context.font = `${this.pxSize}px ${this.font}`;
        const width = context.measureText(this.text).width;
        context.restore();
        return width;
    }

    static Builder = class Builder {
        private text: string | undefined;
        private font: string | undefined;
        private pxSize: number | undefined;
        private color: Color | undefined;
        private position: Position | undefined;
        private shadowColor: Color | undefined;
        private shadowDistance: Position | undefined;
        private align: TextAlign | undefined;

        public build(): Label {
            return new Label(
                    this.text ?? "",
                    this.font ?? Environment.FONT_DEFAULT,
                    this.pxSize ?? 10,
                    this.color ?? new Color(0, 0, 0),
                    this.position ?? new Position(0, 0),
                    this.shadowColor,
                    this.shadowDistance,
                    this.align ?? TextAlign.START);
        }

        public setText(text: string): Builder {
            this.text = text;
            return this;
        }

        public setFont(font: string): Builder {
            this.font = font;
            return this;
        }

        public setSize(pxSize: number): Builder {
            this.pxSize = pxSize;
            return this;
        }

        public setShadowColor(r: number, g: number, b: number, a: number = 1): Builder {
            this.shadowColor = new Color(r, g, b, a);
            return this;
        }

        public setShadowDistance(left: number, top: number): Builder {
            this.shadowDistance = new Position(left, top);
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

        public setAlign(align: TextAlign): Builder {
            this.align = align;
            return this;
        }
    }
}

export enum TextAlign {
    START = "start",
    END = "end",
    CENTER = "center",
}
