import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Entity, { Position } from "../Entity";
import Label, { TextAlign } from "../Label";
import Sprite from "../Sprite";

export default class SeaHead extends Entity {
    public position: Position;
    public velocity: Position;
    public radianAngle: number;
    public radianAngleVelocity: number;

    private airResistance: number;
    private gravity: number;
    private fuelUpEfficiency: number;
    private fuelAngleEfficiency: number;

    private playerStatus: PlayerStatus;
    private headSprite: Sprite;
    private arrowSprite: Sprite;
    private arrowLabel: Label;

    constructor(playerStatus: PlayerStatus, position: Position) {
        super();

        this.position = position;
        this.velocity = new Position(0, 0);
        this.radianAngle = 0;
        this.radianAngleVelocity = 0;

        this.airResistance = 0.995;
        this.gravity = 0.07;
        this.fuelUpEfficiency = 0.2;
        this.fuelAngleEfficiency = 0.001;

        this.playerStatus = playerStatus;
        this.headSprite = new Sprite.Builder()
                .setOriginCenter()
                .setAngle(this.radianAngle)
                .setImage(Resource.global?.getImage("sea_head"))
                .setPosition(0, 0)
                .addFrame(0, 0, 212, 176, 0)
                .addFrame(212, 0, 212, 176, 0)
                .build();
        this.arrowSprite = new Sprite.Builder()
                .setOriginCenter()
                .setImage(Resource.global?.getImage("sea_arrow"))
                .setPosition(0, 250)
                .build();
        this.arrowLabel = new Label.Builder()
                .setAlign(TextAlign.ALIGN_CENTER)
                .setColor(0, 0, 0)
                .setSize(70)
                .setPosition(0, 330)
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        this.handleBoost(keyStatus);
        this.updateVelocity();
        this.applyVelocity();
    }

    public render(context: CanvasRenderingContext2D): void {
        [
            0,
            -Environment.VIEWPORT_WIDTH,
            +Environment.VIEWPORT_WIDTH
        ].forEach(loopOffset => {
            context.save();

            context.translate(this.position.left + loopOffset, this.position.top);
            context.rotate(this.radianAngle);
            this.headSprite.render(context);

            context.restore();
        });

        if (this.position.top < 0) {
            this.arrowLabel.text = `${Math.floor(-this.position.top / 50)}m`;
            this.arrowLabel.position.left = this.arrowSprite.position.left = this.position.left;

            this.arrowLabel.render(context);
            this.arrowSprite.render(context);
        }

        // TODO: draw fogs?
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
    }

    private handleBoost(keyStatus: KeyStatus) {
        const boosted = this.boostUp(keyStatus) || this.boostAngle(keyStatus);
        this.headSprite.currentFrameIndex = (boosted ? 1 : 0);

        if (this.playerStatus.fuel > 0) {
            this.boostUp(keyStatus);
            this.boostAngle(keyStatus);
        }
    }

    private boostUp(keyStatus: KeyStatus): boolean {
        if (!keyStatus.isPressed(Key.UP)) return false;
        if (this.playerStatus.fuel <= 0) return false;

        const xProjection = Math.sin(this.radianAngle);
        const yProjection = Math.cos(this.radianAngle);
        this.velocity.left += xProjection * this.fuelUpEfficiency;
        this.velocity.top  -= yProjection * this.fuelUpEfficiency;

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
}
