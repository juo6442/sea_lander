import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import AudioResource from "../../sound/AudioResource";
import NumberUtil from "../../util/NumberUtil";
import { Position } from "../Entity";
import Label, { TextAlign } from "../Label";
import ParticleGenerator from "../ParticleGenerator";
import { DockingCriteria } from "../scene/InGameScene";
import Sprite from "../Sprite";
import Actor from "./Actor";

export default class SeaHead extends Actor {
    public velocity: Position;
    public radianAngle: number;
    public radianAngleVelocity: number;

    private readonly airResistance: number;
    private readonly gravity: number;
    private readonly fuelUpEfficiency: number;
    private readonly fuelAngleEfficiency: number;
    private readonly angleInstability: number;
    private readonly angleGravityRate: number;

    private playerStatus: PlayerStatus;
    private criteria: DockingCriteria;
    private headSprite: Sprite;
    private fireSprite: Sprite;
    private arrowSprite: Sprite;
    private arrowLabel: Label;
    private boostSound: AudioResource;
    private particle: ParticleGenerator;

    constructor(playerStatus: PlayerStatus, criteria: DockingCriteria,
            position: Position, particle: ParticleGenerator) {
        super(position, 50);

        this.position = position;
        this.velocity = new Position(0, 0);
        this.particle = particle;

        this.radianAngle = 0;
        this.radianAngleVelocity = 0;

        this.airResistance = 0.997;
        this.gravity = 0.09;
        this.fuelUpEfficiency = 0.4;
        this.fuelAngleEfficiency = 0.002;
        this.angleInstability = 0.0002;
        this.angleGravityRate = 1.008;

        this.playerStatus = playerStatus;
        this.criteria = criteria;
        this.headSprite = new Sprite.Builder()
                .setOriginCenter()
                .setImage(Resource.global?.getImage("sea_head"))
                .setPosition(0, 0)
                .addFrame(0, 0, 212, 176, 0)
                .addFrame(212, 0, 212, 176, 0)
                .addFrame(424, 0, 212, 176, 0)
                .build();
        this.fireSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("sea_fire"))
                .setColor(0, 0, 0, 0)
                .setOrigin(19, 6)
                .setPosition(0, 55)
                .build();
        this.arrowSprite = new Sprite.Builder()
                .setOriginCenter()
                .setImage(Resource.global?.getImage("sea_arrow"))
                .setPosition(0, 250)
                .build();
        this.arrowLabel = new Label.Builder()
                .setAlign(TextAlign.CENTER)
                .setColor(0, 0, 0)
                .setSize(70)
                .setPosition(0, 330)
                .build();
        this.boostSound = new AudioResource.Builder()
                .setBuffer(Resource.global?.getAudio("boost"))
                .setLoop(true)
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        this.handleBoost(keyStatus);
        this.updateVelocity();
        this.applyVelocity();

        if (this.playerStatus.fuel <= 0) this.setExhausted();
    }

    public override render(context: CanvasRenderingContext2D): void {
        [
            0,
            -Environment.VIEWPORT_WIDTH,
            +Environment.VIEWPORT_WIDTH
        ].forEach(loopOffset => {
            context.save();

            context.translate(this.position.left + loopOffset, this.position.top);
            context.rotate(this.radianAngle);
            this.fireSprite.render(context);
            this.headSprite.render(context);

            context.restore();
        });

        if (this.position.top < 0) {
            this.arrowLabel.text = `${Math.floor(-this.position.top / 50)}m`;
            this.arrowLabel.position.left = this.arrowSprite.position.left = this.position.left;

            this.arrowLabel.render(context);
            this.arrowSprite.render(context);
        }

        super.render(context);
    }

    public override invalidate(): void {
        super.invalidate();
        this.boostSound.stop();
        this.particle.stop();
    }

    public setSuccess(): void {
        this.headSprite.currentFrameIndex = 0;
        this.fireSprite.color.a = 0;
        this.boostSound.stop();
        this.particle.stop();
    }

    public setExhausted(): void {
        this.headSprite.currentFrameIndex = 2;
        this.fireSprite.color.a = 0;
        this.boostSound.stop();
        this.particle.stop();
    }

    private normalizeAngle(radianAngle: number): number {
        if (radianAngle > +Math.PI) return radianAngle - 2 * Math.PI;
        if (radianAngle < -Math.PI) return radianAngle + 2 * Math.PI;
        return radianAngle;
    }

    private updateVelocity() {
        this.velocity.top += this.gravity;
        this.velocity.left *= this.airResistance;
        this.velocity.top  *= this.airResistance;
        this.radianAngleVelocity *= this.airResistance;
    }

    private applyVelocity() {
        this.position.left += this.velocity.left + Environment.VIEWPORT_WIDTH;
        this.position.left %= Environment.VIEWPORT_WIDTH;
        this.position.top  += this.velocity.top;
        this.radianAngle += this.radianAngleVelocity;

        this.radianAngle = this.normalizeAngle(this.radianAngle);
    }

    private handleBoost(keyStatus: KeyStatus) {
        const boosted = this.boostUp(keyStatus)
        const angleBoosted = this.boostAngle(keyStatus);

        this.fireSprite.color.a = (boosted ? 1 : 0);

        if (boosted) {
            this.boostSound.play();
            this.generateParticle();
        } else {
            this.boostSound.stop();
            this.particle.stop();
        }

        if (boosted || angleBoosted) {
            this.headSprite.currentFrameIndex = 1;
        } else {
            this.headSprite.currentFrameIndex = this.criteria.check() ? 0 : 2;
        }

    }

    private boostUp(keyStatus: KeyStatus): boolean {
        if (!keyStatus.isPressed(Key.UP)) return false;
        if (this.playerStatus.fuel <= 0) return false;

        const xProjection = +Math.sin(this.radianAngle);
        const yProjection = -Math.cos(this.radianAngle);
        this.velocity.left += xProjection * this.fuelUpEfficiency;
        this.velocity.top  += yProjection * this.fuelUpEfficiency;

        this.radianAngleVelocity +=
                NumberUtil.random(-this.angleInstability, +this.angleInstability);
        this.radianAngle *= this.angleGravityRate;

        this.playerStatus.fuel -= 1;

        return true;
    }

    private boostAngle(keyStatus: KeyStatus): boolean {
        if (keyStatus.isPressed(Key.LEFT) == keyStatus.isPressed(Key.RIGHT)) return false;
        if (this.playerStatus.fuel <= 0) return false;

        const radianAngleAcceleration =
                (keyStatus.isPressed(Key.LEFT)  ? -this.fuelAngleEfficiency : 0) +
                (keyStatus.isPressed(Key.RIGHT) ? +this.fuelAngleEfficiency : 0);
        this.radianAngleVelocity += radianAngleAcceleration;

        this.playerStatus.fuel -= 1;

        return true;
    }

    private generateParticle(): void {
        const oppositeAngle = this.radianAngle + Math.PI;
        this.particle.position.left = this.position.left + Math.sin(oppositeAngle) * 80;
        this.particle.position.top = this.position.top - Math.cos(oppositeAngle) * 80;
        this.particle.radianAngle = oppositeAngle;

        this.particle.start();
    }
}
