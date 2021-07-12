import Logger from "../util/Logger";

export class ScoreCalculator {
    public fuelScore: number;
    public positionScore: number;
    public angleScore: number;

    constructor(
            fuel: number,
            positionDiff: number,
            angle: number) {
        this.fuelScore = fuel;
        this.positionScore = Math.floor(Math.pow(2, -Math.abs(positionDiff / 10)) * 500);
        this.angleScore = Math.floor(Math.pow(2, -angle) * 500);

        Logger.log("Score calculated");
        Logger.log(`- fuel: ${fuel} -> ${this.fuelScore}`);
        Logger.log(`- position: ${positionDiff} -> ${this.positionScore}`);
        Logger.log(`- angle: ${angle} -> ${this.angleScore}`);
    }

    get totalScore(): number {
        return this.fuelScore + this.positionScore + this.angleScore;
    }
}
