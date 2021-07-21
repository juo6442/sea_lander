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

export class KeyStatus {
    protected status: Map<string, boolean>;

    protected constructor() {
        this.status = new Map();
        for (const k of Object.values(Key)) {
            this.status.set(k, false);
        }
    }

    /**
     * Returns key status.
     *
     * @param key - Key to inspect
     * @returns True if the key is pressed
     */
    public isPressed(key: Key): boolean {
        return this.status.get(key) ?? false;
    }
}

class SettableKeyStatus extends KeyStatus {
    constructor() {
        super();
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
}
