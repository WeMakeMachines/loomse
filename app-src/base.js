/**
 * Loom Story Engine
 *
 */
import config from './configs/config';
import storyBehaviour from './configs/storyBehaviour';

import { ajaxRequest, clock, report } from './tools/common';
import { browser, fullScreen } from './tools/browser';

import data, { initialiseDataObject } from './model/data';
import sceneEventsModel from './model/sceneEvents';
import scriptHandler from './model/scriptHandler';
import subtitlesModel from './model/subtitles';

import media from './view/media';
import view from './view/viewController';

const VERSION = config.version;

/**
 * Determines the appropriate source of the script (mobile or desktop)
 * @returns {Object}
 */
function getScriptSource() {
	let deviceType = browser.check(),
		source;

	switch (deviceType) {
		case 'mobile':
			source = config.scripts.mobile;
			break;
		case 'desktop':
			source = config.scripts.desktop;
			break;
		default:
			break;
	}

	return source;
}

/**
 * Sets the wheels in motion
 * @param {String} scene
 */
function prepareAllParts(scene) {

	scriptHandler.initialise(scene);

	let checkForEvents = Array.isArray(data.currentScene.events) && data.currentScene.events.length > 0,
		checkSubtitles,
		subtitlesSrc;

	/**
	 * Plays media if autoplay is on
	 */
	function ready() {
		if (data.currentScene.media.autoplay) {
			media.play();
		}
	}

	media.initialise(data.currentScene.media);

	if (checkForEvents) {
		sceneEventsModel.initialise(data.currentScene.events);
	}

	if (storyBehaviour.subtitles.active) {
		subtitlesSrc = data.currentScene.media.subtitles[storyBehaviour.subtitles.language];

		checkSubtitles = subtitlesModel.initialise(subtitlesSrc);

		checkSubtitles.then(() => {
			subtitlesModel.on();
			ready();
		});

		checkSubtitles.catch(() => {
			report('Error');
		});
	} else {
		ready();
	}
}

export default {

	fullScreen: fullScreen.toggle,

	/**
	 * Restarts the current scene
	 */
	reload: () => {
		media.seek(0);
	},

	pause: () => { media.pause(); },

	play: () =>	{ media.play(); },

	/**
	 * Scrub to time in media
	 * @param {Number} time in seconds
	 */
	seek: (time) => { media.seek(time); },

	/**
	 * Abandon current scene and load the named scene
	 * @param {String} sceneName
	 */
	skip: (sceneName) => { prepareAllParts(sceneName); },

	/**
	 * Report media stats
	 */
	status: () => {
		let time = clock(media.getCurrentTime()),
			duration = clock(media.getLength());

		report(`Current time: ${time}\nDuration: ${duration}`);
	},

	currentTime: () => clock(media.getCurrentTime()),

	duration: () => clock(media.getLength()),

	version: VERSION,

	v: VERSION,

	/**
	 * Our public initialise method, used to initialise our application
	 *
	 */
	initialise: () => {
		let firstScene = storyBehaviour.firstScene,
			scriptSrc = getScriptSource(),
			checkScript = ajaxRequest(scriptSrc, 'JSON');

		initialiseDataObject();
		view.initialise();

		checkScript.then((values) => {
			data.script = values;

			prepareAllParts(firstScene);
		});

		checkScript.catch(() => {
			report('Oops, something went wrong with the script :(');
		});
	}
};