import { Position } from "../entity/Entity";
import Script, { EntityWithColor, EntityWithPosition } from "./Script";

export namespace CommonScript {
    export class Wait extends Script {
        private remainDuration: number;

        /**
         * Waits some duration.
         * @param duration - Duration in frame
         */
        constructor(duration: number) {
            super();

            this.remainDuration = duration;
        }

        update() {
            if (--this.remainDuration < 0) this.finish();
        }
    }

    export class Run extends Script {
        private functionToRun: () => void;

        /**
         * Runs a function once.
         * @param functionToRun - Function
         */
        constructor(functionToRun: () => void) {
            super();

            this.functionToRun = functionToRun;
        }

        update() {
            this.functionToRun();
            this.finish();
        }
    }

    export class Fade extends Script {
        private entity: EntityWithColor;
        private endAlpha: number;
        private deltaAlpha: number;
        private remainDuration: number;

        /**
         * Gradually changes an entity's alpha.
         * @param entity - Entity to manipulate
         * @param endAlpha - Target alpha
         * @param duration - Duration in frame
         */
        constructor(entity: EntityWithColor, endAlpha: number, duration: number) {
            super();

            this.entity = entity;
            this.endAlpha = endAlpha;
            this.remainDuration = duration;

            this.deltaAlpha = (endAlpha - entity.color.a) / duration;
        }

        update() {
            if (--this.remainDuration < 0) {
                this.entity.color.a = this.endAlpha;
                this.finish();
            } else {
                this.entity.color.a += this.deltaAlpha;
            }
        }
    }

    export class Transition extends Script {
        private entity: EntityWithPosition;
        private targetPosition: Position;
        private remainDuration: number;

        private dx: number;
        private dy: number;

        /**
         * Gradually move an entity.
         * @param entity - Entity to manipulate
         * @param targetLeft - Target left position
         * @param targetTop - Target top position
         * @param duration - Duration in frame
         */
        constructor(entity: EntityWithPosition,
                targetLeft: number, targetTop: number, duration: number) {
            super();

            this.entity = entity;
            this.targetPosition = new Position(targetLeft, targetTop);
            this.remainDuration = duration;

            this.dx = (targetLeft - entity.position.left) / duration;
            this.dy = (targetTop - entity.position.top) / duration;
        }

        update() {
            if (--this.remainDuration < 0) {
                this.entity.position = this.targetPosition;
                this.finish();
            } else {
                this.entity.position.left += this.dx;
                this.entity.position.top += this.dy;
            }
        }
    }

    export class WaveTransition extends Script {
        static readonly LOOP_INFINITE = -1;

        private entity: EntityWithPosition;
        private xAmplitude: number;
        private yAmplitude: number;
        private cycle: number;
        private remainLoop: number;

        private initialPosition: Position;
        private remainCurrentCycle: number;

        /**
         * Shake an entity.
         * @param entity - Entity to manipulate
         * @param xAmplitude - X axis amplitude
         * @param yAmplitude - Y axis amplitude
         * @param cycle - Duration of each cycle in frame
         * @param loop - Loop count, infinite if LOOP_INFINITE
         */
        constructor(entity: EntityWithPosition,
                xAmplitude: number, yAmplitude: number, cycle: number, loop: number) {
            super(loop === -1);

            this.entity = entity;
            this.xAmplitude = xAmplitude;
            this.yAmplitude = yAmplitude;
            this.cycle = cycle;
            this.remainLoop = loop;

            this.remainCurrentCycle = cycle;
            this.initialPosition = new Position(entity.position.left, entity.position.top);
        }

        update() {
            this.remainCurrentCycle--;

            if (this.remainCurrentCycle < 0) {
                this.onThisCycleFinished();
            } else {
                const sinValue = Math.sin(this.remainCurrentCycle / this.cycle * Math.PI * 2);
                this.entity.position.left = this.initialPosition.left + (sinValue * this.xAmplitude);
                this.entity.position.top = this.initialPosition.top + (sinValue * this.yAmplitude);
            }
        }

        private onThisCycleFinished() {
            this.remainCurrentCycle = this.cycle;

            if (this.remainLoop === WaveTransition.LOOP_INFINITE) return;
            if (--this.remainLoop <= 0) {
                this.entity.position = this.initialPosition;
                this.finish();
            }
        }
    }

    export class Blink extends Script {
        private entity: EntityWithColor;
        private duration: number;

        private remainDuration: number;
        private initialAlpha: number;

        /**
         * Blink an entity. Infinitely runs.
         * @param entity - Entity to manipulate
         * @param duration - Show/hide duration in frame
         */
        constructor(entity: EntityWithColor, duration: number) {
            super(true);

            this.entity = entity;
            this.duration = duration;

            this.remainDuration = duration;
            this.initialAlpha = this.entity.color.a;
        }

        update() {
            if (--this.remainDuration < 0) {
                this.remainDuration = this.duration;
                this.entity.color.a =
                        (this.entity.color.a === 0) ? this.initialAlpha : 0;
            }
        }
    }
}
