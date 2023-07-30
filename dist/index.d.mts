import { Disposable } from 'tsyringe';

type StopListeningFunction = () => void;
declare const listenToDirectorPause: (handler: () => void) => StopListeningFunction;
declare const listenToDirectorPlay: (handler: () => void) => StopListeningFunction;
declare const listenToDirectorSceneChange: (handler: (sceneId: string) => void) => StopListeningFunction;
declare const listenToDirectorSceneEvent: (handler: (message: any) => void) => StopListeningFunction;
declare const listenToVideoDurationChanged: (handler: (duration: number) => void) => StopListeningFunction;
declare const listenToVideoTimeUpdate: (handler: (time: number) => void) => StopListeningFunction;

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
declare class Plugin {
    readonly name: string;
    readonly mount?: {
        onLoad?: boolean;
        persist?: boolean;
        parentEl: HTMLElement;
        el: HTMLElement;
    };
    readonly hooks?: {
        run?: (payload?: object) => void;
        cleanup?: () => void;
    };
    constructor({ name, hooks, mount }: PluginProps);
    unmount(): void;
}

declare class PluginRegistryService {
    private registry;
    registerPlugin(plugin: Plugin): void;
    getPlugin(name: string): Plugin | undefined;
}

/**
 * Listens to and keeps track of scene events
 */
declare class SceneReporter {
    currentScene: string;
    constructor();
    registerListeners(): void;
}

/**
 * Listens to and keeps track of video events
 */
declare class VideoReporter {
    currentDuration: number;
    currentTime: number;
    constructor();
    registerListeners(): void;
}

declare class ReporterService {
    private sceneReporter;
    private videoReporter;
    constructor(sceneReporter: SceneReporter, videoReporter: VideoReporter);
    getCurrentTime(): number;
    getCurrentDuration(): number;
    getCurrentScene(): string;
}

interface StoryScene {
    longName?: string;
    video: SceneVideo;
    events: SceneEvent[];
}
interface SceneVideo {
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
interface SceneEvent {
    pluginName?: string;
    in: number;
    out: number;
    payload?: object;
}

interface TimedObject {
    id: number;
    time: number;
    action: EventAction;
}
declare enum EventAction {
    START = "start",
    STOP = "stop"
}
declare class EventQueue {
    private queueIndex;
    private queue;
    static buildQueueFromScriptedEvents(events: SceneEvent[]): TimedObject[];
    reset(): void;
    setQueue(timedObjects: TimedObject[]): void;
    getQueue(): TimedObject[];
    getCurrentTimedEventId(): number;
    getPendingObject(): TimedObject | undefined;
    advanceQueue(): void;
    sort(type: 'desc' | 'asc'): void;
}

declare abstract class EventService implements Disposable {
    private queue;
    events: SceneEvent[];
    protected stopListeningToRadio: StopListeningFunction;
    protected constructor(queue?: EventQueue);
    protected abstract startEventCallback(scriptedEvent: SceneEvent): void;
    protected abstract stopEventCallback(scriptedEvent: SceneEvent): void;
    private getCurrentlyActionableEvent;
    private actionEvent;
    setEvents(events: SceneEvent[]): void;
    dispose(): void;
}

declare class ScriptedEventService extends EventService {
    private pluginRegistryService;
    constructor(pluginRegistryService: PluginRegistryService);
    protected startEventCallback({ pluginName, payload }: SceneEvent): void;
    protected stopEventCallback({ pluginName, payload }: SceneEvent): void;
}

declare class SubtitleEventService extends EventService {
    constructor();
    protected startEventCallback({ payload }: SceneEvent): void;
    protected stopEventCallback(): void;
}

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
    subtitleEventService: SubtitleEventService;
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
    constructor(subtitleEventService: SubtitleEventService, { controls, loop, muted, sources, subtitles }: VideoProps);
    setSubtitles(subtitlesFilePath: string): Promise<void>;
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
    onunmount(): void;
}

declare class Scene {
    private scriptedEventService;
    el: HTMLElement;
    sceneName: string;
    video: Video;
    longName: string | undefined;
    constructor(scriptedEventService: ScriptedEventService, sceneName: string, { events, longName, video }: StoryScene);
    cleanup(): void;
}

declare class Loomse {
    el: HTMLElement;
    scene: Scene | null;
    private story;
    constructor(root: HTMLElement, json: object);
    private setStory;
    private unloadExistingScene;
    private loadScene;
    pause(): void;
    play(): void;
    reloadScene(): void;
    changeScene(sceneName: string): void;
}

declare class Services extends Loomse {
    pluginRegistryService: PluginRegistryService;
    reporterService: ReporterService;
    scriptedEventService: ScriptedEventService;
    constructor(pluginRegistryService: PluginRegistryService, reporterService: ReporterService, scriptedEventService: ScriptedEventService, root: HTMLElement, json: object);
    currentDuration(): number;
    currentTime(): number;
    currentScene(): string;
    currentEvents(): SceneEvent[];
    registerPlugin(pluginProps: PluginProps): void;
}

type LoomseType = Services;
declare function createStory(root: HTMLElement, json: object): LoomseType;

export { LoomseType, createStory, listenToDirectorPause, listenToDirectorPlay, listenToDirectorSceneChange, listenToDirectorSceneEvent, listenToVideoDurationChanged, listenToVideoTimeUpdate };
