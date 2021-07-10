import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import NumberUtil from "../../util/NumberUtil";
import Entity, { Position } from "../Entity";
import Sprite from "../Sprite";

export default class FuelIndicator extends Entity {
    public position: Position;

    private playerStatus: PlayerStatus;

    private backSprite: Sprite;
    private arrowSprite: Sprite;
    private frontSprite: Sprite;

    constructor(position: Position, playerStatus: PlayerStatus) {
        super();

        this.position = position;
        this.playerStatus = playerStatus;

        this.backSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("fuel"))
                .setAlignCenter(false)
                .addFrame(408, 0, 204, 113)
                .build();
        this.arrowSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("fuel"))
                .setAlignCenter(false)
                .addFrame(204, 0, 204, 113)
                .build();
        this.frontSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("fuel"))
                .setAlignCenter(false)
                .addFrame(0, 0, 204, 113)
                .build();
    }

    public update(keyStatus: KeyStatus): void {}

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        this.backSprite.render(context);
        this.renderArrow(context);
        this.frontSprite.render(context);

        context.restore();
    }

    private renderArrow(context: CanvasRenderingContext2D): void {
        context.save();

        const xAxis = this.arrowSprite.size.width / 2;
        const yAxis = this.arrowSprite.size.height - 15;

        context.translate(xAxis, yAxis);
        context.rotate(this.getArrowAngle(this.playerStatus.fuel / PlayerStatus.FUEL_FULL));
        context.translate(-xAxis, -yAxis);

        this.arrowSprite.render(context);

        context.restore();
    }

    private getArrowAngle(rate: number): number {
        const fullAngle = -10;
        const emptyAngle = -170;
        return NumberUtil.toRadian(fullAngle + 90
                + (emptyAngle - fullAngle) * (1 - rate));
    }
}
