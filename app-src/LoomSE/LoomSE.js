import { Story, Scene } from './Models';

import { radio } from '../services';

import { VIDEO_TIMEUPDATE } from '../constants/applicationActions';

import state from './state';

import { secondsToMilliseconds } from './tools/time';

class LoomError extends Error {}

export class Loom {
	constructor(options) {
		this.node = options.node;
		this.lastState = options.lastState;
		this.isClientSupported = options.isClientSupported;
		this.story = new Story();
		this.state = state;

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
		registerInHistory = registerInHistory || true;

		const scene = this.story.scenes[string];

		state.scene = new Scene(scene);

		if (registerInHistory) {
			state.addToHistory(string);
		}
	}

	updateStateTime() {
		radio.listen(VIDEO_TIMEUPDATE, payload => {
			if (payload.time) {
				state.time = secondsToMilliseconds(payload.time);
			}
		});
	}
}
