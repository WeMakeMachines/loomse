import LoomSE from './LoomSE';

import { browser } from './services';

import config from './constants/config';

import { VIDEO_PAUSE, VIDEO_PLAY } from './constants/applicationActions';

import { initialiseView } from './LoomSE/view';
import { initialiseRadio } from './services';

import state from './LoomSE/state';

export default class App {
	constructor(node) {
		this.node = node;
		this.version = config.version;
		this.v = this.version;

		initialiseView(node);
		initialiseRadio(node);

		new LoomSE({
			node,
			lastState: browser.localStorage.getData(),
			isClientSupported: browser.isCompatible()
		});
	}

	reload() {}

	pause() {
		const event = new CustomEvent(VIDEO_PAUSE);

		this.node.dispatchEvent(event);
	}

	play() {
		const event = new CustomEvent(VIDEO_PLAY);

		this.node.dispatchEvent(event);
	}

	seek() {}

	skip() {}

	status() {}

	currentTime() {
		return state.time;
	}

	duration() {}
}
