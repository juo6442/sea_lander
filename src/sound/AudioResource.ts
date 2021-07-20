export default abstract class AudioResource {
    public static context: AudioContext =
            new (window.AudioContext || (<any>window).webkitAudioContext)();

    public abstract play(): void;
    public abstract stop(): void;

    /**
     * Enables Safari's audio auto-play for its context.
     * Need be called by a user interection.
     */
    public static enableAutoPlay(): void {
        const emptyAudio = new AudioResource.Builder()
                .setBuffer(AudioResource.context.createBuffer(1, 1, 8000))
                .build();
        emptyAudio.play();
        emptyAudio.stop();
    }

    static Builder = class Builder {
        private buffer: AudioBuffer | undefined;
        private loop: boolean | undefined;

        public build(): AudioResource {
            return this.buffer ?
                    new AudioResourceImpl(this.buffer, this.loop ?? false) :
                    new EmptyAudioResource();
        }

        public setBuffer(buffer: AudioBuffer | undefined): Builder {
            this.buffer = buffer;
            return this;
        }

        public setLoop(loop: boolean): Builder {
            this.loop = loop;
            return this;
        }
    }
}

class AudioResourceImpl extends AudioResource {
    private readonly buffer: AudioBuffer;
    private readonly loop: boolean;

    private node: AudioBufferSourceNode | undefined;
    private playing: boolean;

    constructor(buffer: AudioBuffer, loop: boolean) {
        super();

        this.buffer = buffer;
        this.loop = loop;
        this.playing = false;
    }

    public play(): void {
        if (this.playing) return;
        this.playing = true;

        this.node = this.createNode(this.buffer);
        this.node.loop = this.loop;
        this.node.start();
    }

    public stop(): void {
        if (!this.node) return;
        if (!this.playing) return;
        this.playing = false;

        this.node.stop();
    }

    private createNode(buffer: AudioBuffer): AudioBufferSourceNode {
        const node = AudioResource.context.createBufferSource();
        node.buffer = buffer;
        node.connect(AudioResource.context.destination);
        return node;
    }
}

class EmptyAudioResource extends AudioResource {
    public play(): void {}
    public stop(): void {}
}
