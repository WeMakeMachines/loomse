export declare class LoomSE {
	el: HTMLElement;
	version: string;
	v: string;
	constructor(
		root: HTMLElement,
		{
			width,
			height
		}: {
			width?: string | undefined;
			height?: string | undefined;
		}
	);
	currentDuration(): number;
	currentTime(): number;
	startScript(json: object): Promise<void>;
	pause(): void;
	play(): void;
	registerPlugin(pluginProps: PluginProps): void;
	reloadScene(): void;
	resize(width: number, height: number): void;
	skipTo(sceneName: string): void;
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
		run?: () => void;
		cleanup?: () => void;
	};
}

type StopListeningFunction = () => void;

export declare const listenToDirectorPause: (
	handler: () => void
) => StopListeningFunction;
export declare const listenToDirectorPlay: (
	handler: () => void
) => StopListeningFunction;
export declare const listenToDirectorSceneChange: (
	handler: (sceneId: string) => void
) => StopListeningFunction;
export declare const listenToDirectorSceneEvent: (
	handler: (message: any) => void
) => StopListeningFunction;
export declare const listenToVideoDurationChanged: (
	handler: (duration: number) => void
) => StopListeningFunction;
export declare const listenToVideoTimeUpdate: (
	handler: (time: number) => void
) => StopListeningFunction;
