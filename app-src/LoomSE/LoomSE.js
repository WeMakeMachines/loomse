import { Story, Scene } from './Models';

import { radioService } from '../lib';

import { setupAppConfig } from './appConfig';

import { VIDEO_TIMEUPDATE } from '../constants/applicationActions';

import state from './state';

import { secondsToMilliseconds } from './tools/time';

class LoomError extends Error {}

export class Loom {
	constructor(options) {
		setupAppConfig(options.config);

		this.node = options.node;
		this.lastState = options.lastState;
		this.isClientSupported = options.isClientSupported;
		this.story = new Story();
		this.scene = null;

		this.story
			.load()
			.then(() => {
				this.loadScene(this.story.firstScene);
			})
			.catch(error => {
				throw new LoomError(error);
			});

		this.updateStateTime();
	}

	loadScene(string, registerInHistory) {
		if (this.scene) {
			this.unloadScene();
		}

		// TODO find better solution
		setTimeout(() => {
			registerInHistory = registerInHistory || true;

			this.scene = new Scene(this.story.scenes[string]);

			state.scene = string;

			if (registerInHistory) {
				state.addToHistory(string);
			}
		});
	}

	unloadScene() {
		this.scene.unmountComponents();
	}

	updateStateTime() {
		radioService.listen(VIDEO_TIMEUPDATE, event => {
			if (event.detail.time) {
				state.time = secondsToMilliseconds(event.detail.time);
			}
		});
	}
}
