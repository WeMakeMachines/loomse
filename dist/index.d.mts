type StopListeningFunction = () => void;
declare const listenToDirectorPause: (handler: () => void) => StopListeningFunction;
declare const listenToDirectorPlay: (handler: () => void) => StopListeningFunction;
declare const listenToDirectorSceneChange: (handler: (sceneId: string) => void) => StopListeningFunction;
declare const listenToDirectorSceneEvent: (handler: (message: any) => void) => StopListeningFunction;
declare const listenToVideoDurationChanged: (handler: (duration: number) => void) => StopListeningFunction;
declare const listenToVideoTimeUpdate: (handler: (time: number) => void) => StopListeningFunction;

declare enum VideoMIME_Type {
    MP4 = "video/mp4",
    OGG = "video/ogg",
    WEBM = "video/webm"
}

declare class Source {
    el: HTMLSourceElement;
    static canPlayMimeType(videoMIME_Type: VideoMIME_Type): boolean;
    static mapFileExtensionToMIME_Type(fileExtension: string): VideoMIME_Type;
    constructor(fileExtension: string, uri: string);
}

interface VideoProps {
    controls?: boolean;
    loop?: {
        in: number;
        out: number;
    } | boolean;
    muted?: boolean;
    sources: {
        [key: string]: string;
    };
    subtitles?: string;
}
declare class Video {
    el: HTMLVideoElement;
    broadcastEndedEvent: () => void;
    broadcastDurationChangeEvent: () => void;
    broadcastPlayingEvent: () => void;
    broadcastPausedEvent: () => void;
    broadcastSeekedEvent: () => void;
    broadcastSeekingEvent: () => void;
    broadcastTimeUpdateEvent: () => void;
    stopListeningToVideoPause: StopListeningFunction;
    stopListeningToVideoPlay: StopListeningFunction;
    sources: {
        [key: string]: Source;
    };
    constructor({ controls, loop, muted, sources, subtitles }: VideoProps);
    onunmount(): void;
    setSources(sources: {
        [key: string]: string;
    }): {
        [key: string]: Source;
    };
    manageSources(callback: (source: Source) => void): void;
    mountSources(): void;
    unmountSources(): void;
    listenToVideoEvents(): void;
    stopListeningToVideoEvents(): void;
    stopListeningToRadio(): void;
    play(): void;
    pause(): void;
    playPause(): void;
}

interface StoryScene {
    longName?: string;
    video: StoryVideo;
    events: StoryEvent[];
}
interface StoryVideo {
    sources: {
        mp4?: string;
        ogg?: string;
        webm?: string;
    };
    autoplay?: boolean;
    controls?: boolean;
    loop?: {
        in: number;
        out: number;
    } | boolean;
    muted?: boolean;
    subtitles?: string;
}
interface StoryEvent {
    pluginName?: string;
    in: number;
    out: number;
    payload?: object;
}

declare class Scene {
    el: HTMLElement;
    sceneName: string;
    video: Video;
    longName: string | undefined;
    constructor(sceneName: string, { events, longName, video }: StoryScene);
    onunmount(): void;
}

interface PluginProps {
    name: string;
    mount?: {
        parentEl: HTMLElement;
        el: HTMLElement;
        onLoad?: boolean;
        persist?: boolean;
    };
    hooks?: {
        run?: (payload?: object) => void;
        cleanup?: () => void;
    };
}

declare class Loomse {
    el: HTMLElement;
    version: string;
    scene: Scene | null;
    private story;
    constructor(root: HTMLElement, json: object);
    private setStory;
    private loadScene;
    currentDuration(): number;
    currentTime(): number;
    currentScene(): string;
    currentEvents(): StoryEvent[];
    pause(): void;
    play(): void;
    registerPlugin(pluginProps: PluginProps): void;
    reloadScene(): void;
    skipTo(sceneName: string): void;
}

type LoomseType = Loomse;
declare function createStory(root: HTMLElement, json: object): LoomseType;

export { LoomseType, createStory, listenToDirectorPause, listenToDirectorPlay, listenToDirectorSceneChange, listenToDirectorSceneEvent, listenToVideoDurationChanged, listenToVideoTimeUpdate };
