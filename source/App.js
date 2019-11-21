import LoomSE from './LoomSE';

import packageJson from '../package';

/**
 * This function represents the public interface (facade) for LoomSE
 * @param {HTMLElement} node The parent element to which the application will attach
 * @param {Object} config
 * @returns {Object} Public API
 * @constructor
 */
export default function App(node, config) {
	const version = packageJson.version;
	const loomSE = new LoomSE(node, config);

	return {
		loadScriptFromJson(json) {
			loomSE.loadScriptFromJson(json);
		},

		loadScriptFromUrl(url) {
			loomSE.loadScriptFromUrl(url);
		},

		reload() {
			loomSE.loadScene(loomSE.state.scene);
		},

		pause() {
			loomSE.pause();
		},

		play() {
			loomSE.play();
		},

		skipTo(scene) {
			loomSE.loadScene(scene);
		},

		version,

		v: version
	};
}
