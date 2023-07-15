import { el, mount, unmount, setStyle } from 'redom';

import styles from './styles';

import Story from './components/Story';
import Scene from './components/Scene';

import { getCurrentScene } from './reporters/sceneReporter';
import { getCurrentDuration, getCurrentTime } from './reporters/videoReporter';
import {
	broadcastDirectorPause,
	broadcastDirectorPlay
} from './services/radioService/broadcast';
import { RadioChannel } from './services/radioService/channels';
import { ScriptedStory } from './types/scriptedStory';

import { VERSION } from './version';
import { listenToDirectorSceneEvent } from './services/radioService/listenTo';

export default class LoomSE {
	public el: HTMLElement;
	public version = VERSION;
	public v = VERSION;

	private story: Story | null = null;
	private scene: Scene | null = null;

	constructor(root: HTMLElement, { width = '100%', height = '100%' }) {
		this.el = el('div', {
			style: {
				...styles,
				width: `${width}`,
				height: `${height}`
			}
		});

		mount(root, this.el);

		this.setupSyntheticEvents();
	}

	// Here we relay internal messages from the radioService to the "outside" world via custom events
	private setupSyntheticEvents() {
		listenToDirectorSceneEvent((message) => {
			this.el.dispatchEvent(
				new CustomEvent(RadioChannel.DIRECTOR_SCENE_EVENT, {
					detail: message
				})
			);
		});
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
		return getCurrentDuration();
	}

	currentTime(): number {
		return getCurrentTime();
	}

	currentScene(): string {
		return getCurrentScene();
	}

	startScript(json: object) {
		try {
			this.setStory(json as ScriptedStory);
			this.loadScene((json as ScriptedStory).firstScene);

			return Promise.resolve();
		} catch (error) {
			return Promise.reject(`Unable to load story object, ${error}`);
		}
	}

	pause() {
		broadcastDirectorPause();
	}

	play() {
		broadcastDirectorPlay();
	}

	reloadScene() {
		if (this.scene?.sceneId) {
			this.loadScene(this.scene?.sceneId);
		}
	}

	resize(width: number, height: number) {
		setStyle(this.el, { width: `${width}`, height: `${height}` });
	}

	skipTo(sceneName: string) {
		this.loadScene(sceneName);
	}
}
