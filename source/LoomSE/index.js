import { el, mount, setStyle } from 'redom';

import styles from './styles';

import Story from './Components/Story';
import Scene from './Components/Scene';

import scriptSchema from './schemas/script';

import { jsonValidatorService, radioService } from './services';
import { getCurrentDuration, getCurrentTime } from './reporters';
import { ajaxRequest } from './lib';

import {
	DIRECTOR_PAUSE,
	DIRECTOR_PLAY,
	DIRECTOR_SCENE_EVENT
} from './constants/directorEvents';

class LoomSE {
	constructor(config = {}) {
		this.el = el('#loomSE', {
			style: {
				...styles,
				width: `${config.width}px`,
				height: `${config.height}px`
			}
		});

		this.story = {};
		this.scene = {};

		this.setupSyntheticEvents();
	}

	currentDuration() {
		return getCurrentDuration();
	}

	currentTime() {
		return getCurrentTime();
	}

	loadScriptFromUrl(url) {
		return new Promise((resolve, reject) => {
			ajaxRequest(url, 'JSON')
				.then(json => {
					resolve(json);
				})
				.catch(error => {
					reject('Unable to load script from url', error);
				});
		});
	}

	validateJson(json) {
		return new Promise((resolve, reject) => {
			jsonValidatorService(json, scriptSchema)
				.then(() => {
					resolve();
				})
				.catch(error => {
					reject('Not a valid script', error);
				});
		});
	}

	setStory(json) {
		this.story = new Story(json);
	}

	loadScene(string) {
		if (this.scene) {
			this.unloadScene();
		}

		this.scene = new Scene(string, this.story.scenes[string]);

		mount(this.el, this.scene);
	}

	unloadScene() {}

	pause() {
		radioService.broadcast(DIRECTOR_PAUSE);
	}

	play() {
		radioService.broadcast(DIRECTOR_PLAY);
	}

	resize(width, height) {
		setStyle(this.el, { width: `${width}px`, height: `${height}px` });
	}

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
