import AudioResource from "../sound/AudioResource";
import Logger from "../util/Logger";

const RES_DIR = `${window.location.href}/res/`;

export default class Resource {
    public static global: Resource | undefined;

    private images: Map<string, HTMLImageElement>;
    private audios: Map<string, AudioBuffer>;

    private constructor() {
        this.images = new Map();
        this.audios = new Map();
    }

    /**
     * Returns image of given ID.
     * @param id - ID of image
     * @returns Image, or undefined if given ID is not exists
     */
    public getImage(id: string): HTMLImageElement | undefined {
        return this.getResource(id, this.images);
    }

    /**
     * Returns audio of given ID.
     * @param id - ID of audio
     * @returns Audio, or undefined if given ID is not exists
     */
    public getAudio(id: string): AudioBuffer | undefined {
        return this.getResource(id, this.audios);
    }

    private getResource<T>(id: string, container: Map<string, T>): T | undefined {
        const res = container.get(id);
        if (!res) Logger.error(id + " not found");
        return res;
    }

    private setImage(id: string, res: HTMLImageElement): void {
        this.images.set(id, res);
    }

    private setAudio(id: string, res: AudioBuffer): void {
        this.audios.set(id, res);
    }

    static Loader = class Loader {
        private resourcesToLoad: Promise<void>[];
        private resource: Resource;

        constructor() {
            this.resourcesToLoad = new Array();
            this.resource = new Resource();
        }

        /**
         * Loads all resources that have set.
         * @example
         * Here's the example that loads some resources.
         * ```
         * new ResourceLoader()
         *     .setFont("")
         *     .setImage("", "")
         *     .load().then(resource => {
         *         // Do something nice
         *     }
         * );
         * ```
         * @returns Resource object contains loaded resources
         */
        public async load(): Promise<Resource> {
            await Promise.all(this.resourcesToLoad);
            return this.resource;
        }

        /**
         * Add image resource to load.
         * @param id - Resource ID
         * @param src - File path in the resource directory
         * @returns this for chaining
         */
        public setImage(id: string, src: string): Loader {
            this.resourcesToLoad.push(new Promise(
                resolve => {
                    const image = new Image();
                    image.onload = () => {
                        this.resource.setImage(id, image);
                        resolve();
                    };
                    image.onerror = () => {
                        Logger.error("Image load error: " + src);
                        resolve();
                    };
                    image.src = RES_DIR + src;
                }));
            return this;
        }

        /**
         * Add audio resource to load.
         * @param id - Resource ID
         * @param src - File path in the resource directory
         * @returns this for chaining
         */
        public setAudio(id: string, src: string): Loader {
            this.resourcesToLoad.push(new Promise(
                resolve => {
                    fetch(RES_DIR + src)
                            .then(response => response.arrayBuffer())
                            .then(buffer => AudioResource.context.decodeAudioData(buffer))
                            .then(buffer => {
                                this.resource.setAudio(id, buffer);
                                resolve();
                            })
                            .catch(() => {
                                Logger.error("Audio load error: " + src)
                                resolve();
                            });
                }));
            return this;
        };

        /**
         * Add font resource to load. It should be pre-defined in CSS as `@font-face`
         * @param font - Font name
         * @returns this for chaining
         */
        public setFont(font: string): Loader {
            const anySize = "12pt";
            // CSS Font Loading API is experimental now so not supported in TS
            this.resourcesToLoad.push(
                    (document as any).fonts.load(`${anySize} ${font}`) as Promise<any>);
            return this;
        };
    }
}
