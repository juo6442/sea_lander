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
    public align: TextAlign;
    public radianAngle: number;

    private constructor(
            text: string,
            font: string,
            pxSize: number,
            color: Color,
            position: Position,
            align: TextAlign,
            radianAngle: number) {
        super();

        this.text = text;
        this.font = font;
        this.pxSize = pxSize;
        this.color = color;
        this.position = position;
        this.align = align;
        this.radianAngle = radianAngle;
    }

    public update(keyStatus: KeyStatus): void {}

    public render(context: CanvasRenderingContext2D): void {
        if (this.text.length <= 0) return;

        context.save();

        context.translate(this.position.left, this.position.top);
        context.rotate(this.radianAngle);

        context.fillStyle =
                `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        context.font = `${this.pxSize}px ${this.font}`;

        context.textAlign = this.align;
        context.textBaseline = "middle";
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
        private align: TextAlign | undefined;
        private radianAngle: number | undefined;

        public build(): Label {
            return new Label(
                    this.text ?? "",
                    this.font ?? Environment.FONT_DEFAULT,
                    this.pxSize ?? 10,
                    this.color ?? new Color(0, 0, 0),
                    this.position ?? new Position(0, 0),
                    this.align ?? TextAlign.ALIGN_START,
                    this.radianAngle ?? 0);
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

        public setAngle(degree: number): Builder {
            this.radianAngle = NumberUtil.toRadian(degree);
            return this;
        }
    }
}

export enum TextAlign {
    ALIGN_START = "start",
    ALIGN_END = "end",
    ALIGN_CENTER = "center",
}
