import Environment from "../../game/Environment";
import Resource from "../../game/Resource";
import { CommonScript } from "../../script/CommonScript";
import Logger from "../../util/Logger";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneId, SceneManager } from "./Scene";

export default class IntroScene extends Scene {
    public start(): void {
        Logger.info("Start IntroScene");

        this.addEntity("rect_bg", new Rect.Builder()
                .setSizeFullscreen()
                .setColor(255, 255, 255)
                .setAlignCenter(false)
                .setPosition(0, 0)
                .build());

        this.addEntity("image_logo", new Sprite.Builder()
                .setImage(Resource.global?.getImage("logo"))
                .setColor(0, 0, 0, 0)
                .setAlignCenter(true)
                .setPosition(
                    Environment.VIEWPORT_WIDTH / 2,
                    Environment.VIEWPORT_HEIGHT / 2)
                .build());

        this.showLogo();
    }

    private showLogo(): void {
        this.pushScript(() => new CommonScript.Wait(50));
        this.pushScript(() => new CommonScript.Fade(this.getEntity("image_logo") as Sprite, 1, 30));
        this.pushScript(() => new CommonScript.Run(() => {
            // TODO: Play audio SE-HA
        }));
        this.pushScript(() => new CommonScript.Wait(90));
        this.pushScript(() => new CommonScript.Fade(this.getEntity("image_logo") as Sprite, 0, 30));
        this.pushScript(() => new CommonScript.Run(() => {
            this.changeScene(SceneId.TITLE);
        }));
    }
}
