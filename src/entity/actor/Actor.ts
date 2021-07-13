import Environment from "../../game/Environment";
import Entity, { Position } from "../Entity";

export default abstract class Actor extends Entity {
    public position: Position;
    public radius: number;

    constructor(position: Position, radius: number) {
        super();

        this.position = position;
        this.radius = radius;
    }

    public render(context: CanvasRenderingContext2D): void {
        if (Environment.DEBUG) this.renderBoundingCircle(context);
    }

    public isCollide(they: Actor): boolean {
        const xDiff = this.position.left - they.position.left;
        const yDiff = this.position.top - they.position.top;

        return (Math.pow(xDiff, 2) + Math.pow(yDiff, 2) <=
                Math.pow(this.radius + they.radius, 2));
    }

    private renderBoundingCircle(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.position.left, this.position.top);

        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(
                0, 0, this.radius,
                0, Math.PI * 2);
        context.stroke();

        context.restore();
    }
}
