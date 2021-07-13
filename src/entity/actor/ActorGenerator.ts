import Environment from "../../game/Environment";
import NumberUtil from "../../util/NumberUtil";
import { Position } from "../Entity";
import { InGameListener } from "../scene/InGameScene";
import EnemyHead from "./EnemyHead";
import SeaBody, { BodyType } from "./SeaBody";
import SeaHead from "./SeaHead";

export default class ActorGenerator {
    private readonly level: number;

    constructor(level: number) {
        this.level = level;
    }

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        const results: EnemyHead[] = new Array();
        results.push(new EnemyHead(new Position(500, 500), new Position(3, -2), seaHead, listener));
        return results;
    }

    public createBodys(seaHead: SeaHead, listener: InGameListener): SeaBody[] {
        const results: SeaBody[] = new Array();
        results.push(new SeaBody(
                new Position(
                    NumberUtil.randomInt(190, Environment.VIEWPORT_WIDTH - 150),
                    Environment.VIEWPORT_HEIGHT - 100),
                BodyType.SEA,
                seaHead,
                listener));
        return results;
    }
}
