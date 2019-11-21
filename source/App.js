import Loom from './LoomSE';

import { isCompatible, localStorage } from './LoomSE/lib/browser';

import { initialiseRadio, radioService } from './LoomSE/lib/radioService';

import packageJson from '../package';

import {
	DIRECTOR_PAUSE,
	DIRECTOR_PLAY
} from './LoomSE/constants/applicationActions';

/**
 * This function represents the public constructor object for LoomSE
 * @param {HTMLElement} parent The parent element to which the application will attach to
 * @param {Object} initialParameters
 * @returns {Object} Public API
 * @constructor
 */
export default function App(parent, initialParameters) {
	const version = packageJson.version;

	initialiseRadio(parent);

	const loom = new Loom({
		parent,
		initialParameters,
		lastState: localStorage.getData(),
		isClientSupported: isCompatible()
	});

	return {
		reload() {
			loom.loadScene(loom.state.scene);
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
			return loom.state.time;
		},

		version,

		v: version
	};
}