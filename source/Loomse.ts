import { el, mount, unmount } from 'redom';
import { container, singleton } from 'tsyringe';

import {
	broadcastDirectorPause,
	broadcastDirectorPlay
} from './services/radioService/broadcasters';
import Story from './components/Story';
import Scene from './components/Scene';
import { StoryType } from './types/StoryType';
import ScriptedEventService from './services/scriptedEventService';

class LoomseError extends Error {}

@singleton()
export default class Loomse {
	public el: HTMLElement;
	public scene: Scene | null = null;
	private story: StoryType | null = null;

	constructor(root: HTMLElement, json: object) {
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

	private unloadExistingScene() {
		if (this.scene) {
			this.scene.cleanup();
			unmount(this.el, this.scene);
		}
	}

	private loadScene(sceneName: string) {
		if (!this.story) {
			throw new LoomseError('No story loaded');
		}

		const newScene = this.story.scenes[sceneName];

		if (!newScene) {
			throw new LoomseError(
				`Scene "${sceneName}" does not exist in script`
			);
		}

		this.scene = new Scene(
			container.resolve(ScriptedEventService),
			sceneName,
			newScene
		);

		mount(this.el, this.scene);
	}

	pause() {
		broadcastDirectorPause();
	}

	play() {
		broadcastDirectorPlay();
	}

	reloadScene() {
		this.unloadExistingScene();

		if (this.scene?.sceneName) {
			this.loadScene(this.scene?.sceneName);
		}
	}

	changeScene(sceneName: string) {
		this.unloadExistingScene();
		this.loadScene(sceneName);
	}
}
