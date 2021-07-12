import { KeyStatus } from "../../game/KeyInput";
import Resource from "../../game/Resource";
import Entity, { Position } from "../Entity";
import Label, { TextAlign } from "../Label";
import Sprite from "../Sprite";

export default class ScoreIndicator extends Entity {
    public position: Position;

    private iconSprite: Sprite;
    private scoreLabel: Label;

    constructor(position: Position) {
        super();

        this.position = position;

        this.iconSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("coin"))
                .build();
        this.scoreLabel = new Label.Builder()
                .setAlign(TextAlign.START)
                .setSize(100)
                .setPosition(123, 55)
                .build();
    }

    set score(value: number) {
        this.scoreLabel.text = `${value}`;
    }

    public update(keyStatus: KeyStatus): void {}

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        this.iconSprite.render(context);
        this.scoreLabel.render(context);

        context.restore();
    }
}
