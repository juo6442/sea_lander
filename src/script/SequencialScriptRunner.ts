import { KeyStatus } from "../game/KeyInput";
import Script from "./Script";

export default class SequentialScriptRunner {
    private queue: (() => Script)[];
    private currentScript: Script | undefined;

    constructor() {
        this.queue = new Array();
    }

    public push(scriptBuilder: () => Script): void {
        this.queue.push(scriptBuilder);
    }

    public update(keyStatus: KeyStatus): void {
        if (this.currentScript) {
            this.currentScript.update(keyStatus);
            if (this.currentScript.finished) this.currentScript = undefined;
        } else {
            this.currentScript = this.queue.shift()?.();
        }
    }
}
