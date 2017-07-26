/**
 * Handles the script logic;
 * a collection of methods that set and process
 * the media elements in the Script
 *
 */

import { cleanString, report } from '../tools/common';
import config from '../configs/config';
import { data } from './data';
import events from './events';
import media from '../view/media';

const scriptHandler = (function () {

	/**
	 * Scene class
	 */
	class Scene {

		/**
		 * Constructor
		 * @param {String} title
		 * @param {String} language
		 * @param {Object} assets
		 */
		constructor (title, language, assets) {
			this.title = title;
			this.shortName = assets.short_name;
			this.longName = assets.long_name;
			this.sceneId = cleanString(this.title);
			this.media = assets.media;
			this.subtitles = assets.media.subtitles[language];
			this.events = assets.events;
		}
	}

	/**TODO
	 * Parses and normalises values in the script
	 * @param {Object} script
	 * @param {Function} callback
	 */
	function normaliseScript(script, callback) {
		let returnedScript = script,
			status = true;

		callback(status, returnedScript);
	}

	/**
	 * Sets the scene
	 * Runs when a new scene is set from the Script
	 * Pulls the relevant scene details from the object,
	 * resets parameters and launches the process() method.
	 *
	 * @param {Object} scriptObject
	 * @param {Object} scene
	 */
	function setScene(scriptObject, scene) {
		let checkForPreviousScene = !data.currentScene === null;

		if (checkForPreviousScene) {
			data.sceneHistory.push(data.currentScene);
		}

		data.currentScene = new Scene(scene, config.behaviour.settings.language, scriptObject.scenes[scene]);

		//check if subtitles should be on
		// if (config.behaviour.settings.subtitles === true) {
		// 	subtitles.on();
		// } else {
		// 	subtitles.off();
		// }
		// subtitles.parse(data.currentScene.subtitles);

		//history.record(data.currentScene); // disabled for now
	}

	/**
	 * Processes the current scene
	 * Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
	 * Each 'media' type also has a number of events.js
	 *
	 * @param {Object} scene
	 */
	function process(scene) {

		media.initialise(scene.media, (status, autoplay) => { // TODO check what's going on here
			let checkForEvents = Array.isArray(scene.events) && scene.events.length > 0;

			if (!status) {
				report('Unable to initialise media');
				return false;
			}

			if (checkForEvents) {
				events.initialise(scene.events);
			}

			if (autoplay) {
				// view.resolution.video.height = media.object.videoHeight;
				// view.resolution.video.height = media.object.videoWidth;
				media.play();
			}
		});
	}

	return {
		initialise: function(script) {
			normaliseScript(script, (status, returnedScript) => {
				if (status) {
					setScene(returnedScript, config.firstScene);
					process(data.currentScene);
				} else {
					report('Critical error, unable to read script');
				}
			});
		}
	};
}());

export default scriptHandler;