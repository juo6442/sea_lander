export class KeyListener {
    private _keyStatus: SettableKeyStatus;

    constructor() {
        this._keyStatus = new SettableKeyStatus();
    }

    get keyStatus(): KeyStatus {
        return this._keyStatus;
    }

    public onKeyInput(key: Key, pressed: boolean): void {
        this._keyStatus.setPressed(key, pressed);
    }
}

export const enum Key {
    UP, LEFT, RIGHT, OK
}

export class KeyStatus {
    protected status: Map<Key, boolean>;

    protected constructor() {
        this.status = new Map();
        [Key.UP, Key.LEFT, Key.RIGHT, Key.OK]
                .forEach(k => this.status.set(k, false));
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
     * @param key - Key to set
     * @param pressed - True if the key is pressed
     */
    public setPressed(key: Key, pressed: boolean): void {
        if (this.status.has(key)) {
            this.status.set(key, pressed);
        }
    }
}
