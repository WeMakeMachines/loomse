export default function loomse(
	el: HTMLElement,
	config?: {
		width?: string;
		height?: string;
	}
): {
	currentDuration(): number;
	currentTime(): number;
	el: HTMLElement;
	startScript(json: {}): Promise<void>;
	pause(): void;
	play(): void;
	reloadScene(): void;
	resize(width: number, height: number): void;
	skipTo(sceneName: string): void;
	version: string;
	v: string;
};
