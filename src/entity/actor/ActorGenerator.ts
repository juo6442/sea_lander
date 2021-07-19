import Environment from "../../game/Environment";
import { Position } from "../Entity";
import { InGameListener } from "../scene/InGameScene";
import EnemyHead, { HeadType } from "./EnemyHead";
import SeaBody, { BodyType } from "./SeaBody";
import SeaHead from "./SeaHead";

export default class ActorGenerator {
    public static LEVEL_MAX = 10;

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
            case 1:  return new Level1ActorGenerator();
            case 2:  return new Level2ActorGenerator();
            case 3:  return new Level3ActorGenerator();
            case 4:  return new Level4ActorGenerator();
            case 5:  return new Level5ActorGenerator();
            case 6:  return new Level6ActorGenerator();
            case 7:  return new Level7ActorGenerator();
            case 8:  return new Level8ActorGenerator();
            case 9:  return new Level9ActorGenerator();
            case 10: return new Level10ActorGenerator();
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
                i <= Environment.VIEWPORT_WIDTH - BaseActorGenerator.HORIZONTAL_SEGMENT_LENGTH;
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
    protected override BODYS = [BodyType.SEA, BodyType.VON];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(1500, 1000), HeadType.VON, seaHead, listener),
        );
    }
}

class Level3ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(1700, 200), HeadType.VON, seaHead, listener),
            new EnemyHead(new Position(900, 1100), HeadType.FEEL, seaHead, listener),
        );
    }
}

class Level4ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(300, 1300), HeadType.FEEL, seaHead, listener),
            new EnemyHead(new Position(700, 700), HeadType.VON, seaHead, listener),
            new EnemyHead(new Position(1600, 500), HeadType.GI, seaHead, listener),
        );
    }
}

class Level5ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.GI];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(300, 1300), HeadType.FEEL, seaHead, listener),
            new EnemyHead(new Position(1800, 700), HeadType.GI, seaHead, listener),
        );
    }
}

class Level6ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.VON];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(1600, 1300), HeadType.VON, seaHead, listener),
            new EnemyHead(new Position(200, 1200), HeadType.EDITOR, seaHead, listener),
        );
    }
}

class Level7ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.VON, BodyType.GI];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(200, 600), HeadType.FEEL, seaHead, listener),
            new EnemyHead(new Position(900, 700), HeadType.VON, seaHead, listener),
            new EnemyHead(new Position(1600, 1100), HeadType.EDITOR, seaHead, listener),
        );
    }
}

class Level8ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.GI];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(1800, 300), HeadType.VON, seaHead, listener),
            new EnemyHead(new Position(900, 1200), HeadType.EDITOR, seaHead, listener),
            new EnemyHead(new Position(400, 1300), HeadType.GI, seaHead, listener),
        );
    }
}

class Level9ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.VON, BodyType.GI];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(1000, 800), HeadType.FEEL, seaHead, listener),
            new EnemyHead(new Position(1900, 700), HeadType.EDITOR, seaHead, listener),
            new EnemyHead(new Position(100, 700), HeadType.GI, seaHead, listener),
        );
    }
}

class Level10ActorGenerator extends BaseActorGenerator {
    protected override BODYS = [BodyType.SEA, BodyType.FEEL, BodyType.VON, BodyType.GI];

    public createEnemyHeads(seaHead: SeaHead, listener: InGameListener): EnemyHead[] {
        return new Array(
            new EnemyHead(new Position(400, 400), HeadType.FEEL, seaHead, listener),
            new EnemyHead(new Position(700, 400), HeadType.VON, seaHead, listener),
            new EnemyHead(new Position(400, 1100), HeadType.GI, seaHead, listener),
            new EnemyHead(new Position(1650, 1200), HeadType.EDITOR, seaHead, listener),
        );
    }
}
