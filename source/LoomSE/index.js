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

class LoomSE_Error extends Error {}

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

	loadScriptFromJson(json) {
		this.validateAndLoadJson(json);
	}

	loadScriptFromUrl(url) {
		ajaxRequest(url, 'JSON')
			.then(json => {
				this.validateAndLoadJson(json);
			})
			.catch(error => {
				throw new LoomSE_Error(
					`Unable to load script from url, ${error}`
				);
			});
	}

	validateAndLoadJson(json) {
		jsonValidatorService(json, scriptSchema)
			.then(() => {
				this.story = new Story(json);
				this.loadScene(this.story.firstScene);
			})
			.catch(error => {
				throw new LoomSE_Error('Not a valid script', error);
			});
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
