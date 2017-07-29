/**
 * Handles the script logic;
 * a collection of methods that set and process
 * the media elements in the Script
 *
 */

import { cleanString, report } from '../tools/common';
import config from '../configs/config';
import data from './data';
import media from '../view/media';
import sceneEvents from './sceneEvents';

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
}

/**
 * Processes the current scene
 * Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
 * Each 'media' type also has a number of sceneEvents.js
 *
 * @param {Object} scene
 */
function process(scene) {

	media.initialise(scene.media, (status, autoplay) => {
		let checkForEvents = Array.isArray(scene.events) && scene.events.length > 0;

		if (!status) {
			report('Unable to initialise media');
			return false;
		}

		if (checkForEvents) {
			sceneEvents.initialise(scene.events);
		}

		if (autoplay) {
			// view.resolution.video.height = media.object.videoHeight;
			// view.resolution.video.height = media.object.videoWidth;
			media.play();
		}
	});
}

const scriptHandler = {

	/**
	 * Initialises module
	 * @param {Object} script
	 */
	initialise: function(script) {
		setScene(script, config.firstScene);
		process(data.currentScene);
	}
};

export { scriptHandler as default };