import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import Entity, { Color, Position } from "../Entity";
import Rect from "../Rect";
import { DockingCriteria } from "../scene/InGameScene";
import Sprite from "../Sprite";

export default class DockingIndicator extends Entity {
    public position: Position;

    private readonly greenColor: Color;
    private readonly redColor: Color;

    private criteria: DockingCriteria;

    private panelRects: Rect[];
    private frontSprite: Sprite;

    constructor(position: Position, criteria: DockingCriteria) {
        super();

        this.position = position;
        this.criteria = criteria;

        this.greenColor = new Color(0, 255, 0);
        this.redColor = new Color(255, 0, 0);

        this.panelRects = [
            new Rect.Builder()
                    .setPosition(90, 20)
                    .setSize(60, 60)
                    .build(),
            new Rect.Builder()
                    .setPosition(160, 20)
                    .setSize(60, 60)
                    .build(),
            new Rect.Builder()
                    .setPosition(240, 20)
                    .setSize(60, 60)
                    .build(),
            new Rect.Builder()
                    .setPosition(320, 20)
                    .setSize(80, 60)
                    .build(),
        ];
        this.frontSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("docking"))
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        [
            this.criteria.verticalVelocity,
            this.criteria.horizontalVelocity,
            this.criteria.angleVelocity,
            this.criteria.angle,
        ].forEach((safe: boolean, i: number) => {
            this.panelRects[i].color = safe ? this.greenColor : this.redColor;
        });

    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        this.panelRects.forEach(e => e.render(context));
        this.frontSprite.render(context);

        context.restore();
    }
}
