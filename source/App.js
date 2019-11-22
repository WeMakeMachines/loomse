import { mount } from 'redom';

import LoomSE from './LoomSE';
import packageJson from '../package';

/**
 * This function represents the public interface (facade) for LoomSE
 * @param {HTMLElement} el The parent element to which the application will attach
 * @param {Object} config
 * @returns {Object} Public API
 * @constructor
 */
export default function App(el, config) {
	const version = packageJson.version;
	const loomSE = new LoomSE(config);

	mount(el, loomSE);

	return {
		currentDuration() {
			return loomSE.currentDuration();
		},

		currentTime() {
			return loomSE.currentTime();
		},

		loadScriptFromJson(json) {
			loomSE.loadScriptFromJson(json);
		},

		loadScriptFromUrl(url) {
			loomSE.loadScriptFromUrl(url);
		},

		pause() {
			loomSE.pause();
		},

		play() {
			loomSE.play();
		},

		reloadScene() {
			loomSE.loadScene();
		},

		resize(width, height) {
			loomSE.resize(width, height);
		},

		skipTo(scene) {
			loomSE.loadScene(scene);
		},

		version,

		v: version
	};
}
