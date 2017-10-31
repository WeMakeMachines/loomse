import { FullscreenAPI } from './browser_api';

/**
 * Keeps a record of the scenes passed through by the user,
 * and provides some control over how to navigate the history
 */
const history = (() => {

	let scenes = [];

	return {
		record: function (object) {
			// records scene
			scenes.push(object);
		},

		erase: function () {
			// removes scene

		},

		remind: function () {
			// returns current scene
			return scenes[scenes.length - 1];
		},

		rewind: function () {
			// goes back 1 scene & erases current scene
			let scene;
			if (scenes.length > 1) {
				scenes.splice(scenes.length - 1, 1);
			}
			scene = scenes[scenes.length - 1];
			return scene;
		},

		saveToLocalStorage: function () {
			// save to html5 local storage
		}
	};
})();

const browser = {

	/**
	 * Checks which device is currently being used
	 * @returns {string}
	 */
	check: () => 'desktop',

	fullscreen: function(element) {
		this.fullscreen = new FullscreenAPI(element);
	}
};

export { history, browser };