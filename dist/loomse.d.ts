export default class LoomSE {
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
	startScript(json: {}): Promise<void>;
	pause(): void;
	play(): void;
	reloadScene(): void;
	resize(width: number, height: number): void;
	skipTo(sceneName: string): void;
}
