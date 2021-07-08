import Environment from "../../game/Environment";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneId } from "./Scene";

export default class LoadScene extends Scene {
    public override start(): void {
        new Resource.Loader()
                .setImage("loading", "sprite/loading.png")
                .load()
                .then(resource => this.onResourceLoad(resource));
    }

    private onResourceLoad(resource: Resource): void {
        Logger.info("LoadScene is loaded");

        this.addEntity("rect_bg", new Rect.Builder()
                .setSizeFullscreen()
                .setColor(0, 0, 0)
                .setAlignCenter(false)
                .setPosition(0, 0)
                .build());

        this.addEntity("image_loading", new Sprite.Builder()
                .setImage(resource.getImage("loading"))
                .setAlignCenter(false)
                .setSize(196, 44)
                .setPosition(
                    Environment.VIEWPORT_WIDTH - 196 - 5,
                    Environment.VIEWPORT_HEIGHT - 44 - 5)
                .build());

        this.loadEntireGameResource().then((resource: Resource) => {
            Logger.info("Resources are loaded");

            this.pushScript(CommonScript.Fade(this.getEntity("image_loading"), 0, 0.5));
            this.pushScript(CommonScript.Fade(this.getEntity("image_logo"), 1, 0.5));
            this.pushScript(CommonScript.Run(() => {
                // TODO: audio SE-HA
            });
            this.pushScript(CommonScript.Wait(3));
            this.pushScript(CommonScript.Fade(this.getEntity("image_logo"), 0, 0.5));

            this.setScriptFinishedCallback(() => {
                const bundle = new Bundle();
                bundle.set("resource", resource);

                this.changeScene(SceneId.TITLE, bundle);
            });
        });
    }

    private loadEntireGameResource(): Promise<Resource> {
        return new Resource.Loader()
                .setFont("NeoDgm")
                .setImage("logo", "sprite/logo.png")
                .setImage("room", "sprite/room.png")
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