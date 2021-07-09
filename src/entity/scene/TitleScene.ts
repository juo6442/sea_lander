import Environment from "../../game/Environment";
import Resource from "../../game/Resource";
import Logger from "../../util/Logger";
import Label, { TextAlign } from "../Label";
import Rect from "../Rect";
import Sprite from "../Sprite";
import Scene, { Bundle, SceneManager } from "./Scene";

export default class TitleScene extends Scene {
    public start(): void {
        Logger.info("Start TitleScene");

    }

    private onResourceLoad(resource: Resource): void {
        Logger.info("TitleScene is loaded");

        this.addEntity("rect_bg", new Rect.Builder()
                .setSizeFullscreen()
                .setColor(0, 0, 0)
                .setAlignCenter(false)
                .setPosition(0, 0)
                .build());
    }
}