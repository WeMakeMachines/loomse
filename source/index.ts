import { mount } from 'redom';

import { VERSION } from './version';
import LoomSE from './LoomSE';
import { ScriptedStory } from './LoomSE/types/scriptedStory';

export default function loomse(
	el: HTMLElement,
	config: { width?: string; height?: string } = {}
) {
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

		startScript(json: {}) {
			try {
				loomSE.setStory(json as ScriptedStory);
				loomSE.loadScene((json as ScriptedStory).firstScene);

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