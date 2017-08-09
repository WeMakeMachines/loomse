/**
 * Loom Story Engine
 *
 */
import { ajaxRequest, clock, report } from './tools/common';
import { browser, fullScreen } from './tools/browser';
import data, { initialiseDataObject } from './model/data';
import config from './configs/config';
import media from './view/media';
import scriptHandler from './model/scriptHandler';
import view from './view/viewController';

const VERSION = config.version;

export default {

	pause: () => { media.pause(); },

	play: () =>	{ media.play(); },

	/**
	 * Scrub to time in media
	 * @param {Number} time in seconds
	 */
	seek: (time) => { media.seek(time); },

	/**
	 * Restarts the current scene
	 */
	reload: () => {
		media.seek(0);
	},

	/**
	 * Abandon current scene and load the named scene
	 * @param {String} sceneName
	 */
	skip: (sceneName) => {
		scriptHandler.initialise(sceneName);
	},

	fullScreen: fullScreen.toggle,

	/**
	 * Report media stats
	 */
	status: () => {
		report('Current time:' + clock(media.getCurrentTime()) + ' / Duration: ' + clock(media.getLength()));
	},

	currentTime: () => clock(media.getCurrentTime()),

	duration: () => clock(media.getLength()),

	version: VERSION,

	v: VERSION,

	/**
	 * Our public initialise method, used to initialise our application
	 * @param {Function} callback - callback to run after script processing
	 *
	 * @returns {Boolean} returns false and halts script if conditions are not met
	 */
	initialise: (callback) => {

		let scriptSrc,
			deviceType = browser.check(),
			checkDOM,
			receiveScript;

		switch (deviceType) {
			case 'mobile':
				scriptSrc = config.scripts.mobile;
				break;
			case 'desktop':
				scriptSrc = config.scripts.desktop;
				break;
			default:
				report('Your browser is not supported.');
				return false;
		}

		checkDOM = new Promise((resolve) => {
			resolve(view.initialise());
		});
		receiveScript = ajaxRequest(scriptSrc, 'JSON');

		initialiseDataObject();

		Promise.all([checkDOM, receiveScript])
			.then((values) => {
				data.script = values[1];
				scriptHandler.initialise(config.firstScene);
				//gui.load();
				if (callback) {
					callback();
				}
			})
			.catch((reason) => {
				report('Oops! Something went wrong. This experience will not work correctly.');
				report(reason);
				return false;
			});
	}

};