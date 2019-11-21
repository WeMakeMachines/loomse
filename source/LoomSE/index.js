import { el, mount, setStyle } from 'redom';

import styles from './styles';

import Story from './Components/Story';
import Scene from './Components/Scene';

import scriptSchema from './schemas/script';

import { jsonValidatorService, radioService } from './services';
import { ajaxRequest } from './lib';

import { DIRECTOR_PAUSE, DIRECTOR_PLAY } from './constants/applicationActions';

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

		this.scene = new Scene(this.story.scenes[string]);

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
}

export default LoomSE;
