import { el, mount, unmount, setStyle } from 'redom';

import Story from './components/Story';
import Scene from './components/Scene';
import Plugin, { PluginProps } from './components/Plugin';
import {
	broadcastDirectorPause,
	broadcastDirectorPlay
} from './services/radioService/broadcasters';
import { ScriptedEvent, ScriptedStory } from './types/scriptedStory';
import { reporterService, scriptedEventService } from './services';
import styles from './styles';
import { VERSION } from './version';

class LoomseError extends Error {}

export default class Loomse {
	public el: HTMLElement;
	public version = VERSION;
	public scene: Scene | null = null;

	private story: Story | null = null;
	private static instance: Loomse;

	public static getInstance(root: HTMLElement, json: object) {
		if (!Loomse.instance) {
			Loomse.instance = new Loomse(root, json);
		} else {
			console.warn('Story can only be set once');
		}

		return Loomse.instance;
	}

	private constructor(root: HTMLElement, json: object) {
		this.el = el('div', {
			style: {
				...styles,
				width: '100%',
				height: '100%'
			}
		});

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

	resize(width: number, height: number) {
		setStyle(this.el, { width: `${width}`, height: `${height}` });
	}

	skipTo(sceneName: string) {
		this.loadScene(sceneName);
	}
}
