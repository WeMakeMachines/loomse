import { el, mount, unmount } from 'redom';

import Story from './components/Story';
import Scene from './components/Scene';
import Plugin, { PluginProps } from './components/Plugin';
import {
	broadcastDirectorPause,
	broadcastDirectorPlay
} from './services/radioService/broadcasters';
import { StoryEvent, StoryType } from './types/StoryType';
import { reporterService, scriptedEventService } from './services';
import { VERSION } from './version';
import { inject, injectable, singleton } from 'tsyringe';

class LoomseError extends Error {}

@injectable()
@singleton()
export default class Loomse {
	public el: HTMLElement;
	public version = VERSION;
	public scene: Scene | null = null;

	private story: StoryType | null = null;

	constructor(
		@inject('root') root: HTMLElement,
		@inject('json') json: object
	) {
		this.el = el('div.loomse__root');

		mount(root, this.el);

		try {
			this.setStory(json as StoryType);
			this.loadScene((json as StoryType).firstScene);
		} catch (error) {
			throw new LoomseError(`Unable to load story object, ${error}`);
		}
	}

	private setStory(storyObject: StoryType) {
		this.story = new Story(storyObject);
	}

	private loadScene(sceneName: string) {
		if (!this.story) return;

		if (!sceneName || !this.story.scenes[sceneName]) {
			throw new LoomseError(
				`Scene "${sceneName}" does not exist in script`
			);
		}

		if (this.scene) {
			unmount(this.el, this.scene);
		}

		this.scene = new Scene(sceneName, this.story.scenes[sceneName]);

		mount(this.el, this.scene);
	}

	currentDuration(): number {
		return reporterService.getCurrentDuration();
	}

	currentTime(): number {
		return reporterService.getCurrentTime();
	}

	currentScene(): string {
		return reporterService.getCurrentScene();
	}

	currentEvents(): StoryEvent[] {
		return scriptedEventService.events;
	}

	pause() {
		broadcastDirectorPause();
	}

	play() {
		broadcastDirectorPlay();
	}

	registerPlugin(pluginProps: PluginProps): void {
		Plugin.registerPlugin(pluginProps);
	}

	reloadScene() {
		if (this.scene?.sceneName) {
			this.loadScene(this.scene?.sceneName);
		}
	}

	skipTo(sceneName: string) {
		this.loadScene(sceneName);
	}
}
