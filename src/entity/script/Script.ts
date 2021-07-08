import Entity from "../Entity";

export default abstract class Script extends Entity {
    private onFinish: (() => void) | undefined;

    constructor(onFinish?: () => void) {
        super();

        this.onFinish = onFinish;
    }

    public render(context: CanvasRenderingContext2D): void {
    }

    /**
     * Call `this.onFinish()` if exists and invalidate this script.
     * Its entity manager will remove it since it's invalidated.
     */
    protected finish(): void {
        if (this.onFinish) this.onFinish();
        this.invalidate();
    }
}
