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
                .setAudio("bgm", "bgm/PerituneMaterial_Laid_Back3_loop.m4a")
                .setAudio("logo", "sound/logo.wav")
                .setAudio("sleep_0", "sound/sleep_0.wav")
                .setAudio("sleep_1", "sound/sleep_1.wav")
                .setAudio("sleep_2", "sound/sleep_2.wav")
                .setAudio("sleep_3", "sound/sleep_3.wav")
                .setAudio("start_0", "sound/start_0.wav")
                .setAudio("start_1", "sound/start_1.wav")
                .setAudio("start_2", "sound/start_2.wav")
                .setAudio("start_3", "sound/start_3.wav")
                .setAudio("boost", "sound/boost.wav")
                .setAudio("crash_0", "sound/crash_0.wav")
                .setAudio("crash_1", "sound/crash_1.wav")
                .setAudio("crash_2", "sound/crash_2.wav")
                .setAudio("crash_3", "sound/crash_3.wav")
                .setAudio("crash_4", "sound/crash_4.wav")
                .setAudio("fake_0", "sound/fake_0.wav")
                .setAudio("fake_1", "sound/fake_1.wav")
                .setAudio("fake_2", "sound/fake_2.wav")
                .setAudio("success_0", "sound/success_0.wav")
                .setAudio("success_1", "sound/success_1.wav")
                .setAudio("success_2", "sound/success_2.wav")
                .setAudio("success_3", "sound/success_3.wav")
                .setAudio("success_4", "sound/success_4.wav")
                .setAudio("gameover", "sound/gameover.wav")
                .load();
    }
}
