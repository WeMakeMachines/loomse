import { mount } from 'redom';

import { VERSION } from './version';
import LoomSE from './LoomSE';
import { ScriptedStory } from './LoomSE/types/scriptedStory';

/**
 * This function represents the public interface (facade) for LoomSE
 * @param {HTMLElement} el The parent element to which the application will attach
 * @param {Object} config
 * @returns {Object} Public API
 * @constructor
 */
export default function App(el: HTMLElement, config = {}) {
	const version = VERSION;
	const loomSE = new LoomSE(config);

	mount(el, loomSE);

	return {
		currentDuration() {
			return loomSE.currentDuration();
		},

		currentTime() {
			return loomSE.currentTime();
		},

		el: loomSE.el,

		startScript(scriptedStory: ScriptedStory) {
			try {
				loomSE.setStory(scriptedStory);
				loomSE.loadScene(scriptedStory.firstScene);

				return Promise.resolve();
			} catch (error) {
				return Promise.reject(`Unable to load story object, ${error}`);
			}
		},

		pause() {
			loomSE.pause();
		},

		play() {
			loomSE.play();
		},

		reloadScene() {
			if (loomSE.scene?.sceneId) {
				loomSE.loadScene(loomSE.scene?.sceneId);
			}
		},

		resize(width: number, height: number) {
			loomSE.resize(width, height);
		},

		skipTo(sceneName: string) {
			loomSE.loadScene(sceneName);
		},

		version,

		v: version
	};
}
