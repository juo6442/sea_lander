import { KeyStatus } from "../../game/KeyInput";
import PlayerStatus from "../../game/PlayerStatus";
import Resource from "../../game/Resource";
import Entity, { Position } from "../Entity";
import Sprite from "../Sprite";

export default class LifeIndicator extends Entity {
    public position: Position;

    private playerStatus: PlayerStatus;
    private displayingLife : number;

    private eachWidth: number;
    private padding: number;
    private livingSprite: Sprite;
    private fallingSprite: Sprite;
    private fogSprite: Sprite;

    constructor(position: Position, playerStatus: PlayerStatus) {
        super();

        this.position = position;
        this.playerStatus = playerStatus;
        this.displayingLife = playerStatus.life;

        this.eachWidth = 130;
        this.padding = 5;

        this.livingSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("life"))
                .addFrame(0, 0, 130, 111)
                .build();
        this.fallingSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("life"))
                .addFrame(130, 0, 130, 111)
                .build();
        this.fogSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("life"))
                .addFrame(260, 0, 130, 111)
                .setColor(0, 0, 0, 0)
                .build();
    }

    public update(keyStatus: KeyStatus): void {
        this.livingSprite.update(keyStatus);

        if (this.displayingLife > this.playerStatus.life) {
            this.showFog(this.displayingLife - 1);
        }
        this.displayingLife = this.playerStatus.life;

        if (this.fogSprite.color.a > 0) {
            this.fogSprite.position.top -= 0.7;
            this.fogSprite.color.a -= 0.02;
        }
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        let i = 0;

        for (; i < this.playerStatus.life; i++) {
            this.livingSprite.position.left = (this.padding + this.eachWidth) * i;
            this.livingSprite.render(context);
        }

        for (; i < PlayerStatus.LIFE_FULL; i++) {
            this.fallingSprite.position.left = (this.padding + this.eachWidth) * i;
            this.fallingSprite.render(context);
        }

        this.fogSprite.render(context);

        context.restore();
    }

    private showFog(index: number) {
        this.fogSprite.position.top = 0;
        this.fogSprite.position.left = (this.padding + this.eachWidth) * index;
        this.fogSprite.color.a = 1;
    }
}
