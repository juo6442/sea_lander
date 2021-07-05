export class KeyListener {
    private _keyStatus: SettableKeyStatus;

    constructor() {
        this._keyStatus = new SettableKeyStatus();
    }

    get keyStatus(): KeyStatus {
        return this._keyStatus;
    }

    /**
     * Starts to listen key event.
     */
    public registerEventListener(): void {
        window.addEventListener("keydown", e => this.handleKeyEvent(e));
        window.addEventListener("keyup", e => this.handleKeyEvent(e));
    }

    private handleKeyEvent(event: KeyboardEvent): void {
        this._keyStatus.setPressed(event.key, event.type === "keydown");
        event.preventDefault();
    }
}

export enum Key {
    UP = "ArrowUp",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight",
    PAUSE = "Escape",
    OK = "Enter",
}

export interface KeyStatus {
    /**
     * Returns key status.
     *
     * @param key - Key to inspect
     * @returns True if the key is pressed
     */
    isPressed(key: Key): boolean;
}

class SettableKeyStatus implements KeyStatus {
    private status: Map<string, boolean>;

    constructor() {
        this.status = new Map<string, boolean>();
        for (const k of Object.values(Key)) {
            this.status.set(k, false);
        }
    }

    /**
     * Set key status.
     *
     * @param key - Key string to set
     * @param pressed - True if the key is pressed
     */
    public setPressed(key: string, pressed: boolean): void {
        if (this.status.has(key)) {
            this.status.set(key, pressed);
        }
    }

    public isPressed(key: Key): boolean {
        return this.status.get(key) ?? false;
    }
}
