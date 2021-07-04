import Environment from "../game/Environment";

const noOp = () => {};

export default {
    log: Environment.DEBUG ? console.log : noOp,
    info: console.info,
    warn: console.warn,
    error: console.error,
    dir: Environment.DEBUG ? console.dir : noOp,
    time: Environment.DEBUG ? console.time : noOp,
    timeEnd: Environment.DEBUG ? console.timeEnd : noOp,
}
