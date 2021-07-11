import Environment from "../../game/Environment";
import Resource from "../../game/Resource";
import { CommonScript } from "../../script/CommonScript";
import Logger from "../../util/Logger";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";

export default class IntroScene extends Scene {
    private bgRect: Rect;
    private logoSprite: Sprite;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.bgRect = new Rect.Builder()
                .setSizeFullscreen()
                .setColor(255, 255, 255)
                .setPosition(0, 0)
                .build();
        this.logoSprite = new Sprite.Builder()
                .setImage(Resource.global?.getImage("logo"))
                .setColor(0, 0, 0, 0)
                .setOriginCenter()
                .setPosition(
                    Environment.VIEWPORT_WIDTH / 2,
                    Environment.VIEWPORT_HEIGHT / 2)
                .build();
    }

    public start(): void {
        Logger.info("Start IntroScene");

        this.showLogo();
    }

    public render(context: CanvasRenderingContext2D): void {
        this.bgRect.render(context);
        this.logoSprite.render(context);
    }

    private showLogo(): void {
        this.pushScript(() => new CommonScript.Wait(50));
        this.pushScript(() => new CommonScript.Fade(this.logoSprite, 1, 30));
        this.pushScript(() => new CommonScript.Run(() => {
            // TODO: Play audio SE-HA
        }));
        this.pushScript(() => new CommonScript.Wait(90));
        this.pushScript(() => new CommonScript.Fade(this.logoSprite, 0, 30));
        this.pushScript(() => new CommonScript.Run(() => {
            this.changeScene(SceneId.TITLE);
        }));
    }
}
