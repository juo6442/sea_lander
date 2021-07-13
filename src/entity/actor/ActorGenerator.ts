import Environment from "../../game/Environment";
import { Position } from "../Entity";
import { InGameListener } from "../scene/InGameScene";
import EnemyHead from "./EnemyHead";
import SeaBody, { BodyType } from "./SeaBody";
import SeaHead from "./SeaHead";

export default class ActorGenerator {
    public static LEVEL_MAX = 4;

    private readonly level: BaseActorGenerator;

    constructor(level: number) {
        this.level = this.getLevel(level);
    }

    /**
     * Create bodies of the level. It contains one real body and fake bodies.
     * @returns Array of bodies
     */
    public createBodies(seaHead: SeaHead, listener: InGameListener): SeaBody[] {
        return this.level.createBodies(seaHead, listener);
    }

    /**
     * Create enemy heads of the level. Positions are pre-defined.
     * @returns Array of heads
     */
    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return this.level.createEnemyHeads(seaHead, listener);
    }

    private getLevel(level: number): BaseActorGenerator {
        switch (level) {
            case 1: return new Level1ActorGenerator();
            case 2: return new Level2ActorGenerator();
            case 3: return new Level3ActorGenerator();
            case 4: return new Level4ActorGenerator();
            default: throw `${level} is not defined`;
        }
    }
}

abstract class BaseActorGenerator {
    private static HORIZONTAL_SEGMENT_LENGTH = 140;
    private static SEA_BODY_TOP = Environment.VIEWPORT_HEIGHT - 100;

    protected abstract BODYS: BodyType[];

    public createBodies(seaHead: SeaHead, listener: InGameListener): SeaBody[] {
        return this.getRandomHorizontalPositions(this.BODYS.length).map((left, i) => {
            return new SeaBody(
                    new Position(left, BaseActorGenerator.SEA_BODY_TOP),
                    this.BODYS[i],
                    seaHead,
                    listener)
        });
    }

    public abstract createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[];

    /**
     * Returns n random position within the screen width.
     * @param n - Numbers to return
     * @returns Array of positions
     */
    protected getRandomHorizontalPositions(n: number): number[] {
        const segments = new Array();
        for (let i = BaseActorGenerator.HORIZONTAL_SEGMENT_LENGTH;
                i < Environment.VIEWPORT_WIDTH - BaseActorGenerator.HORIZONTAL_SEGMENT_LENGTH;
                i += BaseActorGenerator.HORIZONTAL_SEGMENT_LENGTH) {
            segments.push(i);
        }

        const shuffledSegments = segments.sort(() => Math.random() - 0.5);
        return shuffledSegments.slice(0, n);
    }
}

class Level1ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array();
    }
}

class Level2ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array();
    }
}

class Level3ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.VON];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array();
    }
}

class Level4ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.VON, BodyType.GI];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array();
    }
}

/*
FIXME: ref
class Level5ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.VON, BodyType.GI];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(500, 500), new Position(3, -2), seaHead, listener),
        );
    }
}
*/
