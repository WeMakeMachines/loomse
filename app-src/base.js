/**
 * Loom Story Engine
 *
 */
import { ajaxRequest, clock, report } from './tools/common';
import { browser, fullScreen } from './tools/browser';
import config from './config';
import data from './model/data';
import gui from './view/gui';
import media from './view/media';
import scriptHandler from './model/scriptHandler';
import view from './view/controller';

export default (function () {

	/**
	 * The public interface
	 *
	 */
	return {
		// namespace for our external modules
		Modules: function () {
		},

		pause: function () {
			media.pause();
			return 'Paused';
		},

		play: function () {
			media.play();
			return 'Playing';
		},

		seek: function (time) {
			// scrub to time in media
			// time in seconds 4 = 4 seconds
			media.seek(time);
			return 'Seeking';
		},

		reload: function () {
			// restarts the current scene

			return 'Reloaded scene';
		},

		skip: function (sceneName) {
			// abandon current scene and load the named scene

			return 'Skipped to scene' + sceneName;
		},

		viewportResize: function () {

		},

		fullScreen: fullScreen.toggle,

		status: function () {
			// report stats on media
			report(config);
			report('Current time:' + media.getCurrentTime() + ' / Duration: ' + media.getLength());
		},

		currentTime: {
			seconds: function () {
				return media.getCurrentTime();
			},

			object: function () {
				return clock(media.getCurrentTime());
			}
		},

		duration: {
			seconds: function () {
				return media.getLength();
			},

			object: function () {
				return clock(media.getLength());
			}
		},

		/**
		 * Our public initialise method, used to initialise our application
		 * @param {Function} callback - callback to run after script processing
		 *
		 * @return {Boolean} returns false and halts script if conditions are not met
		 */
		initialise: function (callback) {

			let scriptSrc,
				deviceType = browser.check(),
				validateDOM,
				validateScript;

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

			validateDOM = new Promise(function (resolve) {
				resolve(view.initialise());
			});
			validateScript = ajaxRequest(scriptSrc, 'JSON');

			Promise.all([validateDOM, validateScript])
				.then((values) => {
					data.script = values[1];
					data.modules = new loomSE.Modules();
					scriptHandler.initialise(data.script);
					//gui.load();
					if (callback) {
						callback();
					}
				})
				.catch((reason) => {
					report('Unable to initialise. Please check your configuration files.');
					report(reason);
					return false;
				});

			return true;

		}
	};

}());
