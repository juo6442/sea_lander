import { KeyStatus } from "../../game/input/Input";
import Entity, { Position } from "../Entity";
import Label, { TextAlign } from "../Label";
import Sprite from "../Sprite";

export default class NumberIndicator extends Entity {
    public position: Position;

    private iconSprite: Sprite | undefined;
    private numberLabel: Label;

    constructor(position: Position, sprite: Sprite | undefined) {
        super();

        this.position = position;
        this.iconSprite = sprite;
        this.numberLabel = new Label.Builder()
                .setAlign(TextAlign.START)
                .setSize(100)
                .setPosition(sprite ? sprite.size.width + 20 : 0, 55)
                .build();
    }

    set number(value: number) {
        this.numberLabel.text = `${value}`;
    }

    public update(keyStatus: KeyStatus): void {}

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        this.iconSprite?.render(context);
        this.numberLabel.render(context);

        context.restore();
    }
}
