import { Key, KeyListener } from "./Input";

export default class TouchKeyInput {
    private listener: KeyListener;

    constructor(listener: KeyListener) {
        this.listener = listener;
    }

    public registerEventListener(): void {
        const keys = document.getElementsByClassName("touchKey");
        for (let key of Array.from(keys)) {
            if (key instanceof HTMLElement) {
                key.addEventListener("touchstart", this.onTouchStart.bind(this));
                key.addEventListener("touchend", this.onTouchEnd.bind(this));
            }
        }

        const enterKey = document.getElementById("enterKey");
        enterKey?.addEventListener("touchstart", this.onTouchStart.bind(this));
        enterKey?.addEventListener("touchend", this.onTouchEnd.bind(this));
    }

    private onTouchStart(event: TouchEvent): void {
        this.onTouch(event, true);
    }

    private onTouchEnd(event: TouchEvent): void {
        this.onTouch(event, false);
    }

    private onTouch(event: TouchEvent, touched: boolean): void {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches.item(i);
            if (touch === null) continue;

            const keyAttribute = (touch.target as HTMLElement).getAttribute("key");
            if (keyAttribute === null) continue;

            const key = this.keyAttributeToEnum(keyAttribute);
            if (key === undefined) continue;

            this.listener.onKeyInput(key, touched);
        }

        event.preventDefault();
    }

    private keyAttributeToEnum(keyAttribute: string): Key | undefined {
        switch (keyAttribute) {
            case "up": return Key.UP;
            case "left": return Key.LEFT;
            case "right": return Key.RIGHT;
            case "enter": return Key.OK;
            default: return undefined;
        }
    }
}
