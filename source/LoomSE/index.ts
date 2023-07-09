import { el, mount, unmount, setStyle } from 'redom';

import styles from './styles';

import Story from './Components/Story';
import Scene from './Components/Scene';

import { radioService } from './services/radioService';
import { getCurrentDuration, getCurrentTime } from './reporters/videoReporter';

import { DirectorEvent } from './types/media';

export default class LoomSE {
	public el: HTMLElement;
	public story: Story | null = null;
	public scene: Scene | null = null;

	constructor({ width = '100%', height = '100%' }) {
		this.el = el('', {
			style: {
				...styles,
				width: `${width}`,
				height: `${height}`
			}
		});

		this.setupSyntheticEvents();
	}

	currentDuration() {
		return getCurrentDuration();
	}

	currentTime() {
		return getCurrentTime();
	}

	setStory(storyObject: Story) {
		this.story = new Story(storyObject);
	}

	loadScene(sceneName: string) {
		if (!this.story) return;

		if (this.scene) {
			unmount(this.el, this.scene);
		}

		this.scene = new Scene(sceneName, this.story.scenes[sceneName]);

		mount(this.el, this.scene);
	}

	pause() {
		radioService.broadcast(DirectorEvent.PAUSE);
	}

	play() {
		radioService.broadcast(DirectorEvent.PLAY);
	}

	resize(width: number, height: number) {
		setStyle(this.el, { width: `${width}`, height: `${height}` });
	}

	// Here we relay internal messages from the radioService to the "outside" world via custom events
	setupSyntheticEvents() {
		radioService.register(
			DirectorEvent.SCENE_EVENT,
			(message) => {
				this.el.dispatchEvent(
					new CustomEvent(DirectorEvent.SCENE_EVENT, {
						detail: message
					})
				);
			},
			this
		);
	}
}
