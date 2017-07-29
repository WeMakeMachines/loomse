/**
 * Loom Story Engine
 *
 */
import { ajaxRequest, clock, report } from './tools/common';
import { browser, fullScreen } from './tools/browser';
import data, {initialiseDataObject } from './model/data';
import config from './configs/config';
import media from './view/media';
import scriptHandler from './model/scriptHandler';
import view from './view/viewController';

const VERSION = '0.4.0';

export default {

	/**
	 * The public interface
	 *
	 */
	pause: function() {
		media.pause();
	},

	play: function () {
		media.play();
	},

	/**TODO NOT YET IMPLEMENTED
	 * Scrub to time in media
	 * @param {Number} time Seconds
	 */
	seek: function(time) {
	},

	/**TODO NOT YET IMPLEMENTED
	 * Restarts the current scene
	 */
	reload: function() {
	},

	/**TODO NOT YET IMPLEMENTED
	 * Abandon current scene and load the named scene
	 * @param {String} sceneName
	 */
	skip: function(sceneName) {
	},

	fullScreen: fullScreen.toggle,

	/**
	 * Report media stats
	 */
	status: function() {
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
	initialise: function (callback) {

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

		checkDOM = new Promise(function (resolve) {
			resolve(view.initialise());
		});
		receiveScript = ajaxRequest(scriptSrc, 'JSON');

		initialiseDataObject();

		Promise.all([checkDOM, receiveScript])
			.then((values) => {
				data.script = values[1];
				//data.modules.js = new loomSE.Modules();
				scriptHandler.initialise(data.script);
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