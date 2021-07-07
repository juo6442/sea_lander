import { KeyStatus } from "../game/KeyInput.js";
import NumberUtil from "../util/NumberUtil.js";
import Entity, { Position, Size } from "./Entity.js";

export default class Sprite implements Entity {
    private image: HTMLImageElement | undefined;
    private size: Size;
    private alpha: number;
    private position: Position;
    private alignCenter: boolean;
    private radianAngle: number;
    private frames: Frame[];

    private currentFrameIndex: number;
    private currentFramePhase: number;

    private constructor(
            image: HTMLImageElement | undefined,
            size: Size,
            alpha: number,
            position: Position,
            alignCenter: boolean,
            radianAngle: number,
            frames: Frame[]) {
        this.image = image;
        this.size = size;
        this.alpha = alpha;
        this.position = position;
        this.alignCenter = alignCenter;
        this.radianAngle = radianAngle;
        this.frames = frames;

        this.currentFrameIndex = 0;
        this.currentFramePhase = 0;
    }

    private get currentFrame(): Frame {
        return this.frames[this.currentFrameIndex];
    }

    public update(keyStatus: KeyStatus): void {
        if (this.currentFrame.duration) {
            this.updateFrame();
        }
    }

    public render(context: CanvasRenderingContext2D): void {
        if (!this.image) return;

        context.save();

        context.translate(this.position.left, this.position.top);
        context.rotate(this.radianAngle);
        context.globalAlpha = this.alpha;

        context.drawImage(
                this.image,
                this.currentFrame.position.left, this.currentFrame.position.top,
                this.currentFrame.size.width, this.currentFrame.size.height,
                this.alignCenter ? -this.size.width / 2 : 0,
                this.alignCenter ? -this.size.height / 2 : 0,
                this.size.width, this.size.height);

        context.restore();
    }

    public isValid(): boolean {
        return true;
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
        private alpha: number | undefined;
        private position: Position | undefined;
        private alignCenter: boolean | undefined;
        private radianAngle: number | undefined;
        private frames: Frame[];

        constructor() {
            this.frames = [];
        }

        public build(): Sprite {
            if (!this.size) {
                this.size = new Size(
                        this.image?.width ?? 0,
                        this.image?.height ?? 0);
            }

            if (this.frames.length <= 0) {
                this.frames.push(new Frame(
                        new Position(0, 0),
                        this.size,
                        0));
            }

            return new Sprite(
                    this.image,
                    this.size,
                    this.alpha ?? 1,
                    this.position ?? new Position(0, 0),
                    this.alignCenter ?? false,
                    this.radianAngle ?? 0,
                    this.frames);
        }

        public setImage(image: HTMLImageElement): Builder {
            this.image = image;
            return this;
        }

        public setSize(width: number, height: number): Builder {
            this.size = new Size(width, height);
            return this;
        }

        public setAlpha(alpha: number): Builder {
            this.alpha = NumberUtil.fitIn(alpha, 0, 1);
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
                duration: number): Builder {
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