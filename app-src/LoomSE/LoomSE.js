import { Story, Scene } from './Models';

import state from './state';

export class LoomSE {
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
				throw new Error(error);
			});
	}

	loadScene(string, registerInHistory) {
		registerInHistory = registerInHistory || true;

		const scene = this.story.scenes[string];

		state.scene = new Scene(scene);

		if (registerInHistory) {
			state.addToHistory(string);
		}
	}
}
