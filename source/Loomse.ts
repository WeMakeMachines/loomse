import { el, mount, unmount } from 'redom';

import Story from './components/Story';
import Scene from './components/Scene';
import Plugin, { PluginProps } from './components/Plugin';
import {
	broadcastDirectorPause,
	broadcastDirectorPlay
} from './services/radioService/broadcasters';
import { ScriptedEvent, ScriptedStory } from './types/scriptedStory';
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

	private story: Story | null = null;

	constructor(
		@inject('root') root: HTMLElement,
		@inject('json') json: object
	) {
		this.el = el('div.loomse__root');

		mount(root, this.el);

		try {
			this.setStory(json as ScriptedStory);
			this.loadScene((json as ScriptedStory).firstScene);
		} catch (error) {
			throw new LoomseError(`Unable to load story object, ${error}`);
		}
	}

	private setStory(storyObject: Story) {
		this.story = new Story(storyObject);
	}

	private loadScene(sceneName: string) {
		if (!this.story) return;

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

	currentEvents(): ScriptedEvent[] {
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
