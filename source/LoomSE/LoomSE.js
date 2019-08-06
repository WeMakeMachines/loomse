import { Story, Scene } from './Models';

import { radioService } from '../lib/radioService';

import { setupAppConfig } from './appConfig';

import { initialiseView } from './Containers';

import { VIDEO_TIMEUPDATE } from '../constants/applicationActions';

import state from './state';

import { secondsToMilliseconds } from './tools/time';

class LoomError extends Error {}

export class Loom {
	constructor(parameters, appState = state) {
		setupAppConfig(parameters.initialParameters);
		initialiseView(parameters.parent);

		this.lastState = parameters.lastState;
		this.isClientSupported = parameters.isClientSupported;
		this.scene = null;
		this.story = new Story();
		this.state = appState;

		this.story
			.readScript()
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
