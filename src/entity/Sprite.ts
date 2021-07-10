import { KeyStatus } from "../game/KeyInput";
import NumberUtil from "../util/NumberUtil";
import Entity, { Color, Position, Size } from "./Entity";

export default class Sprite extends Entity {
    public image: HTMLImageElement | undefined;
    public size: Size;
    public color: Color;
    public position: Position;
    public alignCenter: boolean;
    public radianAngle: number;

    private frames: Frame[];
    private _currentFrameIndex: number;
    private currentFramePhase: number;

    private constructor(
            image: HTMLImageElement | undefined,
            size: Size,
            color: Color,
            position: Position,
            alignCenter: boolean,
            radianAngle: number,
            frames: Frame[]) {
        super();

        this.image = image;
        this.size = size;
        this.color = color;
        this.position = position;
        this.alignCenter = alignCenter;
        this.radianAngle = radianAngle;
        this.frames = frames;

        this._currentFrameIndex = 0;
        this.currentFramePhase = 0;
    }

    set currentFrameIndex(value: number) {
        this._currentFrameIndex = value % this.frames.length;
        this.currentFramePhase = 0;
    }

    get currentFrameIndex(): number {
        return this._currentFrameIndex;
    }

    private get currentFrame(): Frame {
        return this.frames[this.currentFrameIndex];
    }

    public override update(keyStatus: KeyStatus): void {
        if (this.currentFrame.duration > 0) {
            this.updateFrame();
        }
    }

    public render(context: CanvasRenderingContext2D): void {
        if (!this.image) return;

        context.save();

        context.translate(this.position.left, this.position.top);
        context.rotate(this.radianAngle);
        context.globalAlpha = this.color.a;

        // TODO: Implement tinting

        context.drawImage(
                this.image,
                this.currentFrame.position.left, this.currentFrame.position.top,
                this.currentFrame.size.width, this.currentFrame.size.height,
                this.alignCenter ? -this.size.width / 2 : 0,
                this.alignCenter ? -this.size.height / 2 : 0,
                this.size.width, this.size.height);

        context.restore();
    }

    private updateFrame() {
        if (this.currentFramePhase++ >= this.currentFrame.duration) {
            this.currentFramePhase = 0;

            this.currentFrameIndex += 1;
            this.currentFrameIndex %= this.frames.length;
        }
    }

    static Builder = class Builder {
        private image: HTMLImageElement | undefined;
        private size: Size | undefined;
        private color: Color | undefined;
        private position: Position | undefined;
        private alignCenter: boolean | undefined;
        private radianAngle: number | undefined;
        private frames: Frame[];

        constructor() {
            this.frames = [];
        }

        public build(): Sprite {
            if (this.frames.length <= 0) {
                this.frames.push(new Frame(
                        new Position(0, 0),
                        new Size(this.image?.width ?? 0, this.image?.height ?? 0),
                        0));
            }

            if (!this.size) {
                this.size = new Size(
                        this.frames[0].size.width ?? 0,
                        this.frames[0].size.height ?? 0);
            }

            return new Sprite(
                    this.image,
                    this.size,
                    this.color ?? new Color(0, 0, 0, 1),
                    this.position ?? new Position(0, 0),
                    this.alignCenter ?? false,
                    this.radianAngle ?? 0,
                    this.frames);
        }

        public setImage(image: HTMLImageElement | undefined): Builder {
            this.image = image;
            return this;
        }

        public setSize(width: number, height: number): Builder {
            this.size = new Size(width, height);
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

        public addFrame(
                sourceLeft: number, sourceTop: number,
                sourceWidth: number, sourceHeight: number,
                duration: number = 0): Builder {
            this.frames.push(new Frame(
                    new Position(sourceLeft, sourceTop),
                    new Size(sourceWidth, sourceHeight),
                    duration));
            return this;
        }
    }
}

class Frame {
    public position: Position;
    public size: Size;
    public duration: number;

    constructor(position: Position, size: Size, duration: number) {
        this.position = position;
        this.size = size;
        this.duration = duration;
    }
}
