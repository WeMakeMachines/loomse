/**
 * Loom Story Engine
 */

import 'babel-polyfill';

/** Config **/
import config from './configs/config.json';
import storyBehaviour from './configs/storyBehaviour.json';

/** Tools **/
import { ajaxRequest, clock, report } from './tools/common';
import { browser } from './tools/browser';

/** Models **/
import data, { initialiseDataObject } from './model/data';
import sceneEventsModel from './model/sceneEvents';
import scriptHandler from './model/scriptHandler';
import subtitlesModel from './model/subtitles';

/** View components **/
import media from './view/components/media/media';
import loading from './view/loading';
import popup from './view/components/popup/popup';
import view from './view/controller';

/** Html **/
import baseHtml from './html/base.html';
import askRestoreStateHtml from './html/askRestoreState.html';
import unableToPlayHtml from './html/unableToPlay.html';

const VERSION = config.version;

/**
 * Determines the appropriate source of the script (mobile or desktop)
 * @returns {object}
 */
function getScriptSource() {
	if (browser.isSmallScreen()) {
		return config.scripts.mobile;
	}

	return config.scripts.desktop;
}

/**
 *
 */
function promptRestoreLastState(state) {
	loading.stop();

	popup.splash({
		html     : askRestoreStateHtml,
		callbacks: {
			accept: {
				id    : 'askRestoreStateHtml__accept',
				action: function() {
					prepareAllParts(state[state.length - 1]);
				}
			},
			cancel: {
				id    : 'askRestoreStateHtml__cancel',
				action: function() {
					prepareAllParts(storyBehaviour.firstScene);
				}
			}
		}
	});
}

/**
 *
 */
function unableToPlay() {

	popup.splash({
		html: unableToPlayHtml
	});

}

/**
 * Sets the wheels in motion
 * @param {string} scene
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
		loading.stop();

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

	/**
	 * Restarts the current scene
	 */
	reload() {
		media.seek(0);
	},

	pause() { media.pause(); },

	play() { media.play(); },

	/**
	 * Scrub to time in media
	 * @param {number} time in seconds
	 */
	seek(time) { media.seek(time); },

	/**
	 * Abandon current scene and load the named scene
	 * @param {string} sceneName
	 */
	skip(sceneName) { prepareAllParts(sceneName); },

	/**
	 * Report media stats
	 */
	status() {
		let time = clock(media.getCurrentTime()),
			duration = clock(media.getLength());

		report(`Current time: ${time}\nDuration: ${duration}`);
	},

	currentTime() { return clock(media.getCurrentTime()); },

	duration() { return clock(media.getLength()); },

	version: VERSION,

	v: VERSION,

	/**
	 * Our public initialise method, used to initialise our application
	 */
	initialise() {
		let browserSupport = browser.isCompatible(),
			previousState = browser.storage.returnState(),
			scene = storyBehaviour.firstScene,
			scriptSrc = getScriptSource(),
			requestScript = ajaxRequest(scriptSrc, 'JSON');

		initialiseDataObject();
		view.initialise(baseHtml);
		loading.initialise();

		if (!browserSupport) {
			unableToPlay();
			return;
		}

		requestScript.then((values) => {
			data.script = values;

			if (previousState) {
				promptRestoreLastState(previousState);
			} else {
				prepareAllParts(scene);
			}
		});

		requestScript.catch(() => {
			report('Oops, something went wrong with the script :(');
		});
	}
};
