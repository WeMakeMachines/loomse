import { el, mount, unmount, setStyle } from 'redom';

import styles from './styles';

import Story from './Components/Story';
import Scene from './Components/Scene';

import { radioService } from './services';
import { getCurrentDuration, getCurrentTime } from './reporters';

import {
	DIRECTOR_PAUSE,
	DIRECTOR_PLAY,
	DIRECTOR_SCENE_EVENT
} from './constants/directorEvents';

class LoomSE {
	constructor({ width = '100%', height = '100%' }) {
		this.el = el('', {
			style: {
				...styles,
				width: `${width}`,
				height: `${height}`
			}
		});

		this.story = {};
		this.scene = null;

		this.setupSyntheticEvents();
	}

	currentDuration() {
		return getCurrentDuration();
	}

	currentTime() {
		return getCurrentTime();
	}

	setStory(storyObject) {
		this.story = new Story(storyObject);
	}

	loadScene(string) {
		if (this.scene) {
			unmount(this.el, this.scene);
		}

		this.scene = new Scene(string, this.story.scenes[string]);

		mount(this.el, this.scene);
	}

	pause() {
		radioService.broadcast(DIRECTOR_PAUSE);
	}

	play() {
		radioService.broadcast(DIRECTOR_PLAY);
	}

	resize(width, height) {
		setStyle(this.el, { width: `${width}`, height: `${height}` });
	}

	// Here we relay internal messages from the radioService to the "outside" world via custom events
	setupSyntheticEvents() {
		radioService.register(
			DIRECTOR_SCENE_EVENT,
			message => {
				this.el.dispatchEvent(
					new CustomEvent(DIRECTOR_SCENE_EVENT, { detail: message })
				);
			},
			this
		);
	}
}

export default LoomSE;
