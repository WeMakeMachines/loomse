import Loom from './LoomSE';

import { browser, initialiseRadio, radio } from './services';

import packageJson from '../package';

import { DIRECTOR_PAUSE, DIRECTOR_PLAY } from './constants/applicationActions';

import { initialiseView } from './LoomSE/view';

import state from './LoomSE/state';

let loom;

export default class App {
	constructor(node) {
		this.node = node;
		this.version = packageJson.version;
		this.v = packageJson.version;

		initialiseView(node);
		initialiseRadio(node);

		loom = new Loom({
			node,
			lastState: browser.localStorage.getData(),
			isClientSupported: browser.isCompatible()
		});
	}

	reload() {
		loom.loadScene(state.scene);
	}

	pause() {
		radio.broadcast(DIRECTOR_PAUSE);
	}

	play() {
		radio.broadcast(DIRECTOR_PLAY);
	}

	skipTo(scene) {
		loom.loadScene(scene);
	}

	currentTime() {
		return state.time;
	}
}
