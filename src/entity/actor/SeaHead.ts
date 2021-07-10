import Environment from "../../game/Environment";
import { Key, KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Entity, { Position } from "../Entity";
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

    constructor(playerStatus: PlayerStatus, position: Position) {
        super();

        this.position = position;
        this.velocity = new Position(0, 0);
        this.radianAngle = 0;
        this.radianAngleVelocity = 0;

        this.airResistance = 0.995;
        this.gravity = 0.05;
        this.fuelUpEfficiency = 0.2;
        this.fuelAngleEfficiency = 0.001;

        this.playerStatus = playerStatus;
        this.headSprite = new Sprite.Builder()
                .setAlignCenter(true)
                .setAngle(this.radianAngle)
                .setImage(Resource.global?.getImage("sea_head"))
                .setPosition(0, 0)
                .build();
    }

     /**
     * Updates its status per each frame.
     * @param keyStatus - Key status
     */
    public override update(keyStatus: KeyStatus): void {
        super.update(keyStatus);

        if (this.playerStatus.fuel > 0) {
            this.boostUp(keyStatus);
            this.boostAngle(keyStatus);
        }
        this.velocity.top += this.gravity;
        this.velocity.left *= this.airResistance;
        this.velocity.top  *= this.airResistance;
        this.radianAngleVelocity *= this.airResistance;

        this.position.left += this.velocity.left;
        this.position.left %= Environment.VIEWPORT_WIDTH;
        this.position.top  += this.velocity.top;
        this.radianAngle += this.radianAngleVelocity;
    }

    public render(context: CanvasRenderingContext2D): void {
        [
            0,
            -Environment.VIEWPORT_WIDTH,
            +Environment.VIEWPORT_WIDTH
        ].forEach(leftOffset => {
            context.save();

            context.translate(this.position.left + leftOffset, this.position.top);
            context.rotate(this.radianAngle);
            this.headSprite.render(context);

            context.restore();
        });

        // TODO: draw fogs?
    }

    private boostUp(keyStatus: KeyStatus): void {
        if (keyStatus.isPressed(Key.UP)) {
            const xProjection = Math.sin(this.radianAngle);
            const yProjection = Math.cos(this.radianAngle);
            this.velocity.left += xProjection * this.fuelUpEfficiency;
            this.velocity.top  -= yProjection * this.fuelUpEfficiency;

            this.playerStatus.fuel -= 1;
        }
    }

    private boostAngle(keyStatus: KeyStatus): void {
        const radianAngleAcceleration =
                (keyStatus.isPressed(Key.LEFT)  ? -this.fuelAngleEfficiency : 0) +
                (keyStatus.isPressed(Key.RIGHT) ? +this.fuelAngleEfficiency : 0);
        this.radianAngleVelocity += radianAngleAcceleration;

        this.playerStatus.fuel -= 1;
    }
}
