export default class PlayerStatus {
    public static readonly LIFE_FULL = 3;
    public static readonly FUEL_FULL = 10000;

    public level: number;
    public life: number;
    public fuel: number;

    constructor() {
        this.level = 1;
        this.life = PlayerStatus.LIFE_FULL;
        this.fuel = PlayerStatus.FUEL_FULL;
    }
}
