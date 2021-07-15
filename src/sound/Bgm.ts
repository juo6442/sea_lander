export default class Bgm {
    public static readonly VOLUME_DEFAULT = 0.25;
    public static readonly VOLUME_INGAME = 0.2;
    public static readonly VOLUME_QUIET = 0.05;

    private static instance: Bgm;

    private readonly context: AudioContext;
    private readonly gainNode: GainNode;

    private node: AudioBufferSourceNode | undefined;
    private playing: boolean;

    private constructor() {
        this.context = new (window.AudioContext || (<any>window).webkitAudioContext)();
        this.gainNode = this.context.createGain();
        this.gainNode.gain.setValueAtTime(1, 0);

        this.playing = false;
    }

    set volume(value: number) {
        this.gainNode.gain.setValueAtTime(value, 0);
    }

    /**
     * Get a Bgm instance.
     * @returns Singleton instance
     */
    public static getInstance(): Bgm {
        if (!this.instance) this.instance = new Bgm();
        return this.instance
    }

    /**
     * Play the audio loop.
     * @param audio - Audio buffer to play
     * @param volume - Volume (0 ~ 1)
     */
    public play(audio: AudioBuffer | undefined, volume?: number): void {
        if (!audio) return;
        if (this.playing) return;
        this.playing = true;

        this.volume = volume ?? Bgm.VOLUME_DEFAULT;

        this.node = this.context.createBufferSource();
        this.node.buffer = audio;

        this.node.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);

        this.node.loop = true;
        this.node.start();
    }

    /**
     * Stop the audio. No resume.
     */
    public stop(): void {
        if (!this.node) return;
        if (!this.playing) return;
        this.playing = false;

        this.node.stop();
    }

    /**
     * Change volume using exponential ramp.
     * @param volume - Target volume (0 ~ 1)
     * @param durationSeconds - Change duration in second
     */
    public fadeVolume(volume: number, durationSeconds: number): void {
        this.gainNode.gain.exponentialRampToValueAtTime(
                volume,
                this.context.currentTime + durationSeconds);
    }
}
