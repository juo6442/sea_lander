import Environment from "../../game/Environment";
import Resource from "../../game/Resource";
import { CommonScript } from "../../script/CommonScript";
import Logger from "../../util/Logger";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";

export default class LoadScene extends Scene {
    private bgRect: Rect;
    private loadingSprite: Sprite | undefined;

    constructor(sceneManager: SceneManager, bundle?: Bundle) {
        super(sceneManager, bundle);

        this.bgRect = new Rect.Builder()
                .setSizeFullscreen()
                .setColor(255, 255, 255)
                .setPosition(0, 0)
                .build();
    }

    public start(): void {
        Logger.info("Start LoadScene");

        new Resource.Loader()
                .setImage("loading", "sprite/loading.png")
                .load()
                .then(resource => this.onResourceLoad(resource));
    }

    public render(context: CanvasRenderingContext2D): void {
        this.bgRect.render(context);
        this.loadingSprite?.render(context);
    }

    private onResourceLoad(resource: Resource): void {
        Logger.info("LoadScene is loaded");

        this.loadingSprite = new Sprite.Builder()
                .setImage(resource.getImage("loading"))
                .setPosition(
                    Environment.VIEWPORT_WIDTH - 478 - 10,
                    Environment.VIEWPORT_HEIGHT - 112 - 10)
                .build()

        this.loadEntireGameResource().then((resource: Resource) => {
            Logger.info("Resources are loaded");
            Resource.global = resource;

            this.pushScript(() => new CommonScript.Fade(this.loadingSprite!, 0, 10));
            this.pushScript(() => new CommonScript.Run(() => {
                this.changeScene(SceneId.INTRO);
            }));
        });
    }

    private loadEntireGameResource(): Promise<Resource> {
        return new Resource.Loader()
                .setFont("NeoDgm")
                .setImage("logo", "sprite/logo.png")
                .setImage("title_bg", "sprite/title_bg.png")
                .setImage("title_head", "sprite/title_head.png")
                .setImage("room", "sprite/room.png")
                .setImage("life", "sprite/life.png")
                .setImage("fuel", "sprite/fuel.png")
                .setImage("docking", "sprite/docking.png")
                .setImage("carrot", "sprite/carrot.png")
                .setImage("coin", "sprite/coin.png")
                .setImage("crash", "sprite/crash.png")
                .setImage("fog", "sprite/fog.png")
                .setImage("sea_arm_l", "sprite/sea_arm_l.png")
                .setImage("sea_arm_r", "sprite/sea_arm_r.png")
                .setImage("sea_leg_l", "sprite/sea_leg_l.png")
                .setImage("sea_leg_r", "sprite/sea_leg_r.png")
                .setImage("sea_body", "sprite/sea_body.png")
                .setImage("sea_head", "sprite/sea_head.png")
                .setImage("sea_fire", "sprite/sea_fire.png")
                .setImage("sea_arrow", "sprite/sea_arrow.png")
                .setImage("enemy_head", "sprite/enemy_head.png")
                .setImage("enemy_body", "sprite/enemy_body.png")
                .setAudio("logo", "sound/logo.wav")
                .setAudio("boost", "sound/boost.wav")
                .load();
    }
}
