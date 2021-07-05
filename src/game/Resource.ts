import Logger from "../util/Logger";

const RES_DIR = "../../res/";

export class Resource {
    protected images: Map<string, HTMLImageElement>;
    protected audios: Map<string, HTMLAudioElement>;

    constructor() {
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
    public getAudio(id: string): HTMLAudioElement | undefined {
        return this.getResource(id, this.audios);
    }

    private getResource<T>(id: string, container: Map<string, T>): T | undefined {
        const res = container.get(id);
        if (!res) Logger.error(id + " not found");
        return res;
    }
}

class SettableResource extends Resource {
    /**
     * Adds resource
     * @param id - ID of resource
     * @param res - Resource object
     */
    public setImage(id: string, res: HTMLImageElement): void {
        this.images.set(id, res);
    }

    /**
     * Adds resource
     * @param id - ID of resource
     * @param res - Resource object
     */
    public setAudio(id: string, res: HTMLAudioElement): void {
        this.audios.set(id, res);
    }
}

export class ResourceLoader {
    private resourcesToLoad: Promise<void>[];
    private resource: SettableResource;

    constructor() {
        this.resourcesToLoad = new Array();
        this.resource = new SettableResource();
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
    public async load() {
        await Promise.all(this.resourcesToLoad);
        return this.resource;
    }

    /**
     * Add image resource to load.
     * @param id - Resource ID
     * @param src - File path in the resource directory
     * @returns this for chaining
     */
    public setImage(id: string, src: string): ResourceLoader {
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
    public setAudio(id: string, src: string): ResourceLoader {
        this.resourcesToLoad.push(new Promise(
            resolve => {
                const audio = new Audio(RES_DIR + src);
                audio.oncanplaythrough = () => {
                    this.resource.setAudio(id, audio);
                    resolve();
                };
                audio.onerror = () => {
                    Logger.error("Audio load error: " + src);
                    resolve();
                };
                audio.load();
            }));
        return this;
    };

    /**
     * Add font resource to load. It should be pre-defined in CSS as `@font-face`
     * @param font - Font name
     * @returns this for chaining
     */
    public setFont(font: string): ResourceLoader {
        const anySize = "12pt";
        // CSS Font Loading API is experimental now so not supported in TS
        this.resourcesToLoad.push(
                (document as any).fonts.load(`${anySize} ${font}`) as Promise<any>);
        return this;
    };
}
