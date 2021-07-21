import { Key, KeyListener } from "./Input";

export default class KeyboardInput {
    private listener: KeyListener;

    constructor(listener: KeyListener) {
        this.listener = listener;
    }

    public registerEventListener(): void {
        window.addEventListener("keydown", e => this.handleKeyEvent(e));
        window.addEventListener("keyup", e => this.handleKeyEvent(e));
    }

    private handleKeyEvent(event: KeyboardEvent): void {
        const key = this.keyValueToEnum(event.key);
        if (key === undefined) return;

        this.listener.onKeyInput(key, event.type === "keydown");
        event.preventDefault();
    }

    private keyValueToEnum(keyValue: string): Key | undefined {
        switch (keyValue) {
            case "ArrowUp": return Key.UP;
            case "ArrowLeft": return Key.LEFT;
            case "ArrowRight": return Key.RIGHT;
            case "Enter": return Key.OK;
            default: return undefined;
        }
    }
}
