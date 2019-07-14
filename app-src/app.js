import Loom from './LoomSE';

import { browser, initialiseRadio, radio } from './services';

import config from './constants/config';

import { DIRECTOR_PAUSE, DIRECTOR_PLAY } from './constants/applicationActions';

import { initialiseView } from './LoomSE/view';

import state from './LoomSE/state';

let loom;

export default class App {
	constructor(node) {
		this.node = node;
		this.version = config.version;
		this.v = config.version;

		initialiseView(node);
		initialiseRadio(node);

		loom = new Loom({
			node,
			lastState: browser.localStorage.getData(),
			isClientSupported: browser.isCompatible()
		});
	}

	reload() {}

	pause() {
		radio.broadcast(DIRECTOR_PAUSE);
	}

	play() {
		radio.broadcast(DIRECTOR_PLAY);
	}

	seek() {}

	skipTo(scene) {
		loom.loadScene(scene);
	}

	status() {}

	currentTime() {
		return state.time;
	}

	duration() {}
}
