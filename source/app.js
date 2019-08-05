import Loom from './LoomSE';

import { browser, initialiseRadio, radioService } from './lib';

import packageJson from '../package';

import { DIRECTOR_PAUSE, DIRECTOR_PLAY } from './constants/applicationActions';

import { initialiseView } from './LoomSE/view';

import state from './LoomSE/state';

/**
 * This function represents the public constructor object for LoomSE
 * @param {HTMLElement} parent The parent element to which the application will attach to
 * @param {Object} config The configuration object
 * @returns {Object} Public API
 * @constructor
 */
export default function App(parent, config) {
	const node = parent;
	const version = packageJson.version;

	initialiseRadio(node);
	initialiseView(node);

	const loom = new Loom({
		node,
		config,
		lastState: browser.localStorage.getData(),
		isClientSupported: browser.isCompatible()
	});

	return {
		reload() {
			loom.loadScene(state.scene);
		},

		pause() {
			radioService.broadcast(DIRECTOR_PAUSE);
		},

		play() {
			radioService.broadcast(DIRECTOR_PLAY);
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
}
