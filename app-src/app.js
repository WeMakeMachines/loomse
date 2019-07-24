import Loom from './LoomSE';

import { browser, initialiseRadio, radio } from './services';

import packageJson from '../package';

import { DIRECTOR_PAUSE, DIRECTOR_PLAY } from './constants/applicationActions';

import { initialiseView } from './LoomSE/view';

import state from './LoomSE/state';

export default function App(HTMLElement, config) {
	const node = HTMLElement;
	const version = packageJson.version;

	initialiseView(node);
	initialiseRadio(node);

	const loom = new Loom({
		node,
		config,
		lastState: browser.localStorage.getData(),
		isClientSupported: browser.isCompatible()
	});

	const api = {
		reload() {
			loom.loadScene(state.scene);
		},

		pause() {
			radio.broadcast(DIRECTOR_PAUSE);
		},

		play() {
			radio.broadcast(DIRECTOR_PLAY);
		},

		skipTo(scene) {
			loom.loadScene(scene);
		},

		currentTime() {
			return state.time;
		},

		version,

		v: version
	};

	return api;
}
