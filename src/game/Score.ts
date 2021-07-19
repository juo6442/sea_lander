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
        this.positionScore = Math.floor(Math.pow(2, -Math.abs(positionDiff / 15)) * 500);
        this.angleScore = Math.floor(Math.pow(2, -Math.abs(angle * 5)) * 500);

        Logger.log("Score calculated");
        Logger.log(`- fuel: ${fuel} -> ${this.fuelScore}`);
        Logger.log(`- position: ${positionDiff} -> ${this.positionScore}`);
        Logger.log(`- angle: ${angle} -> ${this.angleScore}`);
    }

    get totalScore(): number {
        return this.fuelScore + this.positionScore + this.angleScore;
    }
}

export class Score {
    public static readonly COUNT = 5;

    private static readonly KEY = "scores";

    /**
     * Get score list from the storage. Length is `Score.COUNT`.
     * @returns Sorted array of score
     */
    public static getScores(): number[] {
        const scores = this.load();
        return scores.concat(new Array(Score.COUNT - scores.length).fill(0));
    }

    /**
     * Add score and save to the storage.
     * @param score - Score to add
     */
    public static setScore(score: number): void {
        const scores = Score.load();
        scores.push(score);

        const sortedScores = scores.sort((a, b) => b - a);
        Score.save(sortedScores.slice(0, Score.COUNT));
    }

    /**
     * Remove score from the storage. Test purpose.
     */
    public static clear(): void{
        localStorage.removeItem(Score.KEY);
    }

    private static save(scores: number[]): void {
        const jsonScores = JSON.stringify(scores);
        Logger.log("Save: " + jsonScores);

        localStorage.setItem(Score.KEY, jsonScores);
    }

    private static load(): number[] {
        const jsonScores = localStorage.getItem(Score.KEY);
        Logger.log("Load: " + jsonScores);

        if (!jsonScores) return new Array(0);
        return JSON.parse(jsonScores);
    }
}
