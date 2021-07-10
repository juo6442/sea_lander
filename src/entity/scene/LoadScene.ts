import Environment from "../../game/Environment";
import Resource from "../../game/Resource";
import { CommonScript } from "../../script/CommonScript";
import Logger from "../../util/Logger";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { SceneId } from "./Scene";

export default class LoadScene extends Scene {
    public start(): void {
        Logger.info("Start LoadScene");

        new Resource.Loader()
                .setImage("loading", "sprite/loading.png")
                .load()
                .then(resource => this.onResourceLoad(resource));
    }

    private onResourceLoad(resource: Resource): void {
        Logger.info("LoadScene is loaded");

        this.addEntity("rect_bg", new Rect.Builder()
                .setSizeFullscreen()
                .setColor(255, 255, 255)
                .setAlignCenter(false)
                .setPosition(0, 0)
                .build());

        this.addEntity("image_loading", new Sprite.Builder()
                .setImage(resource.getImage("loading"))
                .setAlignCenter(false)
                .setPosition(
                    Environment.VIEWPORT_WIDTH - 478 - 10,
                    Environment.VIEWPORT_HEIGHT - 112 - 10)
                .build());

        this.loadEntireGameResource().then((resource: Resource) => {
            Logger.info("Resources are loaded");
            Resource.global = resource;

            this.pushScript(() => new CommonScript.Fade(this.getEntity("image_loading") as Sprite, 0, 10));
            this.pushScript(() => new CommonScript.Run(() => {
                this.changeScene(SceneId.INTRO);
            }));
        });
    }

    private loadEntireGameResource(): Promise<Resource> {
        return new Resource.Loader()
                .setFont("NeoDgm")
                .setImage("logo", "sprite/logo.png")
                .setImage("room", "sprite/room.png")
                .setImage("life", "sprite/life.png")
                .setImage("fuel", "sprite/fuel.png")
                .setImage("sea_arm_l", "sprite/sea_arm_l.png")
                .setImage("sea_arm_r", "sprite/sea_arm_r.png")
                .setImage("sea_leg_l", "sprite/sea_leg_l.png")
                .setImage("sea_leg_r", "sprite/sea_leg_r.png")
                .setImage("sea_body", "sprite/sea_body.png")
                .setImage("sea_head", "sprite/sea_head.png")
                .setImage("sea_fire", "sprite/sea_fire.png")
                .load();
    }
}
