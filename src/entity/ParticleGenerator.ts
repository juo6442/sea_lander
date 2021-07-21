import { KeyStatus } from "../game/input/Input";
import NumberUtil from "../util/NumberUtil";
import Entity, { Color, Position } from "./Entity";

export default class ParticleGenerator extends Entity {
    public position: Position;
    public radianAngle: number;
    public radianAngleVariance: number;
    public color: Color;
    public speed: number;
    public duration: number;
    public interval: number;
    public minRadius: number;
    public maxRadius: number;

    private remainInterval: number;
    private running: boolean;
    private particles: Particle[];

    constructor(
            position: Position,
            color: Color,
            duration: number,
            interval: number,
            speed: number,
            minRadius: number, maxRadius: number,
            radianAngle: number,
            radianAngleVariance: number) {
        super();

        this.position = position;
        this.color = color;

        this.duration = duration;
        this.interval = interval;
        this.remainInterval = 0;
        this.speed = speed;
        this.minRadius = minRadius;
        this.maxRadius = maxRadius;
        this.radianAngle = radianAngle;
        this.radianAngleVariance = radianAngleVariance;

        this.running = false;
        this.particles = [];
    }

    public update(keyStatus: KeyStatus): void {
        if (this.running && --this.remainInterval < 0) {
            this.remainInterval = this.interval;
            this.particles.push(new Particle(
                new Position(this.position.left, this.position.top),
                this.getRandomVelocity(),
                new Color(this.color.r, this.color.g, this.color.b, this.color.a),
                this.duration,
                this.minRadius, this.maxRadius
            ));
        }

        this.particles.forEach(e => e.update(keyStatus));
        this.particles = this.particles.filter(e => !e.invalidated);
    }

    public render(context: CanvasRenderingContext2D): void {
        this.particles.forEach(e => e.render(context));
    }

    public start(): void {
        this.running = true;
    }

    public stop(): void {
        this.running = false;
        this.remainInterval = 0;
    }

    private getRandomVelocity(): Position {
        const angle = this.radianAngle
                + NumberUtil.random(-this.radianAngleVariance, this.radianAngleVariance);
        const xProjection = Math.sin(angle) * this.speed;
        const yProjection = -Math.cos(angle) * this.speed;
        return new Position(xProjection, yProjection);
    }

    static Builder = class Builder {
        private position: Position | undefined;
        private color: Color | undefined;
        private duration: number | undefined;
        private interval: number | undefined;
        private speed: number | undefined;
        private minRadius: number | undefined;
        private maxRadius: number | undefined;
        private radianAngle: number | undefined;
        private radianAngleVariance: number | undefined;

        public build(): ParticleGenerator {
            return new ParticleGenerator(
                this.position ?? new Position(0, 0),
                this.color ?? new Color(0, 0, 0),
                this.duration ?? 60,
                this.interval ?? 5,
                this.speed ?? 5,
                this.minRadius ?? 5, this.maxRadius ?? 5,
                this.radianAngle ?? 0,
                this.radianAngleVariance ?? Math.PI,
            );
        }

        public setPosition(left: number, top: number): Builder {
            this.position = new Position(left, top);
            return this;
        }

        public setColor(r: number, g: number, b: number, a: number = 1): Builder {
            this.color = new Color(r, g, b, a);
            return this;
        }

        public setDuration(frame: number): Builder {
            this.duration = frame;
            return this;
        }

        public setInterval(frame: number): Builder {
            this.interval = frame;
            return this;
        }

        public setSpeed(speed: number): Builder {
            this.speed = speed;
            return this;
        }

        public setRadius(min: number, max: number): Builder {
            this.minRadius = min;
            this.maxRadius = max;
            return this;
        }

        public setAngle(degree: number, varianceDegree: number): Builder {
            this.radianAngle = NumberUtil.toRadian(degree);
            this.radianAngleVariance = NumberUtil.toRadian(varianceDegree);
            return this;
        }
    }
}

class Particle extends Entity {
    private position: Position;
    private readonly velocity: Position;
    private readonly color: Color;
    private readonly duration: number;
    private remainDuration: number;
    private readonly minRadius: number;
    private readonly maxRadius: number;

    constructor(
            position: Position,
            velocity: Position,
            color: Color,
            duration: number,
            minRadius: number,
            maxRadius: number) {
        super();

        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.duration = duration;
        this.remainDuration = duration;
        this.minRadius = minRadius;
        this.maxRadius = maxRadius;
    }

    public update(keyStatus: KeyStatus): void {
        if (--this.remainDuration < 0) {
            this.invalidate();
            return;
        }

        this.position.left += this.velocity.left;
        this.position.top += this.velocity.top;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        context.fillStyle =
                `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        context.beginPath();
        context.arc(
                0, 0, this.currentRadius(),
                0, Math.PI * 2);
        context.fill();

        context.restore();
    }

    private currentRadius(): number {
        return this.minRadius
                + (this.maxRadius - this.minRadius) * (this.remainDuration / this.duration);
    }
}
