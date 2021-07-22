import Logger from "../../util/Logger";
import { Key, KeyListener } from "./Input";

export default class TouchKeyInput {
    private canvas: HTMLElement | undefined;
    private listener: KeyListener;

    constructor(listener: KeyListener) {
        this.listener = listener;
    }

    public registerEventListener(canvas: HTMLElement): void {
        this.canvas = canvas;
        canvas.addEventListener("touchstart", this.inspectTouches.bind(this));
        canvas.addEventListener("touchmove", this.inspectTouches.bind(this));
        canvas.addEventListener("touchend", this.inspectTouches.bind(this));
    }

    private inspectTouches(event: TouchEvent): void {
        for (let i = 0; i < event.targetTouches.length; i++) {
            const touch = event.targetTouches.item(i);
            if (!touch) continue;

            // TODO: implement
            console.log(this.getTouchOffset(touch));
        }

        event.preventDefault();
    }

    private getTouchOffset(touch: Touch): Position {
        return new Position(
                touch.pageX - this.canvas!.offsetLeft,
                touch.pageY - this.canvas!.offsetTop);
    }
}

class Position {
    public left: number;
    public top: number;

    constructor(left: number, top: number) {
        this.left = left;
        this.top = top;
    }
}
